import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseLeadWriter } from "@/lib/supabase";

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
  recent.push(now);
  submissionWindows.set(key, recent);
  if (submissionWindows.size > 5000) submissionWindows.clear();
  return false;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: "ไม่อนุญาตให้ส่งข้อมูลจากเว็บไซต์อื่น" }, { status: 403 });

  const parsed = Lead.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "ข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้อง" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  if (isRateLimited(request)) return NextResponse.json({ error: "ส่งข้อมูลครบจำนวนชั่วคราว กรุณารอ 10 นาที หรือติดต่อทางโทรศัพท์/LINE" }, { status: 429 });

  const supabase = getSupabaseLeadWriter();
  if (!supabase) return NextResponse.json({ error: "ระบบรับข้อมูลยังไม่ได้เชื่อมต่อ กรุณาโทร 098-279-9145 หรือ LINE @522magc" }, { status: 503 });

  const { website: _honeypot, ...lead } = parsed.data;
  void _honeypot;
  const { error } = await supabase.from("contact_leads").insert({ ...lead, status: "new" });
  if (error) {
    console.error("lead_insert_failed", error.code);
    return NextResponse.json({ error: "บันทึกข้อมูลไม่สำเร็จ กรุณาโทรหรือทัก LINE" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
