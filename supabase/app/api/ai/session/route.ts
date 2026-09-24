import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, createAdminSession, isAdmin, isAdminConfigured, verifyAdminToken } from "@/lib/auth";

export async function GET(request: Request) {
  return NextResponse.json({ authenticated: isAdmin(request), configured: isAdminConfigured() });
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) return NextResponse.json({ error: "ยังไม่ได้ตั้ง AI_ADMIN_TOKEN ในระบบ" }, { status: 503 });
  const body = z.object({ token: z.string().min(1) }).safeParse(await request.json().catch(() => null));
  if (!body.success || !verifyAdminToken(body.data.token)) return NextResponse.json({ error: "รหัสผู้ดูแลไม่ถูกต้อง" }, { status: 401 });

  const session = createAdminSession();
  const response = NextResponse.json({ authenticated: true, message: "เข้าสู่ระบบแล้ว ใช้งานได้ 8 ชั่วโมง" });
  response.cookies.set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "strict",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
