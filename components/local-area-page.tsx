import React from "react";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { LegacyBodyState } from "@/components/legacy-body-state";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { localAreas, type LocalAreaSlug } from "@/lib/local-area-data";
import { absoluteUrl, projects, site } from "@/lib/site-data";

/* eslint-disable @next/next/no-css-tags */

export function LocalAreaPage({ slug }: { slug: LocalAreaSlug }) {
  const page = localAreas[slug];
  const isNonthaburi = slug === "contractor-nonthaburi";
  const featuredProjects = ["lake-legend", "phra2-renovation", "rc-road-saraburi-12-ton"].map(projectSlug => projects.find(project => project.slug === projectSlug)!);
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
        areaServed: { "@type": "AdministrativeArea", name: isNonthaburi ? "นนทบุรี" : `${page.area} นนทบุรี` },
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
    <link rel="stylesheet" href="/legacy/styles.min.css?v=20260925-5" />
    <link rel="stylesheet" href="/legacy/service-seo.css?v=20260925-1" />
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
            <p className="local-coverage">พื้นที่บริการ: {isNonthaburi ? "นนทบุรีและพื้นที่ใกล้เคียง" : `${page.area} นนทบุรีและพื้นที่ใกล้เคียง`}</p>
            {isNonthaburi && <div className="local-proof-row" aria-label="ข้อมูลผู้รับเหมา"><span>วิศวกรโยธา {site.engineerLicense}</span><span>จดทะเบียนนิติบุคคล {site.legalId}</span></div>}
          </div>
          <figure className="seo-photo"><Image src={page.image} alt={page.imageAlt} width={800} height={600} priority sizes="(max-width: 760px) 100vw, 48vw" /><figcaption>{page.imageAlt} · <Link href="/projects">ดูผลงานจริงทั้งหมด</Link></figcaption></figure>
        </div>
      </section>

      <section className="section local-area-intro"><div className="container seo-content"><span className="page-kicker">วางขอบเขตก่อนเสนอราคา</span><h2>เริ่มจากข้อมูลหน้างาน ไม่ใช้ราคาเหมารวม</h2><p>{page.intro}</p><div className="seo-grid">{page.focus.map(item => <article className="seo-card" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>

      {isNonthaburi && <>
        <section className="section local-service-depth"><div className="container"><div className="section-heading split-heading"><div><span>งานที่รับดูแล</span><h2>สร้างใหม่ ต่อเติม หรือแก้พื้นที่เดิม คุยกับทีมเดียวได้</h2><p>เราแยกขอบเขตตามสภาพหน้างาน ไม่ตีราคาแบบกว้าง ๆ แล้วค่อยเพิ่มรายการภายหลัง</p></div><Link href="/services">ดูบริการทั้งหมด →</Link></div><div className="local-service-list"><article><b>01</b><div><h3>สร้างบ้านและอาคาร</h3><p>ประสานงานโครงสร้าง สถาปัตยกรรม และระบบ ตั้งแต่แบบก่อนก่อสร้างจนถึงการตรวจรับ</p><Link href="/build-home-nonthaburi">รายละเอียดงานสร้างบ้าน</Link></div></article><article><b>02</b><div><h3>ต่อเติมและรีโนเวท</h3><p>ตรวจสภาพอาคารเดิม แยกงานรื้อ งานซ่อม และงานใหม่ก่อนจัดงบและลำดับการทำงาน</p><Link href="/renovation-service-nonthaburi">รายละเอียดงานรีโนเวท</Link></div></article><article><b>03</b><div><h3>งานโยธาและงานระบบ</h3><p>งานถนน ลาน โครงสร้าง ไฟฟ้า ประปา และสุขาภิบาลที่ต้องประสานกับการใช้อาคารจริง</p><Link href="/services">ดูขอบเขตงานก่อสร้าง</Link></div></article></div></div></section>

        <section className="section local-project-proof"><div className="container"><div className="section-heading split-heading"><div><span>SELECTED PROJECTS</span><h2>ดูงานจริงก่อนตัดสินใจ</h2><p>ระบุประเภทงานและสถานที่ตามข้อมูลโครงการจริง เพื่อให้เห็นขอบเขตที่ทีมเคยดูแล</p></div><Link href="/projects">ดูผลงานทั้งหมด →</Link></div><div className="local-project-grid">{featuredProjects.map(project => <Link href={`/projects/${project.slug}`} key={project.slug}><Image src={project.image} alt={`${project.title} ${project.location}`} width={760} height={560} sizes="(max-width: 760px) 100vw, 33vw" /><span>{project.type}</span><h3>{project.title}</h3><p>{project.location}</p></Link>)}</div><div className="lake-gallery" aria-label="รายละเอียดผลงานบ้าน Lake Legend นนทบุรี">{["02-p24.webp", "04-p25.webp", "08-p26.webp", "13-p28.webp"].map((image, index) => <Image key={image} src={`/assets/projects/lake-legend/${image}`} alt={`รายละเอียดงานตกแต่งบ้าน Lake Legend แจ้งวัฒนะ นนทบุรี ภาพที่ ${index + 1}`} width={640} height={480} loading="lazy" sizes="(max-width: 640px) 50vw, 25vw" />)}</div></div></section>

        <section className="section local-business-proof"><div className="container business-proof-grid"><div><span className="page-kicker">ข้อมูลติดต่อที่ตรวจสอบได้</span><h2>ผู้รับเหมาอยู่ที่นนทบุรี คุยกับทีมงานได้โดยตรง</h2><p>ส่งพิกัด รูปหน้างาน แบบที่มี และช่วงงบประมาณมาให้ทีมดูก่อนได้ ข้อมูลเบื้องต้นช่วยให้การนัดสำรวจตรงประเด็นขึ้น</p><div className="seo-actions"><a className="btn btn-primary" href={site.mapUrl} target="_blank" rel="noopener noreferrer">เปิดแผนที่ Google</a><Link className="btn btn-dark" href="/contact">ส่งข้อมูลโครงการ</Link></div></div><dl><div><dt>ชื่อจดทะเบียน</dt><dd>{site.legalName}</dd></div><div><dt>ที่อยู่</dt><dd>{site.address}</dd></div><div><dt>วิศวกรโยธา</dt><dd>เลข {site.engineerLicense}</dd></div><div><dt>โทรศัพท์</dt><dd><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></dd></div><div><dt>อีเมล</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div></dl></div></section>
      </>}

      <section className="section local-planning"><div className="container local-planning-grid"><div className="seo-content"><span className="page-kicker">PROJECT PLANNING</span><h2>{page.focusTitle}</h2><p>ส่งข้อมูลให้ครบตั้งแต่รอบแรก ช่วยให้ทีมแยกสิ่งที่ประเมินได้ สิ่งที่ต้องสำรวจ และรายการที่ต้องออกแบบเพิ่มได้เร็วขึ้น</p><ol className="local-checklist">{page.checklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></li>)}</ol></div><aside className="local-lead-box"><span>คุยโครงการกับทีมวิศวกร</span><h2>มีรูป แบบ หรือพิกัดแล้ว ส่งให้ทีมดูได้เลย</h2><p>แจ้งประเภทงาน พื้นที่ และช่วงงบประมาณ ทีมจะช่วยระบุข้อมูลที่ต้องใช้ก่อนนัดหมาย</p><Link className="btn btn-primary" href="/contact?source=local-area">ส่งข้อมูลโครงการ</Link><a href={`tel:${site.phone}`}>โทร {site.phoneDisplay}</a></aside></div></section>

      <section className="section"><div className="container seo-content"><span className="page-kicker">CLEAR SCOPE</span><h2>ขอบเขตที่ควรอยู่ในเอกสารก่อนเริ่มงาน</h2><div className="seo-grid"><article className="seo-card"><h3>แบบและวัสดุ</h3><p>ระบุแบบอ้างอิง รุ่นหรือระดับวัสดุ และตัวเลือกที่มีผลต่อราคาให้ตรวจสอบร่วมกัน</p></article><article className="seo-card"><h3>ราคาและงวดงาน</h3><p>ผูก BOQ กับงวดตรวจรับ แยกงานรวม งานไม่รวม และวิธีอนุมัติงานเพิ่มลด</p></article><article className="seo-card"><h3>แผนงานและส่งมอบ</h3><p>กำหนดลำดับงาน ผู้ประสานงาน จุดตรวจ และรายการเอกสารหรือการรับประกันตอนส่งมอบ</p></article></div><p><Link href="/boq-construction-guide">อ่านวิธีตรวจ BOQ</Link> · <Link href="/construction-contract-guide">ดูรายการสำคัญในสัญญาก่อสร้าง</Link> · <Link href="/choose-contractor-nonthaburi">เช็กลิสต์เลือกผู้รับเหมา</Link></p></div></section>

      <section className="section local-area-links"><div className="container"><div className="section-heading centered"><span>พื้นที่บริการนนทบุรี</span><h2>เลือกดูข้อมูลตามพื้นที่โครงการ</h2><p>แต่ละพื้นที่มีแนวทางเตรียมหน้างานและข้อมูลประกอบการประเมินต่างกัน</p></div><div className="seo-grid seo-services">{siblings.map(item => <Link className="seo-card" href={`/${item.slug}`} key={item.slug}><small>NONTHABURI</small><h3>รับเหมาก่อสร้าง {item.area}</h3><p>{item.lead}</p><b>ดูรายละเอียดพื้นที่ →</b></Link>)}</div></div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="container seo-content"><span className="page-kicker">FAQ</span><h2>คำถามก่อนเริ่มโครงการใน{page.area}</h2><div className="seo-faq">{page.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>
      <section className="closing-cta"><div className="container"><div><span>เริ่มจากข้อมูลจริงของหน้างาน</span><h2>ให้ทีมช่วยจัดขอบเขตก่อนประเมินราคา</h2></div><Link className="btn btn-dark" href="/contact?source=local-area-cta">ให้ทีมติดต่อกลับ</Link></div></section>
    </main>
    {React.createElement("nge-footer")}
    <LegacyRuntimeScripts sources={["/legacy/site-config.js?v=20260925-1", "/legacy/site-shell.js?v=20260925-4", "/legacy/app.js?v=20260925-1", "/legacy/language-route-switcher.js?v=20260925-1"]} />
  </div>;
}
