import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const specs = {
  "about.html": { image: "og-about-2026.jpg", alt: "ประวัติบริษัท Next Gen Engineering" },
  "services.html": { image: "og-services-2026.jpg", alt: "บริการรับเหมาก่อสร้างครบวงจร Next Gen Engineering" },
  "projects.html": { image: "og-projects-2026.jpg", alt: "ผลงานก่อสร้างจริงของ Next Gen Engineering" },
  "knowledge.html": { image: "og-knowledge-2026.jpg", alt: "ความรู้ก่อสร้างจาก Next Gen Engineering" },
};

for (const [file, spec] of Object.entries(specs)) {
  const path = join(root, "legacy-source", file);
  let html = readFileSync(path, "utf8");
  const imageUrl = `https://ngebuild.com/${spec.image}`;
  html = html
    .replace(/(<meta property="og:image" content=")[^"]+("[^>]*>)/i, `$1${imageUrl}$2`)
    .replace(/(<meta content=")[^"]+(" property="og:image"[^>]*>)/i, `$1${imageUrl}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]+("[^>]*>)/i, `$1${imageUrl}$2`)
    .replace(/(<meta content=")[^"]+(" name="twitter:image"[^>]*>)/i, `$1${imageUrl}$2`);
  if (!/property="og:image:width"/i.test(html)) {
    const sizeMeta = file === "knowledge.html"
      ? `<meta content="1200" property="og:image:width"/><meta content="630" property="og:image:height"/><meta content="${spec.alt}" property="og:image:alt"/>`
      : `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${spec.alt}">`;
    html = html.replace(/(<meta[^>]+property="og:image"[^>]*>)/i, `$1${sizeMeta}`);
  }
  writeFileSync(path, html, "utf8");
}

const contactPath = join(root, "legacy-source", "contact.html");
let contact = readFileSync(contactPath, "utf8");
if (!/property="og:image"/i.test(contact)) {
  const tags = `\n  <meta property="og:type" content="website"><meta property="og:locale" content="th_TH"><meta property="og:site_name" content="Next Gen Engineering"><meta property="og:title" content="ติดต่อทีมงาน Next Gen Engineering"><meta property="og:description" content="ปรึกษางานก่อสร้าง ต่อเติม และรีโนเวทในนนทบุรี กรุงเทพฯ และปริมณฑล"><meta property="og:url" content="https://ngebuild.com/contact"><meta property="og:image" content="https://ngebuild.com/og-contact-2026.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="ติดต่อทีมงาน Next Gen Engineering"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="ติดต่อทีมงาน Next Gen Engineering"><meta name="twitter:description" content="ปรึกษางานก่อสร้างในนนทบุรีและพื้นที่ใกล้เคียง"><meta name="twitter:image" content="https://ngebuild.com/og-contact-2026.jpg">`;
  contact = contact.replace(/(<link rel="canonical" href="https:\/\/ngebuild\.com\/contact">)/, `$1${tags}`);
}
writeFileSync(contactPath, contact, "utf8");
