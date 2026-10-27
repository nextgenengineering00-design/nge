"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./homepage-promo.module.css";

const HIDE_UNTIL_KEY = "nge_home_promo_hide_until_v1";
const CLOSED_SESSION_KEY = "nge_home_promo_closed_session_v1";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function HomepagePromo() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const hideUntil = Number(window.localStorage.getItem(HIDE_UNTIL_KEY) || 0);
      if (hideUntil > Date.now() || window.sessionStorage.getItem(CLOSED_SESSION_KEY)) return;
    } catch {
      // The promotion remains usable when browser storage is unavailable.
    }
    const frame = window.requestAnimationFrame(() => setOpen(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePromo();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  function closePromo() {
    try {
      window.sessionStorage.setItem(CLOSED_SESSION_KEY, "1");
    } catch {
      // Closing still works without session storage.
    }
    setOpen(false);
  }

  function hideForDay() {
    try {
      window.localStorage.setItem(HIDE_UNTIL_KEY, String(Date.now() + ONE_DAY_MS));
    } catch {
      // Closing still works without local storage.
    }
    closePromo();
  }

  if (!open) return null;

  return (
    <div className={styles.root}>
      <button className={styles.backdrop} type="button" aria-label="ปิดโปรโมชัน" onClick={closePromo} />
      <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="nge-promo-title" aria-describedby="nge-promo-description">
        <div className={styles.visual}>
          <div className={styles.brand}>
            <Image src="/assets/nge-9b58beeb765ab627-fast.webp" alt="NGE" width={48} height={48} unoptimized />
            <span>NGE · Next Gen Engineering</span>
          </div>
          <span className={styles.badge}>โปรโครงการใหม่</span>
          <button ref={closeRef} className={styles.close} type="button" aria-label="ปิดโปรโมชัน" onClick={closePromo}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className={styles.body}>
          <p className={styles.eyebrow}>โปรงานก่อสร้าง · นนทบุรีและพื้นที่ใกล้เคียง</p>
          <h2 id="nge-promo-title">ลดค่าก่อสร้าง <span>1%</span><br /><small>สูงสุด 20,000 บาท</small></h2>
          <p id="nge-promo-description" className={styles.intro}>บ้าน อาคาร รีโนเวท งานระบบ หรืองานโยธา ส่งแบบหรือรูปหน้างานมาให้ NGE ประเมิน</p>
          <ul className={styles.benefits}>
            <li><span aria-hidden="true">✓</span>แถมสำรวจหน้างานและประเมินราคาเบื้องต้น</li>
            <li><span aria-hidden="true">✓</span>รับใบเสนอราคาแยกหมวดงาน</li>
            <li><span aria-hidden="true">✓</span>รับส่วนลดเมื่อเซ็นสัญญาภายใน 30 วัน</li>
          </ul>
          <Link className={styles.cta} href="/contact?utm_source=homepage&utm_medium=popup&utm_campaign=project_start_1pct" onClick={closePromo}>ส่งรายละเอียดงานเพื่อรับสิทธิ์ <span aria-hidden="true">↗</span></Link>
          <button className={styles.hide} type="button" onClick={hideForDay}>ไม่ต้องแสดงอีกภายใน 24 ชั่วโมง</button>
          <p className={styles.terms}>สำหรับสัญญาใหม่ 500,000 บาทขึ้นไป · 1 สิทธิ์ต่อโครงการ<br />ไม่รวมงานเพิ่ม และไม่ใช้ร่วมโปรโมชันอื่น</p>
        </div>
      </section>
    </div>
  );
}
