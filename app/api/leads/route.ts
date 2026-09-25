import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin, getSupabaseLeadWriter } from "@/lib/supabase";

export const runtime = "nodejs";

const optionalText = (max: number) => z.string().trim().max(max).nullish().transform((value) => value || null);
const Lead = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^(?:\+66|0)[0-9]{8,9}$/),
  email: optionalText(150),
  service: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(180),
  budget: optionalText(100),
  message: optionalText(1500),
  privacy_consent: z.literal(true),
  marketing_consent: z.boolean().optional().default(false),
  consent_version: z.string().trim().min(1).max(40).optional().default("2026-09"),
  page_path: optionalText(500),
  referrer_host: optionalText(255),
  utm_source: optionalText(120),
  utm_medium: optionalText(120),
  utm_campaign: optionalText(180),
  utm_content: optionalText(180),
  utm_term: optionalText(180),
  website: z.string().max(200).optional().default(""),
});

const submissionWindows = new Map<string, number[]>();
function isRateLimited(request: Request) {
  const key = (request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "local").trim();
  const now = Date.now();
  const recent = (submissionWindows.get(key) || []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 5) return true;
  recent.push(now); submissionWindows.set(key, recent);
  if (submissionWindows.size > 5000) submissionWindows.clear();
  return false;
}

function bool(value: unknown) { return value === true || value === "true" || value === "on" || value === "1"; }
function safeFilename(name: string) { return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-90) || "photo.jpg"; }

async function readRequest(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const raw: Record<string, unknown> = {};
    for (const key of ["name","phone","email","service","location","budget","message","consent_version","page_path","referrer_host","utm_source","utm_medium","utm_campaign","utm_content","utm_term","website"]) raw[key] = form.get(key)?.toString() || null;
    raw.privacy_consent = bool(form.get("privacy_consent"));
    raw.marketing_consent = bool(form.get("marketing_consent"));
    const photos = form.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
    return { raw, photos };
  }
  const raw = await request.json().catch(() => null);
  return { raw, photos: [] as File[] };
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: "ไม่อนุญาตให้ส่งข้อมูลจากเว็บไซต์อื่น" }, { status: 403 });

  const { raw, photos } = await readRequest(request);
  const parsed = Lead.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "ข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้อง" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true, photosRequested: 0, photosUploaded: 0 });
  if (photos.length > 5) return NextResponse.json({ error: "แนบรูปได้สูงสุด 5 รูป" }, { status: 400 });
  const allowed = new Set(["image/jpeg","image/png","image/webp","image/heic","image/heif"]);
  if (photos.some(file => file.size > 8 * 1024 * 1024 || !allowed.has(file.type))) return NextResponse.json({ error: "รองรับ JPG, PNG, WEBP, HEIC และไฟล์ละไม่เกิน 8 MB" }, { status: 400 });
  if (photos.reduce((sum,file)=>sum+file.size,0) > 30 * 1024 * 1024) return NextResponse.json({ error: "ขนาดรูปทั้งหมดต้องไม่เกิน 30 MB" }, { status: 400 });
  if (isRateLimited(request)) return NextResponse.json({ error: "ส่งข้อมูลครบจำนวนชั่วคราว กรุณารอ 10 นาที หรือติดต่อทางโทรศัพท์/LINE" }, { status: 429 });

  const writer = getSupabaseLeadWriter();
  if (!writer) return NextResponse.json({ error: "ระบบรับข้อมูลยังไม่ได้เชื่อมต่อ กรุณาโทร 098-279-9145 หรือ LINE @522magc" }, { status: 503 });
  const admin = getSupabaseAdmin();
  const leadId = crypto.randomUUID();
  const uploadedPaths: string[] = [];
  if (photos.length && admin) {
    for (let index = 0; index < photos.length; index += 1) {
      const file = photos[index];
      const path = `${leadId}/${String(index + 1).padStart(2,"0")}-${Date.now()}-${safeFilename(file.name)}`;
      const { error } = await admin.storage.from("lead-photos").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
      if (!error) uploadedPaths.push(path);
      else console.error("lead_photo_upload_failed", error.message);
    }
  }

  const { website: _honeypot, ...lead } = parsed.data; void _honeypot;
  const insertPayload: Record<string, unknown> = { id: leadId, ...lead, status: "new" };
  if (uploadedPaths.length) insertPayload.photo_paths = uploadedPaths;
  let { error } = await writer.from("contact_leads").insert(insertPayload);
  if (error && uploadedPaths.length && /photo_paths/i.test(error.message || "")) {
    delete insertPayload.photo_paths;
    ({ error } = await writer.from("contact_leads").insert(insertPayload));
  }
  if (error) {
    if (admin && uploadedPaths.length) await admin.storage.from("lead-photos").remove(uploadedPaths).catch(()=>undefined);
    console.error("lead_insert_failed", error.code);
    return NextResponse.json({ error: "บันทึกข้อมูลไม่สำเร็จ กรุณาโทรหรือทัก LINE" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, leadId, photosRequested: photos.length, photosUploaded: uploadedPaths.length });
}
