import React from "react";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { LegacyBodyState } from "@/components/legacy-body-state";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { localAreas } from "@/lib/local-area-data";
import { localServices, type LocalServiceSlug } from "@/lib/local-service-data";
import { absoluteUrl, site } from "@/lib/site-data";

/* eslint-disable @next/next/no-css-tags */

export function LocalServicePage({ slug }: { slug: LocalServiceSlug }) {
  const page = localServices[slug];
  const related = Object.values(localServices).filter(item => item.slug !== slug);
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", "@id": `${absoluteUrl(`/${slug}`)}#service`, name: page.serviceName, url: absoluteUrl(`/${slug}`), description: page.description, serviceType: page.serviceTypes,
      provider: { "@type": "GeneralContractor", "@id": `${site.url}/#organization`, name: site.name, telephone: site.phone },
      areaServed: ["นนทบุรี", "บางใหญ่", "บางกรวย", "บางบัวทอง", "ไทรน้อย", "ปากเกร็ด", "กรุงเทพมหานคร", "ปทุมธานี"].map(name => ({ "@type": "AdministrativeArea", name })) },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าหลัก", item: site.url },
      { "@type": "ListItem", position: 2, name: "บริการ", item: absoluteUrl("/services") },
      { "@type": "ListItem", position: 3, name: page.serviceName, item: absoluteUrl(`/${slug}`) },
    ] },
    { "@type": "FAQPage", mainEntity: page.faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ] };

  return <div data-legacy-page="services">
    <LegacyBodyState page="services" bodyClass="" />
    <link rel="stylesheet" href="/legacy/styles.min.css?v=20260925-1" />
    <link rel="stylesheet" href="/legacy/service-seo.css?v=20260925-1" />
    <JsonLd data={schema} />
    <a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
    {React.createElement("nge-header")}
    <main id="main-content">
      <section className="seo-hero local-area-hero"><div className="container seo-split"><div>
        <nav className="breadcrumb" aria-label="เส้นทางหน้าเว็บ"><Link href="/">หน้าหลัก</Link> / <Link href="/services">บริการ</Link> / <span>{page.serviceName}</span></nav>
        <span className="page-kicker">{page.kicker}</span><h1>{page.h1}</h1><p>{page.lead}</p>
        <div className="seo-actions"><Link className="btn btn-dark" href={`/contact?source=${page.slug}`}>ขอประเมินหน้างาน</Link><a className="btn btn-dark js-line-link" href="https://lin.ee/u45yvnc">ส่งรูปทาง LINE</a></div>
        <p className="local-coverage">พื้นที่หลัก: นนทบุรี กรุงเทพฯ ปทุมธานี และพื้นที่ใกล้เคียง</p>
      </div><figure className="seo-photo"><Image src={page.image} alt={page.imageAlt} width={900} height={675} priority sizes="(max-width: 760px) 100vw, 48vw" /><figcaption>{page.imageAlt} · <Link href="/projects">ดูผลงานจริงทั้งหมด</Link></figcaption></figure></div></section>

      <section className="section local-area-intro"><div className="container seo-content"><span className="page-kicker">เริ่มจากหน้างานจริง</span><h2>{page.introTitle}</h2><p>{page.intro}</p><div className="seo-grid">{page.scopes.map(item => <article className="seo-card" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>

      <section className="section local-planning"><div className="container local-planning-grid"><div className="seo-content"><span className="page-kicker">ส่งข้อมูลให้ประเมินเร็วขึ้น</span><h2>เตรียม 4 อย่างก่อนคุยกับทีม</h2><p>ข้อมูลครบตั้งแต่ครั้งแรกช่วยให้แยกสิ่งที่ประเมินได้ทันที สิ่งที่ต้องสำรวจ และสิ่งที่ต้องทำแบบเพิ่มได้ชัดเจน</p><ol className="local-checklist">{page.checklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></li>)}</ol></div><aside className="local-lead-box"><span>คุยกับทีมวิศวกร</span><h2>มีรูป แบบ หรือพิกัดแล้ว ส่งให้ทีมดูได้เลย</h2><p>แจ้งประเภทงาน พื้นที่ และงบคร่าว ๆ ทีมจะช่วยบอกขั้นตอนถัดไปก่อนนัดหมาย</p><Link className="btn btn-primary" href={`/contact?source=${page.slug}-cta`}>ให้ทีมติดต่อกลับ</Link><a href={`tel:${site.phone}`}>โทร {site.phoneDisplay}</a></aside></div></section>

      <section className="section"><div className="container"><div className="section-heading centered"><span>ผลงานและข้อมูลที่เกี่ยวข้อง</span><h2>ดูหลักฐานก่อนเลือกทีม</h2></div><div className="seo-grid seo-services">{page.projectLinks.map(item => <Link className="seo-card" href={item.href} key={item.href}><h3>{item.title}</h3><p>{item.body}</p><b>ดูรายละเอียด →</b></Link>)}</div></div></section>

      <section className="section local-area-links"><div className="container"><div className="section-heading centered"><span>บริการใกล้พื้นที่โครงการ</span><h2>เลือกประเภทงานที่ตรงกับสิ่งที่กำลังทำ</h2></div><div className="seo-grid seo-services">{related.map(item => <Link className="seo-card" href={`/${item.slug}`} key={item.slug}><small>NGE LOCAL SERVICE</small><h3>{item.serviceName}</h3><p>{item.lead}</p><b>ดูบริการ →</b></Link>)}</div><div className="nearby-area-links">{Object.values(localAreas).map(item => <Link href={`/${item.slug}`} key={item.slug}>รับเหมาก่อสร้าง {item.area}</Link>)}</div></div></section>

      <section className="section"><div className="container seo-content"><span className="page-kicker">คำถามที่พบบ่อย</span><h2>ก่อนนัดดูหน้างาน</h2><div className="seo-faq">{page.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>
      <section className="closing-cta"><div className="container"><div><span>เริ่มจากข้อมูลจริงของหน้างาน</span><h2>ส่งรูปและพิกัดให้ทีมช่วยดูขอบเขต</h2></div><Link className="btn btn-dark" href={`/contact?source=${page.slug}-bottom`}>ขอประเมินโครงการ</Link></div></section>
    </main>
    {React.createElement("nge-footer")}
    <LegacyRuntimeScripts sources={["/legacy/site-config.js?v=20260925-1", "/legacy/site-shell.js?v=20260925-2", "/legacy/app.js?v=20260925-1", "/legacy/language-switcher.js?v=20260925-2"]} />
  </div>;
}
