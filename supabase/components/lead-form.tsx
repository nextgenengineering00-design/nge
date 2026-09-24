"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("loading");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    setStatus(res.ok ? "ok" : "error");
    if (res.ok) {
      event.currentTarget.reset();
      const w = window as typeof window & { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void };
      w.gtag?.("event", "generate_lead", { form_source: String(payload.source || "website") });
      w.fbq?.("track", "Lead");
    }
  }
  if (status === "ok") return <div className="form-success"><CheckCircle2 /><h3>รับข้อมูลแล้วครับ</h3><p>ทีมงานจะติดต่อกลับเพื่อถามรายละเอียดและนัดหมาย</p></div>;
  return <form className={compact ? "lead-form compact" : "lead-form"} onSubmit={submit}>
    <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
    <label>ชื่อผู้ติดต่อ<input name="name" required minLength={2} maxLength={100} placeholder="ชื่อของคุณ" /></label>
    <label>เบอร์โทร<input name="phone" required inputMode="tel" minLength={9} maxLength={20} placeholder="0982799145" /></label>
    {!compact && <><label>ประเภทงาน<select name="service" required defaultValue=""><option value="" disabled>เลือกประเภทงาน</option><option>สร้างบ้าน/อาคาร</option><option>รีโนเวท/ต่อเติม</option><option>ถนน/งานโยธา</option><option>งานระบบ</option><option>ยังไม่แน่ใจ</option></select></label><label>พื้นที่โครงการ<input name="location" required placeholder="อำเภอ / จังหวัด" /></label><label className="span-2">รายละเอียด<textarea name="message" rows={4} maxLength={1200} placeholder="ขนาดพื้นที่ งบคร่าว ๆ และช่วงเวลาที่อยากเริ่ม" /></label></>}
    <input type="hidden" name="source" value={compact ? "home-quick-form" : "contact-form"} />
    <button disabled={status === "loading"}>{status === "loading" ? "กำลังส่ง..." : <>ขอให้ทีมงานติดต่อกลับ <ArrowRight size={18} /></>}</button>
    {status === "error" && <p className="form-error">ส่งไม่สำเร็จ กรุณาโทร 098-279-9145 หรือทัก LINE @522magc</p>}
    <small>ข้อมูลนี้ใช้เพื่อติดต่อกลับเรื่องโครงการเท่านั้น</small>
  </form>;
}
