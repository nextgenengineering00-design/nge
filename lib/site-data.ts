export const site = {
  name: "Next Gen Engineering",
  shortName: "NGE",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ngebuild.com",
  phoneDisplay: "098-279-9145",
  phone: "0982799145",
  line: "@522magc",
  email: "nextgenengineering.th@gmail.com",
  area: "นนทบุรี กรุงเทพฯ และปริมณฑล",
  legalId: "0103528028423",
  legalName: "ห้างหุ้นส่วนจำกัด รวมพลชัย เอ็นจิเนียริ่ง",
  engineerLicense: "ภย. 60575",
  address: "98/72 หมู่บ้านกฤษดาลากูน นนทบุรี 11130",
  streetAddress: "98/72 หมู่บ้านกฤษดาลากูน",
  postalCode: "11130",
  mapUrl: "https://maps.app.goo.gl/jKKSr42Ax6v7HqWRA",
  facebook: "https://www.facebook.com/nextgenength/",
};

export const services = [
  { slug: "general-construction", title: "รับเหมาก่อสร้าง", desc: "บ้าน อาคาร สำนักงาน และโครงการทุกขนาด ดูแลตั้งแต่สำรวจจนส่งมอบ", image: "/assets/services/service-general-construction-fast.webp" },
  { slug: "renovation", title: "รีโนเวทและต่อเติม", desc: "ตรวจสภาพเดิม วางขอบเขตและงบ ลดงานเพิ่มที่ไม่จำเป็น", image: "/assets/services/service-renovation-fast.webp" },
  { slug: "civil-road", title: "งานโยธาและถนน", desc: "ถนนคอนกรีต ลาน โรงงาน และงานโครงสร้างที่ต้องรับน้ำหนัก", image: "/assets/projects/rc-road-saraburi-12-ton/01-road-roller.webp" },
  { slug: "system-work", title: "งานระบบอาคาร", desc: "ไฟฟ้า ประปา สุขาภิบาล และระบบประกอบอาคารแบบประสานงานครบ", image: "/assets/services/service-mep-fast.webp" },
];

export const projects = [
  { slug: "rc-road-saraburi-12-ton", title: "ถนนคอนกรีตเสริมเหล็ก รับน้ำหนัก 12 ตัน", type: "งานโยธาและถนน", location: "จังหวัดสระบุรี", image: "/assets/projects/rc-road-saraburi-12-ton/01-road-roller.webp", summary: "ออกแบบลำดับงานชั้นทาง เหล็กเสริม รอยต่อ และการระบายน้ำสำหรับการใช้งานรถหนัก" },
  { slug: "phra2-renovation", title: "รีโนเวทบ้านพักอาศัย พระราม 2", type: "รีโนเวท", location: "กรุงเทพฯ", image: "/assets/projects/phra2-renovation/01-cover.webp", summary: "ปรับฟังก์ชันและภาพรวมบ้าน โดยวางแผนงานรื้อ งานระบบ และงานตกแต่งให้ต่อเนื่อง" },
  { slug: "rowhouse-10-families", title: "อาคารเรือนแถว 10 ครอบครัว", type: "ก่อสร้างอาคาร", location: "ประเทศไทย", image: "/assets/projects/rowhouse-10-families/05-foundation-rebar.webp", summary: "งานอาคารสองชั้นที่เน้นมาตรฐานโครงสร้างและการควบคุมคุณภาพเป็นงวด" },
  { slug: "school-25", title: "อาคารเรียนครบรอบ 25 ปี", type: "อาคารการศึกษา", location: "ประเทศไทย", image: "/assets/projects/school-25/01-p01.webp", summary: "ก่อสร้างอาคารเพื่อการศึกษา พร้อมระบบประกอบอาคารและการส่งมอบตามแผน" },
  { slug: "military-saraburi", title: "โครงการย้ายหน่วยพัน ซบร.", type: "อาคารราชการ", location: "จังหวัดสระบุรี", image: "/assets/projects/military-saraburi/04-p10.webp", summary: "งานก่อสร้างที่ต้องประสานหลายหมวดงานและตรวจสอบคุณภาพตามข้อกำหนด" },
  { slug: "wichai-sriracha", title: "บ้านคุณวิชัย", type: "บ้านพักอาศัย", location: "ศรีราชา ชลบุรี", image: "/assets/projects/wichai-sriracha/02-p13.webp", summary: "บ้านพักอาศัยที่บริหารงานโครงสร้าง สถาปัตยกรรม และระบบให้เป็นภาพเดียวกัน" },
  { slug: "lake-legend", title: "บ้าน Lake Legend", type: "ตกแต่งภายใน", location: "แจ้งวัฒนะ นนทบุรี", image: "/assets/projects/lake-legend/01-p23.webp", summary: "งานตกแต่งภายในบ้านพักอาศัย เน้นรายละเอียดวัสดุและความเรียบร้อยของงานติดตั้ง" },
  { slug: "royal-stable", title: "อาคารคอกม้าทรงประจำพระองค์", type: "อาคารเฉพาะทาง", location: "ประเทศไทย", image: "/assets/projects/royal-stable/02-p31.webp", summary: "อาคารเฉพาะทางที่ต้องให้ความสำคัญกับฟังก์ชัน วัสดุ และความปลอดภัย" },
  { slug: "oikos-cafe", title: "OIKOS Cafe & Restaurant", type: "ร้านอาหารและคาเฟ่", location: "ประเทศไทย", image: "/assets/projects/oikos-cafe/01-p35.webp", summary: "พื้นที่เชิงพาณิชย์ที่รวมงานสถาปัตยกรรม ระบบ และบรรยากาศของแบรนด์" },
  { slug: "concrete-road-building", title: "งานปูนถนนและพื้นที่รอบอาคาร", type: "งานปูนถนน", location: "ประเทศไทย", image: "/assets/project-heroes/concrete-road-building-hero.webp", summary: "เตรียมพื้น วางระดับ เทคอนกรีต และควบคุมรอยต่อให้เหมาะกับการใช้งานจริง" },
];

export const articles = [
  { slug: "choose-contractor-nonthaburi", title: "เลือกบริษัทรับเหมาก่อสร้าง นนทบุรี ต้องเช็กอะไรบ้าง", intro: "เช็กนิติบุคคล ผลงานจริง BOQ สัญญา ผู้ควบคุมงาน และการรับประกันก่อนตัดสินใจ", keywords: ["ผู้รับเหมา นนทบุรี", "บริษัทรับเหมาก่อสร้าง"] },
  { slug: "boq-construction-guide", title: "BOQ งานก่อสร้าง อ่านยังไงก่อนเทียบราคา", intro: "ดูปริมาณ หน่วย สเปก งานไม่รวม และผูก BOQ เข้ากับงวดงานเพื่อเทียบราคาแบบไม่หลงตัวเลข", keywords: ["BOQ ก่อสร้าง", "ประเมินราคาก่อสร้าง"] },
  { slug: "construction-contract-guide", title: "สัญญารับเหมาก่อสร้างควรมีอะไรบ้าง", intro: "ขอบเขต แบบ งวดงาน งานเพิ่มลด ระยะเวลา ตรวจรับ และรับประกัน ต้องเขียนให้ตรวจสอบได้", keywords: ["สัญญารับเหมาก่อสร้าง", "งวดงาน"] },
  { slug: "renovation-budget-guide", title: "วางงบรีโนเวทอย่างไรไม่ให้บานปลาย", intro: "แยกงานจำเป็น งานปรับฟังก์ชัน งานตกแต่ง และเงินสำรองสำหรับสิ่งที่พบหลังรื้อ", keywords: ["งบรีโนเวท", "รีโนเวทบ้าน นนทบุรี"] },
  { slug: "concrete-road-guide", title: "ก่อนทำถนนคอนกรีต ต้องคุยอะไรบ้าง", intro: "ชั้นทาง น้ำหนักรถ ความหนา เหล็กเสริม การระบายน้ำ และรอยต่อคือข้อมูลที่มีผลต่อราคา", keywords: ["ถนนคอนกรีต", "งานปูนถนน"] },
  { slug: "construction-process-guide", title: "ขั้นตอนก่อสร้างตั้งแต่สำรวจถึงส่งมอบ", intro: "รู้ลำดับงานช่วยให้เจ้าของโครงการตามความคืบหน้า ตรวจงวด และลดความเสี่ยงได้จริง", keywords: ["ขั้นตอนก่อสร้าง", "ควบคุมงาน"] },
  { slug: "building-permit-guide", title: "ขออนุญาตก่อสร้างบ้านและอาคาร ต้องเตรียมอะไรบ้าง", intro: "สรุปเอกสาร แบบก่อสร้าง ข้อมูลที่ดิน และลำดับเตรียมงานก่อนยื่นขออนุญาต", keywords: ["ขออนุญาตก่อสร้าง", "เอกสารก่อสร้างบ้าน"] },
  { slug: "home-extension-law-guide", title: "ต่อเติมบ้านชิดเขต ต้องเช็กกฎหมายและโครงสร้างอะไรบ้าง", intro: "เช็กแนวเขต ระยะร่น โครงสร้างเดิม และจุดเชื่อมระบบก่อนเริ่มต่อเติม", keywords: ["ต่อเติมบ้านชิดเขต", "กฎหมายต่อเติมบ้าน"] },
  { slug: "construction-payment-inspection-guide", title: "ตรวจรับงานก่อสร้างก่อนจ่ายงวด ต้องเช็กอะไรบ้าง", intro: "ตรวจผลงาน เอกสาร และรายการแก้ไขให้สัมพันธ์กับสัญญาก่อนอนุมัติจ่ายเงินแต่ละงวด", keywords: ["ตรวจรับงานก่อสร้าง", "จ่ายงวดก่อสร้าง"] },
  { slug: "build-house-first-step-guide", title: "จะสร้างบ้านใหม่ เริ่มจากแบบ งบ หรือผู้รับเหมาก่อนดี", intro: "เรียงลำดับคิดตั้งแต่โจทย์การใช้งาน ข้อจำกัดที่ดิน แบบ และการคุยกับผู้รับเหมา", keywords: ["สร้างบ้านเริ่มจากอะไร", "สร้างบ้านใหม่"] },
  { slug: "renovation-mep-guide", title: "รีโนเวทบ้านเก่า ต้องวางแผนงานระบบไฟฟ้าและประปาอย่างไร", intro: "สำรวจระบบเดิม วางจุดใช้งานใหม่ และเผื่อการซ่อมบำรุงก่อนปิดผิวงาน", keywords: ["รีโนเวทงานระบบ", "ไฟฟ้าประปารีโนเวท"] },
];

export function absoluteUrl(path = "") { return `${site.url}${path}`; }
