import React from "react";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { LegacyBodyState } from "@/components/legacy-body-state";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { localAreas, type LocalAreaSlug } from "@/lib/local-area-data";
import { absoluteUrl, site } from "@/lib/site-data";

/* eslint-disable @next/next/no-css-tags */

export function LocalAreaPage({ slug }: { slug: LocalAreaSlug }) {
  const page = localAreas[slug];
  const siblings = Object.values(localAreas).filter(item => item.slug !== slug);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${absoluteUrl(`/${slug}`)}#service`,
        name: `รับเหมาก่อสร้าง ${page.area}`,
        url: absoluteUrl(`/${slug}`),
        description: page.description,
        provider: { "@type": "GeneralContractor", "@id": `${site.url}/#organization`, name: site.name, telephone: site.phone },
        areaServed: { "@type": "AdministrativeArea", name: `${page.area} นนทบุรี` },
        serviceType: ["รับเหมาก่อสร้าง", "สร้างบ้าน", "ต่อเติม", "รีโนเวท", "งานโครงสร้าง", "งานระบบอาคาร"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "หน้าหลัก", item: site.url },
          { "@type": "ListItem", position: 2, name: "บริการ", item: absoluteUrl("/services") },
          { "@type": "ListItem", position: 3, name: `รับเหมาก่อสร้าง ${page.area}`, item: absoluteUrl(`/${slug}`) },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      },
    ],
  };

  return <div data-legacy-page="services">
    <LegacyBodyState page="services" bodyClass="" />
    <link rel="stylesheet" href="/legacy/styles.min.css?v=20260921-2" />
    <link rel="stylesheet" href="/legacy/service-seo.css?v=20260920" />
    <JsonLd data={schema} />
    <a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
    {React.createElement("nge-header")}
    <main id="main-content">
      <section className="seo-hero local-area-hero">
        <div className="container seo-split">
          <div>
            <nav className="breadcrumb" aria-label="เส้นทางหน้าเว็บ"><Link href="/">หน้าหลัก</Link> / <Link href="/services">บริการ</Link> / <span>{page.area}</span></nav>
            <span className="page-kicker">NONTHABURI SERVICE AREA</span>
            <h1>{page.h1}</h1>
            <p>{page.lead}</p>
            <div className="seo-actions"><Link className="btn btn-dark" href="/contact?service=construction">ขอประเมินโครงการ</Link><a className="btn btn-dark js-line-link" href="https://lin.ee/u45yvnc">ส่งรูปทาง LINE</a></div>
            <p className="local-coverage">พื้นที่บริการ: {page.area} นนทบุรี และพื้นที่ใกล้เคียง</p>
          </div>
          <figure className="seo-photo"><Image src={page.image} alt={page.imageAlt} width={800} height={600} priority sizes="(max-width: 760px) 100vw, 48vw" /><figcaption>{page.imageAlt} · <Link href="/projects">ดูผลงานจริงทั้งหมด</Link></figcaption></figure>
        </div>
      </section>

      <section className="section local-area-intro"><div className="container seo-content"><span className="page-kicker">วางขอบเขตก่อนเสนอราคา</span><h2>เริ่มจากข้อมูลหน้างาน ไม่ใช้ราคาเหมารวม</h2><p>{page.intro}</p><div className="seo-grid">{page.focus.map(item => <article className="seo-card" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>

      <section className="section local-planning"><div className="container local-planning-grid"><div className="seo-content"><span className="page-kicker">PROJECT PLANNING</span><h2>{page.focusTitle}</h2><p>ส่งข้อมูลให้ครบตั้งแต่รอบแรก ช่วยให้ทีมแยกสิ่งที่ประเมินได้ สิ่งที่ต้องสำรวจ และรายการที่ต้องออกแบบเพิ่มได้เร็วขึ้น</p><ol className="local-checklist">{page.checklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></li>)}</ol></div><aside className="local-lead-box"><span>คุยโครงการกับทีมวิศวกร</span><h2>มีรูป แบบ หรือพิกัดแล้ว ส่งให้ทีมดูได้เลย</h2><p>แจ้งประเภทงาน พื้นที่ และช่วงงบประมาณ ทีมจะช่วยระบุข้อมูลที่ต้องใช้ก่อนนัดหมาย</p><Link className="btn btn-primary" href="/contact?source=local-area">ส่งข้อมูลโครงการ</Link><a href={`tel:${site.phone}`}>โทร {site.phoneDisplay}</a></aside></div></section>

      <section className="section"><div className="container seo-content"><span className="page-kicker">CLEAR SCOPE</span><h2>ขอบเขตที่ควรอยู่ในเอกสารก่อนเริ่มงาน</h2><div className="seo-grid"><article className="seo-card"><h3>แบบและวัสดุ</h3><p>ระบุแบบอ้างอิง รุ่นหรือระดับวัสดุ และตัวเลือกที่มีผลต่อราคาให้ตรวจสอบร่วมกัน</p></article><article className="seo-card"><h3>ราคาและงวดงาน</h3><p>ผูก BOQ กับงวดตรวจรับ แยกงานรวม งานไม่รวม และวิธีอนุมัติงานเพิ่มลด</p></article><article className="seo-card"><h3>แผนงานและส่งมอบ</h3><p>กำหนดลำดับงาน ผู้ประสานงาน จุดตรวจ และรายการเอกสารหรือการรับประกันตอนส่งมอบ</p></article></div><p><Link href="/boq-construction-guide">อ่านวิธีตรวจ BOQ</Link> · <Link href="/construction-contract-guide">ดูรายการสำคัญในสัญญาก่อสร้าง</Link> · <Link href="/choose-contractor-nonthaburi">เช็กลิสต์เลือกผู้รับเหมา</Link></p></div></section>

      <section className="section local-area-links"><div className="container"><div className="section-heading centered"><span>พื้นที่บริการนนทบุรี</span><h2>เลือกดูข้อมูลตามพื้นที่โครงการ</h2><p>แต่ละพื้นที่มีแนวทางเตรียมหน้างานและข้อมูลประกอบการประเมินต่างกัน</p></div><div className="seo-grid seo-services">{siblings.map(item => <Link className="seo-card" href={`/${item.slug}`} key={item.slug}><small>NONTHABURI</small><h3>รับเหมาก่อสร้าง {item.area}</h3><p>{item.lead}</p><b>ดูรายละเอียดพื้นที่ →</b></Link>)}</div></div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="container seo-content"><span className="page-kicker">FAQ</span><h2>คำถามก่อนเริ่มโครงการใน{page.area}</h2><div className="seo-faq">{page.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>
      <section className="closing-cta"><div className="container"><div><span>เริ่มจากข้อมูลจริงของหน้างาน</span><h2>ให้ทีมช่วยจัดขอบเขตก่อนประเมินราคา</h2></div><Link className="btn btn-dark" href="/contact?source=local-area-cta">ให้ทีมติดต่อกลับ</Link></div></section>
    </main>
    {React.createElement("nge-footer")}
    <LegacyRuntimeScripts sources={["/legacy/site-config.js?v=20260921-3", "/legacy/site-shell.js?v=20260921-3", "/legacy/app.js?v=20260921-3"]} />
  </div>;
}
