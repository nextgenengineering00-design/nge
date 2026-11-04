import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- Images are pre-optimized WebP assets. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Bath, BedDouble, CarFront } from "lucide-react";
import { houseDesigns, houseImage, houseLine, housePrice } from "@/lib/house-designs";
import { HouseShell } from "@/components/house-shell";
import { HouseCard } from "@/components/house-catalogue";
import { HouseInquiry } from "@/components/house-inquiry";
import { FloorPlanGallery } from "@/components/floor-plan-gallery";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams(){return houseDesigns.map(h=>({slug:h.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const h=houseDesigns.find(h=>h.slug===slug);if(!h)return {};return {title:`${h.name} ${h.area} ตร.ม. | แบบบ้าน ${h.style}`,description:h.description,alternates:{canonical:`/house-designs/${slug}`},openGraph:{url:`/house-designs/${slug}`,title:`${h.name} | NGE`,description:h.description,images:[houseImage(h)]},twitter:{card:"summary_large_image",images:[houseImage(h)]}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const h=houseDesigns.find(h=>h.slug===slug);if(!h)notFound();
 return <HouseShell><JsonLd data={{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"หน้าหลัก",item:"https://ngebuild.com/"},{"@type":"ListItem",position:2,name:"แบบบ้าน",item:"https://ngebuild.com/house-designs"},{"@type":"ListItem",position:3,name:h.name,item:`https://ngebuild.com/house-designs/${h.slug}`}]}}/>
 <div className="hc-detail-banner"><strong>ต้นแบบ</strong><span>CRAFTED BY NGE</span><p>บริการรับสร้างบ้าน โดย NEXT GEN ENGINEERING</p></div>
 <div className="hc-container hc-detail"><div className="hc-breadcrumb"><nav aria-label="เส้นทางหน้าเว็บ"><Link href="/">หน้าหลัก</Link><span> / </span><Link href="/house-designs">ค้นหาแบบบ้าน</Link><span> / </span><span aria-current="page">{h.name}</span></nav></div>
 <div className="hc-detail-grid"><div><a className="hc-detail-photo" href={houseImage(h)} target="_blank" rel="noopener noreferrer" aria-label={`ดูภาพเต็ม ${h.name}`}><img src={houseImage(h)} alt={`${h.name} แบบบ้าน ${h.style}`} width={1254} height={1254}/></a><p className="hc-footnote">ภาพประกอบแนวคิดแบบบ้าน ไม่ใช่ภาพผลงานก่อสร้างที่แล้วเสร็จ</p></div><div className="hc-detail-info"><h1>{h.style.toUpperCase()}</h1><p className="hc-detail-highlight">{h.highlight}</p><p className="hc-model">{h.code}</p><dl className="hc-detail-land"><div><dt>บ้าน 2 ชั้น</dt></div><div><dt>ขนาดที่ดิน :</dt><dd>{h.landArea} ตร.ว.</dd></div><div><dt>หน้ากว้างที่ดิน :</dt><dd>{h.width} ม.</dd></div><div><dt>ความลึกที่ดิน :</dt><dd>{h.depth} ม.</dd></div><div><dt>พื้นที่ใช้สอย :</dt><dd>{h.area} ตร.ม.</dd></div></dl><dl className="hc-detail-specs"><div><dt><BedDouble/> {h.bedrooms} ห้องนอน</dt></div><div><dt><Bath/> {h.bathrooms} ห้องน้ำ</dt></div><div><dt><CarFront/> 2 ที่จอดรถ</dt></div></dl><div className="hc-detail-price"><span>ราคา</span><strong>{housePrice()}</strong><p>ราคาโดยประมาณ อาจเปลี่ยนแปลงตามวัสดุ แบบ และพื้นที่ก่อสร้าง</p></div><a className="hc-button" href={houseLine(h)} target="_blank" rel="noopener noreferrer">สอบถามผ่าน LINE <ArrowRight size={18}/></a><a className="hc-outline-button" href="#budget-consult">ให้ทีมงานติดต่อกลับ</a></div></div>
 {h.hasFloorPlan !== false && <FloorPlanGallery slug={h.slug} houseName={h.name}/>}</div>
 <HouseInquiry houseName={h.name}/><section className="hc-related"><div className="hc-container"><div className="hc-related-head"><h2>แบบบ้านอื่นที่น่าสนใจ</h2><Link href="/house-designs">ดูทั้งหมด <ArrowRight size={17}/></Link></div><div className="hc-grid">{houseDesigns.filter(x=>x.slug!==h.slug).slice(0,3).map(x=><HouseCard key={x.slug} house={x}/>)}</div></div></section>
 </HouseShell>;
}
