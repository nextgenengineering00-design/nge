import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, ClipboardCheck, ClipboardList, DraftingCompass, FileCheck2, FileText, HardHat, House, Landmark, Mail, MapPin, Phone, Ruler, Send, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { LegacyBodyState } from "@/components/legacy-body-state";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { localAreas, type LocalAreaSlug } from "@/lib/local-area-data";
import { absoluteUrl, projects, site } from "@/lib/site-data";

/* eslint-disable @next/next/no-css-tags */

export function LocalAreaPage({ slug }: { slug: LocalAreaSlug }) {
  const page = localAreas[slug];
  const isNonthaburi = slug === "contractor-nonthaburi";
  const areaName = isNonthaburi || page.area.includes("นนทบุรี") ? page.area : `${page.area} นนทบุรี`;
  const galleryProjects = [
    { slug: "lake-legend", image: "/assets/project-heroes/lake-legend-hero.webp" },
    { slug: "gpo-yotse-pharmacy", image: "/assets/projects/gpo-yotse-pharmacy/cover.webp" },
    { slug: "rc-road-saraburi-12-ton", image: "/assets/project-heroes/rc-road-saraburi-12-ton-hero.webp" },
    { slug: "military-saraburi", image: "/assets/project-heroes/military-saraburi-hero.webp" },
    { slug: "school-25", image: "/assets/project-heroes/school-25-hero.webp" },
    { slug: "concrete-road-building", image: "/assets/project-heroes/concrete-road-building-hero.webp" },
  ].map(item => ({ ...projects.find(project => project.slug === item.slug)!, image: item.image }));
  const focusIcons = [House, DraftingCompass, HardHat];
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
        provider: { "@type": "GeneralContractor", "@id": `${site.url}/#organization`, name: site.name, telephone: site.phone, address: { "@type": "PostalAddress", streetAddress: site.streetAddress, addressLocality: "นนทบุรี", postalCode: site.postalCode, addressCountry: "TH" } },
        areaServed: { "@type": "AdministrativeArea", name: areaName },
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

  return <div data-legacy-page="services" className={isNonthaburi ? "contractor-landing" : undefined}>
    <LegacyBodyState page="services" bodyClass="" />
    <link rel="stylesheet" href="/legacy/styles.min.css?v=20260925-5" />
    <link rel="stylesheet" href="/legacy/service-seo.css?v=20261011-1" />
    {isNonthaburi && <link rel="stylesheet" href="/legacy/contractor-design.css?v=20261011-2" />}
    {isNonthaburi && <link rel="stylesheet" href="/legacy/contractor-reference.css?v=20261011-5" />}
    <JsonLd data={schema} />
    <a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
    {React.createElement("nge-header")}
    <main id="main-content">
      <section className="seo-hero local-area-hero">
        {isNonthaburi && <div className="contractor-hero-art" aria-hidden="true" />}
        {isNonthaburi && <span className="contractor-hero-tagline">BUILDING A BETTER TOMORROW</span>}
        <div className="container seo-split">
          <div className="local-hero-copy">
            {!isNonthaburi && <nav className="breadcrumb" aria-label="เส้นทางหน้าเว็บ"><Link href="/">หน้าหลัก</Link> / <Link href="/services">บริการ</Link> / <span>{page.area}</span></nav>}
            <span className="page-kicker">NONTHABURI SERVICE AREA</span>
            <h1>{isNonthaburi ? <>รับเหมา<br /><em>ก่อสร้าง นนทบุรี</em></> : page.h1}</h1>
            {isNonthaburi ? <><p className="contractor-hero-lead">ครบวงจรงานก่อสร้าง บ้าน อาคาร ต่อเติม รีโนเวท และระบบต่าง ๆ</p><p className="contractor-hero-support">งานคุณภาพ มาตรฐานภาครัฐ ด้วยประสบการณ์กว่า 40 ปี</p><div className="contractor-hero-proof" aria-label="ข้อมูลทีมงาน"><div><ShieldCheck aria-hidden="true" /><span>ประสบการณ์<small>กว่า 40 ปี</small></span></div><div><Landmark aria-hidden="true" /><span>ผลงานภาครัฐ<small>400+ ล้านบาท</small></span></div><div><MapPin aria-hidden="true" /><span>ดูหน้างานฟรี<small>ทีมงานติดต่อภายใน 1 วัน</small></span></div></div></> : <p>{page.lead}</p>}
            <div className="seo-actions"><Link className="btn btn-primary" href="/contact?service=construction">ขอประเมินโครงการ <ArrowRight size={18} aria-hidden="true" /></Link><a className="btn btn-dark js-line-link" href="https://lin.ee/u45yvnc">ติดต่อผ่าน LINE</a></div>
            {!isNonthaburi && <p className="local-coverage">พื้นที่บริการ: {areaName} และพื้นที่ใกล้เคียง</p>}
          </div>
          {!isNonthaburi && <figure className="seo-photo"><Image src={page.image} alt={page.imageAlt} width={800} height={600} priority sizes="(max-width: 760px) 100vw, 48vw" /><figcaption><span>ผลงานจริงของ NGE</span>{page.imageAlt} · <Link href="/projects">ดูผลงานทั้งหมด ↗</Link></figcaption></figure>}
        </div>
      </section>

      <section className="section local-area-intro"><div className="container seo-content"><div className="contractor-section-top"><span className="page-kicker">วางขอบเขตก่อนเสนอราคา</span>{isNonthaburi && <span className="contractor-section-count">01 / APPROACH</span>}</div><h2>เริ่มจากข้อมูลหน้างาน ไม่ใช้ราคาเหมารวม</h2><p>{page.intro}</p><div className="seo-grid">{page.focus.map((item, index) => { const Icon = focusIcons[index]; return <article className="seo-card" key={item.title}>{isNonthaburi && <div className="contractor-focus-top"><Icon size={30} strokeWidth={1.5} aria-hidden="true" /><span>0{index + 1}</span></div>}<h3>{item.title}</h3><p>{item.body}</p></article>; })}</div></div></section>

      {isNonthaburi && <>
        <section className="section local-service-depth" id="contractor-services"><div className="container"><div className="contractor-section-top"><span className="page-kicker">งานที่รับดูแล</span><span className="contractor-section-count">02 / EXPERTISE</span></div><div className="section-heading split-heading"><div><h2>สร้างใหม่ ต่อเติม หรือแก้พื้นที่เดิม<br />คุยกับทีมเดียวได้</h2><p>เราแยกขอบเขตตามสภาพหน้างาน ไม่ตีราคาแบบกว้าง ๆ แล้วค่อยเพิ่มรายการภายหลัง</p></div><Link href="/services">ดูบริการทั้งหมด <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="local-service-list">
          {[
            { title: "สร้างบ้านและอาคาร", body: "ประสานงานโครงสร้าง สถาปัตยกรรม และระบบ ตั้งแต่แบบก่อนก่อสร้างจนถึงการตรวจรับ", href: "/build-home-nonthaburi", label: "รายละเอียดงานสร้างบ้าน", image: "/assets/project-heroes/wichai-sriracha-hero.webp", icon: Building2 },
            { title: "ต่อเติมและรีโนเวท", body: "ตรวจสภาพอาคารเดิม แยกงานรื้อ งานซ่อม และงานใหม่ก่อนจัดงบและลำดับการทำงาน", href: "/renovation-service-nonthaburi", label: "รายละเอียดงานรีโนเวท", image: "/assets/services/service-renovation-fast.webp", icon: Ruler },
            { title: "งานโยธาและงานระบบ", body: "งานถนน ลาน โครงสร้าง ไฟฟ้า ประปา และสุขาภิบาลที่ต้องประสานกับการใช้อาคารจริง", href: "/services", label: "ดูขอบเขตงานก่อสร้าง", image: "/assets/project-heroes/rc-road-saraburi-12-ton-hero.webp", icon: HardHat },
          ].map((item, index) => { const Icon = item.icon; return <article key={item.title}><div className="contractor-service-image"><Image src={item.image} alt="" width={720} height={520} loading="lazy" sizes="(max-width: 760px) 100vw, 33vw" /><span>0{index + 1} / 03</span></div><div className="contractor-service-copy"><Icon size={28} strokeWidth={1.5} aria-hidden="true" /><h3>{item.title}</h3><p>{item.body}</p><Link href={item.href}>{item.label} <ArrowUpRight size={17} aria-hidden="true" /></Link></div></article>; })}
        </div></div></section>

        <section className="section local-project-proof" id="contractor-projects"><div className="container"><div className="contractor-section-top"><span className="page-kicker">ผลงาน NGE</span><span className="contractor-section-count">03 / SELECTED PROJECTS</span></div><div className="section-heading split-heading"><div><h2>ดูของจริง ก่อนคุยเรื่องงาน</h2><p>ภาพจากโครงการของเราเอง กดดูรายละเอียด ขอบเขตงาน และภาพเพิ่มเติมได้ทุกโครงการ</p></div><Link href="/projects">ดูผลงานทั้งหมด <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="local-project-grid" aria-label="แกลเลอรีผลงาน NGE">{galleryProjects.map((project, index) => <Link className="contractor-project-card" href={`/projects/${project.slug}`} key={project.slug} aria-label={`ดูผลงาน ${project.title} ${project.location}`}><Image src={project.image} alt={`${project.title} ${project.location}`} width={1000} height={750} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 60vw" /><span className="contractor-project-index">0{index + 1} / 06</span><div className="contractor-project-caption"><small>{project.type} · {project.location}</small><h3>{project.title}</h3><span>ดูผลงานนี้ <ArrowUpRight size={18} aria-hidden="true" /></span></div></Link>)}</div><div className="contractor-detail-gallery"><div><span>DETAILS MATTER</span><h3>รายละเอียดหน้างาน<br />ที่เล่าเรื่องแทนเรา</h3><p>ดูภาพใกล้ ๆ แล้วกดไปยังโครงการจริง</p></div>{[
          { image: "/assets/projects/lake-legend/04-p25.webp", slug: "lake-legend", label: "งานภายใน บ้าน Lake Legend" },
          { image: "/assets/projects/gpo-yotse-pharmacy/03.webp", slug: "gpo-yotse-pharmacy", label: "งานปรับปรุงร้านขายยา ยศเส" },
          { image: "/assets/projects/rc-road-saraburi-12-ton/03-road-preparation.webp", slug: "rc-road-saraburi-12-ton", label: "งานเตรียมถนนคอนกรีต สระบุรี" },
        ].map(item => <Link href={`/projects/${item.slug}`} key={item.slug} aria-label={`ดูผลงาน ${item.label}`}><Image src={item.image} alt={item.label} width={460} height={380} loading="lazy" sizes="(max-width: 640px) 50vw, 22vw" /><ArrowUpRight size={17} aria-hidden="true" /></Link>)}</div></div></section>

        <section className="section local-business-proof" id="contractor-contact"><div className="business-proof-grid"><div className="contractor-contact-story"><div className="contractor-contact-inner"><span className="page-kicker">ข้อมูลติดต่อที่ตรวจสอบได้</span><h2>ผู้รับเหมาอยู่ที่นนทบุรี<br /><em>คุยกับทีมงานได้โดยตรง</em></h2><p>ส่งรูปหน้างาน แบบแปลน หรือแจ้งงบประมาณคร่าว ๆ<br />เพื่อให้ทีมงานประเมินเบื้องต้นได้อย่างรวดเร็ว</p><div className="seo-actions"><a className="btn btn-primary" href={site.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={20} aria-hidden="true" /> เปิดแผนที่ Google <ArrowRight size={18} aria-hidden="true" /></a><Link className="btn btn-dark" href="/contact"><Send size={19} aria-hidden="true" /> ส่งข้อมูลโครงการ</Link></div></div></div><dl className="contractor-contact-facts">{[
          { icon: Building2, label: "ชื่อบริษัท (จดทะเบียน)", value: site.legalName },
          { icon: MapPin, label: "ที่อยู่", value: site.address },
          { icon: HardHat, label: "วิศวกรควบคุมงาน", value: `เลข ${site.engineerLicense}` },
          { icon: Phone, label: "เบอร์โทรศัพท์", value: <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> },
          { icon: Mail, label: "อีเมล", value: <a href={`mailto:${site.email}`}>{site.email}</a> },
        ].map(item => { const Icon = item.icon; return <div key={item.label}><span className="contractor-fact-icon"><Icon size={29} strokeWidth={1.75} aria-hidden="true" /></span><div><dt>{item.label}</dt><dd>{item.value}</dd></div></div>; })}</dl></div></section>
      </>}

      <section className="section local-planning" id={isNonthaburi ? "contractor-process" : undefined}><div className="container local-planning-grid"><div className="seo-content"><span className="page-kicker">PROJECT PLANNING</span><h2>{isNonthaburi ? "เริ่มโครงการกับ NGE ต้องเตรียมอะไรบ้าง" : page.focusTitle}</h2><p>ส่งข้อมูลให้ครบตั้งแต่รอบแรก ช่วยให้ทีมแยกสิ่งที่ประเมินได้ สิ่งที่ต้องสำรวจ และรายการที่ต้องออกแบบเพิ่มได้เร็วขึ้น</p><ol className="local-checklist">{page.checklist.map((item, index) => <li key={item}>{isNonthaburi ? <ClipboardCheck size={22} strokeWidth={1.5} aria-hidden="true" /> : <span>{String(index + 1).padStart(2, "0")}</span>}<b>{item}</b><small>0{index + 1}</small></li>)}</ol></div><aside className="local-lead-box"><span>คุยโครงการกับทีมวิศวกร</span><h2>มีรูป แบบ หรือพิกัดแล้ว ส่งให้ทีมดูได้เลย</h2><p>แจ้งประเภทงาน พื้นที่ และช่วงงบประมาณ ทีมจะช่วยระบุข้อมูลที่ต้องใช้ก่อนนัดหมาย</p><Link className="btn btn-primary" href="/contact?source=local-area">ส่งข้อมูลโครงการ <ArrowRight size={17} aria-hidden="true" /></Link><a href={`tel:${site.phone}`}>โทร {site.phoneDisplay}</a></aside></div></section>

      {isNonthaburi ? <section className="section contractor-scope"><div className="contractor-scope-photo" aria-hidden="true" /><div className="container contractor-scope-layout"><div className="contractor-scope-heading"><span className="page-kicker">OUR SERVICE SCOPE</span><h2>ขอบเขตที่ควรอยู่ในเอกสาร<br /><em>ก่อนเริ่มงานก่อสร้าง</em></h2><p>เพื่อให้คุณมั่นใจว่างานทุกขั้นตอนถูกต้อง โปร่งใส และตรงตามความต้องการ เราจึงแนะนำให้มีเอกสารสำคัญก่อนเริ่มงาน</p></div><div className="contractor-scope-right"><div className="contractor-scope-cards">{[
        { icon: FileText, title: "แบบและวัสดุ", body: "ระบุแบบก่อสร้าง วัสดุที่ใช้ และมาตรฐานที่ต้องการ", href: "/construction-contract-guide" },
        { icon: ClipboardList, title: "รายการและขอบเขตงาน", body: "ระบุขอบเขตงานให้ชัดเจน พร้อมรายละเอียดทุกขั้นตอน", href: "/boq-construction-guide" },
        { icon: FileCheck2, title: "แบบขอและส่งมอบ", body: "กำหนดลำดับงาน ผู้รับเหมา และระยะเวลาการส่งมอบ", href: "/construction-contract-guide" },
        { icon: ShieldCheck, title: "มาตรฐานและเงื่อนไข", body: "กำหนดมาตรฐานวัสดุ คุณภาพงาน และเงื่อนไขการรับประกัน", href: "/choose-contractor-nonthaburi" },
      ].map(item => { const Icon = item.icon; return <article key={item.title}><span className="contractor-scope-icon"><Icon size={30} strokeWidth={1.7} aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.body}</p><Link href={item.href}>ดูรายละเอียด <ArrowRight size={15} aria-hidden="true" /></Link></article>; })}</div><p className="contractor-scope-note"><ShieldCheck size={22} aria-hidden="true" /> เอกสารครบ = ลดปัญหา · ลดค่าใช้จ่าย · งานเสร็จตามแผน</p></div></div></section> : <section className="section"><div className="container seo-content"><span className="page-kicker">CLEAR SCOPE</span><h2>ขอบเขตที่ควรอยู่ในเอกสารก่อนเริ่มงาน</h2><div className="seo-grid"><article className="seo-card"><h3>แบบและวัสดุ</h3><p>ระบุแบบอ้างอิง รุ่นหรือระดับวัสดุ และตัวเลือกที่มีผลต่อราคาให้ตรวจสอบร่วมกัน</p></article><article className="seo-card"><h3>ราคาและงวดงาน</h3><p>ผูก BOQ กับงวดตรวจรับ แยกงานรวม งานไม่รวม และวิธีอนุมัติงานเพิ่มลด</p></article><article className="seo-card"><h3>แผนงานและส่งมอบ</h3><p>กำหนดลำดับงาน ผู้ประสานงาน จุดตรวจ และรายการเอกสารหรือการรับประกันตอนส่งมอบ</p></article></div><p><Link href="/boq-construction-guide">อ่านวิธีตรวจ BOQ</Link> · <Link href="/construction-contract-guide">ดูรายการสำคัญในสัญญาก่อสร้าง</Link> · <Link href="/choose-contractor-nonthaburi">เช็กลิสต์เลือกผู้รับเหมา</Link></p></div></section>}

      {isNonthaburi ? <section className="section local-area-links contractor-areas"><div className="contractor-area-intro"><span className="page-kicker">OUR SERVICES</span><h2>เลือกดูข้อมูลตามพื้นที่<br /><em>ที่คุณต้องการ</em></h2><p>เรามีทีมงานและประสบการณ์ในหลายพื้นที่ พร้อมให้คำปรึกษาและดูแลอย่างใกล้ชิด</p><a href="#contractor-area-grid" className="btn btn-primary"><MapPin size={18} aria-hidden="true" /> ดูพื้นที่ให้บริการทั้งหมด <ArrowRight size={17} aria-hidden="true" /></a></div><div className="contractor-area-cards" id="contractor-area-grid">{[
        { area: "นนทบุรี", slug: "contractor-nonthaburi", image: "/assets/area-nonthaburi-reference.webp", detail: "รับเหมาสร้างบ้าน อาคาร ต่อเติม รีโนเวท" },
        { area: "บางใหญ่", slug: "contractor-bang-yai", image: "/assets/area-bang-yai-reference.webp", detail: "บ้านเดี่ยว งานต่อเติม อาคารพาณิชย์" },
        { area: "บางกรวย", slug: "contractor-bang-kruai", image: "/assets/area-bang-kruai-reference.webp", detail: "รีโนเวท ต่อเติม งานระบบครบวงจร" },
        { area: "บางบัวทอง", slug: "contractor-bang-bua-thong", image: "/assets/area-bang-bua-thong-reference.webp", detail: "งานก่อสร้างทุกขนาด พร้อมดูแลตั้งแต่เริ่มจนจบ" },
        { area: "ปากเกร็ด", slug: "contractor-pak-kret", image: "/assets/area-pak-kret-reference.webp", detail: "ที่อยู่อาศัย อาคารพาณิชย์ และงานโครงสร้าง" },
        { area: "ไทรน้อย", slug: "contractor-sai-noi", image: "/assets/area-sai-noi-reference.webp", detail: "ต่อเติม รีโนเวท บ้านและอาคารทุกประเภท" },
        { area: "กรุงเทพฯ และปริมณฑล", slug: "contact", image: "/assets/area-mueang-nonthaburi-reference.webp", detail: "รองรับงานในพื้นที่กรุงเทพฯ และพื้นที่ใกล้เคียง" },
      ].map(item => <Link className="contractor-area-card" href={`/${item.slug}`} key={item.slug}><div className="contractor-area-thumb"><Image src={item.image} alt="" width={420} height={180} loading="lazy" sizes="(max-width: 700px) 80vw, 25vw" /></div><div className="contractor-area-title"><MapPin size={17} aria-hidden="true" /><h3>{item.area}</h3></div><p>{item.detail}</p><ArrowRight className="contractor-area-arrow" size={17} aria-hidden="true" /></Link>)}<Link className="contractor-area-card contractor-area-other" href="/contact"><div className="contractor-area-thumb"><MapPin size={48} aria-hidden="true" /></div><div className="contractor-area-title"><MapPin size={17} aria-hidden="true" /><h3>พื้นที่อื่น ๆ</h3></div><p>ติดต่อสอบถามเพื่อประเมินหน้างานฟรี ไม่มีค่าใช้จ่าย</p><ArrowRight className="contractor-area-arrow" size={17} aria-hidden="true" /></Link></div></section> : <section className="section local-area-links"><div className="container"><div className="section-heading centered"><span>พื้นที่บริการนนทบุรี</span><h2>เลือกดูข้อมูลตามพื้นที่โครงการ</h2><p>แต่ละพื้นที่มีแนวทางเตรียมหน้างานและข้อมูลประกอบการประเมินต่างกัน</p></div><div className="seo-grid seo-services">{siblings.map(item => <Link className="seo-card" href={`/${item.slug}`} key={item.slug}><small>NONTHABURI</small><h3>รับเหมาก่อสร้าง {item.area}</h3><p>{item.lead}</p><b>ดูรายละเอียดพื้นที่ →</b></Link>)}</div></div></section>}

      <section className="section" style={{ paddingTop: 0 }}><div className="container seo-content"><span className="page-kicker">FAQ</span><h2>คำถามก่อนเริ่มโครงการใน{page.area}</h2><div className="seo-faq">{page.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>
      <section className="closing-cta"><div className="container"><div><span>เริ่มจากข้อมูลจริงของหน้างาน</span><h2>ให้ทีมช่วยจัดขอบเขตก่อนประเมินราคา</h2></div><Link className="btn btn-dark" href="/contact?source=local-area-cta">ให้ทีมติดต่อกลับ</Link></div></section>
    </main>
    {React.createElement("nge-footer")}
    <LegacyRuntimeScripts sources={["/legacy/site-config.js?v=20260925-1", "/legacy/site-shell.js?v=20260925-4", "/legacy/app.js?v=20260925-1"]} />
  </div>;
}
