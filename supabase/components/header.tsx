"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site-data";

const nav = [
  ["บริการ", "/services"], ["ผลงาน", "/projects"], ["บทความ", "/knowledge"],
  ["AI Marketing", "/ai-marketing"], ["ติดต่อ", "/contact"]
];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="container nav-shell">
      <Link href="/" className="brand" aria-label="Next Gen Engineering หน้าหลัก">
        <span className="brand-mark">NGE</span><span><b>Next Gen</b><small>Engineering</small></span>
      </Link>
      <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="เมนูหลัก">
        {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <a className="nav-call" href={`tel:${site.phone}`}><Phone size={17} /> {site.phoneDisplay}</a>
      </nav>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label={open ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </button>
    </div>
  </header>;
}
