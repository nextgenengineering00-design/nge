"use client";

/* eslint-disable @next/next/no-img-element -- Generated floor-plan sheets are pre-optimized assets. */
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export function FloorPlanGallery({ slug, houseName }: { slug: string; houseName: string }) {
  const [selected, setSelected] = useState<1 | 2 | null>(null);
  const sheet = `/assets/house-designs/floorplans/${slug}-sheet-v2.webp`;

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") setSelected(selected === 1 ? 2 : 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  const plan = (floor: 1 | 2, modal = false) => (
    <div className={`hc-plan-crop hc-plan-${floor}${modal ? " hc-plan-modal-crop" : ""}`}>
      <img src={sheet} alt={`แปลนมุมมองด้านบน ${houseName} ชั้น ${floor}`} width={2048} height={1024} />
    </div>
  );

  return <section className="hc-floorplans" aria-labelledby="floorplan-title">
    <div className="hc-floorplans-head"><span className="hc-eyebrow">FLOOR PLANS</span><h2 id="floorplan-title">รายละเอียดแบบบ้าน</h2><p>แปลนมุมมองด้านบนสำหรับแนวคิดการจัดพื้นที่</p></div>
    <div className="hc-floorplan-grid">{([1, 2] as const).map(floor => <figure key={floor}>
      <button type="button" className="hc-plan-card" onClick={() => setSelected(floor)} aria-label={`ขยายแปลนชั้น ${floor}`}>
        {plan(floor)}<Search className="hc-plan-zoom" aria-hidden="true" />
      </button>
      <figcaption>ชั้น {floor}</figcaption>
    </figure>)}</div>
    <p className="hc-plan-disclaimer">แปลนนี้เป็นภาพแนวคิดเบื้องต้นสำหรับนำเสนอ การก่อสร้างจริงต้องจัดทำและตรวจสอบแบบโดยสถาปนิกและวิศวกร</p>
    {selected && <div className="hc-plan-lightbox" role="dialog" aria-modal="true" aria-label={`แปลน ${houseName} ชั้น ${selected}`} onClick={() => setSelected(null)}>
      <button type="button" className="hc-plan-close" onClick={() => setSelected(null)} aria-label="ปิดภาพแปลน"><X /></button>
      <button type="button" className="hc-plan-prev" onClick={event => { event.stopPropagation(); setSelected(selected === 1 ? 2 : 1); }} aria-label="ดูแปลนก่อนหน้า"><ChevronLeft /></button>
      <div className="hc-plan-lightbox-content" onClick={event => event.stopPropagation()}>{plan(selected, true)}<strong>แปลนชั้น {selected}</strong></div>
      <button type="button" className="hc-plan-next" onClick={event => { event.stopPropagation(); setSelected(selected === 1 ? 2 : 1); }} aria-label="ดูแปลนถัดไป"><ChevronRight /></button>
    </div>}
  </section>;
}
