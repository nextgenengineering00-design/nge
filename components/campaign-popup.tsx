"use client";

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./campaign-popup.module.css";

const EXCLUDED_PATHS = ["/construction-quote", "/contact", "/privacy", "/crm"];

export function CampaignPopup() {
  const pathname = usePathname();
  const initialPathRef = useRef(pathname);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== initialPathRef.current) {
      setOpen(false);
      return;
    }

    const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const legacyNavigation = window.performance as Performance & { navigation?: { type: number; TYPE_RELOAD: number } };
    const isReload = navigation?.type === "reload"
      || legacyNavigation.navigation?.type === legacyNavigation.navigation?.TYPE_RELOAD;
    if (!isReload) return;

    const path = window.location.pathname;
    if (EXCLUDED_PATHS.some((item) => path === item || path.startsWith(`${item}/`))) return;
    const timer = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], input, select, [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input")?.focus(), 60);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function backdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) close();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const fields = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      name: String(fields.get("name") || ""),
      phone: String(fields.get("phone") || ""),
      email: String(fields.get("email") || ""),
      service: String(fields.get("service") || ""),
      location: String(fields.get("location") || ""),
      message: "ลงทะเบียนผ่านป๊อปอัปโปรลดค่าก่อสร้าง 1%",
      privacy_consent: fields.get("privacy_consent") === "on",
      marketing_consent: false,
      consent_version: "2026-10",
      page_path: `${window.location.pathname}${window.location.search}`,
      referrer_host: document.referrer ? new URL(document.referrer).host : null,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
      website: String(fields.get("website") || ""),
    };
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "ส่งข้อมูลไม่สำเร็จ");
      setStatus("success");
      const tracking = window as typeof window & { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void };
      tracking.gtag?.("event", "generate_lead", { form_source: "campaign-popup", lead_id: result.leadId || "" });
      tracking.fbq?.("track", "Lead");
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  if (!open) return null;
  return <div className={styles.backdrop} onMouseDown={backdropClick}>
    <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="campaign-popup-title">
      <button className={styles.close} type="button" onClick={close} aria-label="ปิดป๊อปอัป">×</button>
      <section className={styles.visual} aria-label="บริการรับเหมาก่อสร้าง NGE">
        <div className={styles.visualContent}>
          <p className={styles.eyebrow}>สิทธิ์พิเศษสำหรับโครงการใหม่</p>
          <h2>ลดค่าก่อสร้าง 1%<span className={styles.amountLine}><span className={styles.srOnly}>สูงสุด 100,000 บาท</span><span className={styles.amountText} aria-hidden="true">สูงสุด </span><span className={styles.amountRoll} aria-hidden="true"><span className={styles.amountTrack}><b>20,000</b><b>50,000</b><b>80,000</b><b>100,000</b></span></span><span className={styles.amountText} aria-hidden="true"> บาท</span></span></h2>
          <p>บ้าน อาคาร รีโนเวท งานระบบ หรืองานโยธา พร้อมสำรวจหน้างานและประเมินราคาเบื้องต้น</p>
        </div>
      </section>
      <section className={styles.formPanel}>
        {status === "success" ? <div className={styles.success} role="status">
          <div className={styles.successIcon}>✓</div>
          <h3 id="campaign-popup-title">รับข้อมูลเรียบร้อยแล้ว</h3>
          <p>ทีม NGE จะติดต่อกลับเพื่อสอบถามรายละเอียดโครงการครับ</p>
        </div> : <>
          <header>
            <strong>โปรโครงการใหม่ · NGE</strong>
            <h3 id="campaign-popup-title">ลงทะเบียนรับข้อเสนอ</h3>
            <p>กรอกข้อมูลสั้น ๆ ใช้เวลาไม่เกิน 1 นาที</p>
          </header>
          <form className={styles.form} onSubmit={submit}>
            <input className={styles.hp} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label className={styles.field}>ชื่อผู้ติดต่อ<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="ชื่อ–นามสกุล" /></label>
            <label className={styles.field}>เบอร์โทรศัพท์<input name="phone" required inputMode="tel" minLength={9} maxLength={20} autoComplete="tel" placeholder="เช่น 0982799145" /></label>
            <label className={styles.field}>ประเภทงาน<select name="service" required defaultValue=""><option value="" disabled>เลือกประเภทงาน</option><option>สร้างบ้าน/อาคาร</option><option>รีโนเวท/ต่อเติม</option><option>ถนน/งานโยธา</option><option>งานระบบ</option><option>ยังไม่แน่ใจ</option></select></label>
            <label className={styles.field}>พื้นที่โครงการ<input name="location" required minLength={2} maxLength={180} placeholder="อำเภอ / จังหวัด" /></label>
            <label className={styles.consent}><input name="privacy_consent" type="checkbox" required /><span>ยินยอมให้ NGE ใช้ข้อมูลเพื่อติดต่อกลับเกี่ยวกับโครงการ ตาม <a href="/privacy" target="_blank" rel="noreferrer">นโยบายความเป็นส่วนตัว</a></span></label>
            <button className={styles.submit} disabled={status === "sending"}>{status === "sending" ? "กำลังส่งข้อมูล..." : "ลงทะเบียนรับสิทธิ์"}</button>
            <p className={styles.terms}>สำหรับสัญญาใหม่ 1,000,000 บาทขึ้นไป · เซ็นสัญญาภายใน 30 วัน · 1 สิทธิ์ต่อโครงการ<br />ไม่รวมงานเพิ่ม และไม่ใช้ร่วมโปรโมชันอื่น</p>
            {status === "error" && <p className={styles.status} role="alert">{error}</p>}
          </form>
        </>}
      </section>
    </div>
  </div>;
}
