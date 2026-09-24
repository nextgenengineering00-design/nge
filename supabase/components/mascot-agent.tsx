"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function MascotAgent() {
  const [open, setOpen] = useState(false);
  return <aside className={open ? "mascot-agent open" : "mascot-agent"} aria-label="น้องเอ็นจิ ผู้ช่วยวางแผนงาน">
    {open && <div className="agent-card">
      <button onClick={() => setOpen(false)} aria-label="ปิดผู้ช่วย"><X size={18} /></button>
      <span className="agent-status"><i /> พร้อมช่วยวางแผน</span>
      <h3>สวัสดีครับ ผมน้องเอ็นจิ</h3>
      <p>เลือกเรื่องที่อยากเริ่ม แล้วผมจะพาไปหน้าที่ตรงที่สุด</p>
      <Link href="/contact?topic=estimate">ประเมินงบเบื้องต้น</Link>
      <Link href="/projects">ดูงานประเภทเดียวกัน</Link>
      <Link href="/knowledge">เตรียมตัวก่อนคุยผู้รับเหมา</Link>
    </div>}
    <button className="mascot-button" onClick={() => setOpen(!open)} aria-expanded={open}>
      <Image src="/brand/nge-ai-engineer.png" alt="น้องเอ็นจิ มาสคอตวิศวกร AI" width={168} height={168} priority />
      <span><MessageCircle size={17} /> ถามน้องเอ็นจิ</span>
    </button>
  </aside>;
}
