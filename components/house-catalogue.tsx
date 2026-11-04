"use client";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- Images are pre-optimized WebP assets. */


import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { houseDesigns, houseImage, housePrice, type HouseDesign } from "@/lib/house-designs";
import "./house-designs.css";

export function HouseCard({ house }: { house: HouseDesign }) {
  const href = `/house-designs/${house.slug}`;
  return <article className="hc-card">
    <Link href={href} className="hc-photo" aria-label={`ดูรายละเอียด ${house.name}`}><img src={houseImage(house)} alt={`${house.name} สไตล์ ${house.style}`} width={1254} height={1254} loading="lazy" /></Link>
    <div className="hc-card-content"><p className="hc-style">{house.style}</p><h3><Link href={href}>{house.highlight}</Link></h3><p className="hc-model">{house.code} (บ้าน 2 ชั้น)</p>
      <dl className="hc-card-specs"><div><dt>ขนาดที่ดิน :</dt><dd>{house.landArea} ตร.ว.</dd></div><div><dt>หน้ากว้าง :</dt><dd>{house.width} ม.</dd></div><div><dt>พื้นที่ใช้สอย :</dt><dd>{house.area} ตร.ม.</dd></div><div><dt>ความลึกที่ดิน :</dt><dd>{house.depth} ม.</dd></div></dl>
      <div className="hc-card-bottom"><div><small>ราคาประมาณ</small><strong>{housePrice()}</strong></div><Link className="hc-arrow" href={href} aria-label={`เปิดรายละเอียด ${house.name}`}><ChevronRight size={29}/></Link></div>
    </div>
  </article>;
}

export function HouseCatalogue({ standalone = false }: { standalone?: boolean }) {
  const [budget,setBudget] = useState("all");
  const budgetOptions = [
    {value:"all",label:"แบบบ้านทั้งหมด"},
    {value:"5",label:"แบบบ้านไม่เกิน 5 ล้าน"},
    {value:"7",label:"แบบบ้านไม่เกิน 7 ล้าน"},
    {value:"10",label:"แบบบ้านไม่เกิน 10 ล้าน"},
    {value:"10plus",label:"แบบบ้าน 10 ล้านขึ้นไป"},
  ];
  const filtered = houseDesigns.filter(h => budget === "all" || (budget === "10plus" ? h.price >= 10 : h.price <= Number(budget)));
  const Heading = standalone ? "h1" : "h2";
  return <section id="house-designs" className="hc-catalogue hc-scope" aria-labelledby="hc-title"><div className="hc-container">
    <header className="hc-heading"><span className="hc-eyebrow">อยากสร้างบ้าน ?</span><Heading id="hc-title">ค้นหาแบบบ้านของคุณ</Heading><p>เลือกแบบบ้านที่ใช่ ในงบประมาณที่ลงตัวกับคุณ</p></header>
    <div className="hc-tabs" aria-label="เลือกงบประมาณแบบบ้าน">{budgetOptions.map(item=><button key={item.value} type="button" aria-pressed={budget===item.value} onClick={()=>setBudget(item.value)}>{item.label}</button>)}</div>
    <div className="hc-results"><span role="status" aria-live="polite">พบ {filtered.length} แบบบ้าน</span><Link href="/build-home-nonthaburi">ต้องการสร้างตามแบบ? ดูบริการรับสร้างบ้าน นนทบุรี →</Link></div>
    <div className="hc-grid">{filtered.map(h=><HouseCard key={h.slug} house={h}/>)}</div>
    <p className="hc-footnote">ภาพประกอบแนวคิดแบบบ้าน · ราคาประเมินตามแบบ วัสดุ และสภาพพื้นที่ งบประมาณที่แจ้งใช้ประกอบการปรึกษา ไม่ใช่ราคายืนยันของแบบบ้าน</p>
  </div></section>;
}
