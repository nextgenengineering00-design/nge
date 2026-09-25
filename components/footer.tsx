import Link from "next/link";
import { site } from "@/lib/site-data";

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div><span className="brand-mark">NGE</span><h2>จากประสบการณ์งานภาครัฐ สู่โครงการที่ตรวจสอบได้</h2><p>รับเหมาก่อสร้าง รีโนเวท งานโยธา และบริหารโครงการใน{site.area}</p></div>
    <div><b>สำรวจต่อ</b><Link href="/services">บริการ</Link><Link href="/projects">ผลงาน</Link><Link href="/knowledge">คลังความรู้</Link></div>
    <div><b>ติดต่อทีมงาน</b><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><a href={`https://line.me/R/ti/p/${site.line}`} target="_blank" rel="noreferrer">LINE {site.line}</a><a href={`mailto:${site.email}`}>{site.email}</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Next Gen Engineering</span><Link href="/privacy">นโยบายความเป็นส่วนตัว</Link></div></footer>;
}
