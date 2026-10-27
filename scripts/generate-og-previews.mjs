import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const siteUrl = "https://ngebuild.com";
const outputDir = join(root, "public", "assets", "og-pages");
const fontPath = join(root, "scripts", "assets", "Kanit-SemiBold.ttf");
const fontBase64 = readFileSync(fontPath).toString("base64");

const backgroundOverrides = {
  "/about": "/assets/about/nge-meeting-company-profile.webp",
  "/services": "/assets/services/service-hero-house-team.webp",
  "/projects": "/assets/services/ref-v2/services-complete-hero-v2.webp",
  "/knowledge": "/assets/knowledge-covers/choose-contractor-nonthaburi-cover.webp",
  "/contact": "/assets/contact/contact-pin.jpg",
  "/privacy": "/assets/hero-home-modern-v2.webp",
  "/faq": "/assets/page-heroes/faq-consultation-v2.webp",
  "/construction-quote": "/assets/hero-home-modern-v2.webp",
  "/home-extension-quote": "/assets/services/service-building-extension-fast.webp",
  "/renovation-quote": "/assets/services/service-renovation-fast.webp",
};

function decodeHtml(value) {
  let decoded = value;
  for (let index = 0; index < 3; index += 1) {
    const next = decoded
      .replaceAll("&amp;", "&")
      .replaceAll("&quot;", '"')
      .replaceAll("&#39;", "'")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">");
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

function metaContent(html, key, attribute = "property") {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+${attribute}=["']${escaped}["'][^>]+content=["']([^"']*)`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attribute}=["']${escaped}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtml(match[1].trim());
  }
  return "";
}

function pageTitle(html) {
  return metaContent(html, "og:title") || decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "Next Gen Engineering");
}

function categoryFor(pathname) {
  if (pathname.startsWith("/projects/")) return "ผลงานจริงจากหน้างาน";
  if (pathname === "/projects") return "รวมผลงานก่อสร้าง";
  if (/contractor|nonthaburi|bang-|pak-kret|sai-noi|near-me/.test(pathname)) return "บริการในพื้นที่นนทบุรี";
  if (pathname === "/knowledge" || /guide|boq|permit|law|process|inspection|budget|structure|mep/.test(pathname)) return "ความรู้ก่อสร้าง";
  if (pathname.includes("quote")) return "เริ่มต้นประเมินโครงการ";
  if (pathname === "/about") return "ประสบการณ์กว่า 40 ปี";
  if (pathname === "/services") return "บริการรับเหมาก่อสร้างครบวงจร";
  if (pathname === "/contact") return "ปรึกษาทีมงาน NGE";
  return "NEXT GEN ENGINEERING";
}

function titleFontSize(title) {
  const length = [...title].length;
  if (length <= 28) return 82;
  if (length <= 44) return 72;
  if (length <= 62) return 62;
  return 54;
}

function wrapTitle(title, fontSize) {
  const segmenter = new Intl.Segmenter("th", { granularity: "word" });
  const parts = [...segmenter.segment(title)].map(({ segment }) => segment);
  const maxUnits = Math.floor(940 / (fontSize * 0.54));
  const lines = [];
  let line = "";
  for (const part of parts) {
    const candidate = `${line}${part}`.trim();
    if ([...candidate].length > maxUnits && line.trim()) {
      lines.push(line.trim());
      line = part.trimStart();
    } else {
      line += part;
    }
  }
  if (line.trim()) lines.push(line.trim());
  if (lines.length <= 3) return lines;
  const compact = [lines[0], lines[1], lines.slice(2).join(" ")];
  compact[2] = [...compact[2]].length > maxUnits ? `${[...compact[2]].slice(0, maxUnits - 1).join("")}…` : compact[2];
  return compact;
}

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function overlaySvg({ title, pathname }) {
  const fontSize = titleFontSize(title);
  const lines = wrapTitle(title, fontSize);
  const lineHeight = Math.round(fontSize * 1.18);
  const firstY = 315 - ((lines.length - 1) * lineHeight) / 2;
  const tspans = lines.map((line, index) => `<tspan x="600" y="${Math.round(firstY + index * lineHeight)}">${escapeXml(line)}</tspan>`).join("");
  const displayPath = pathname === "/" ? "ngebuild.com" : `ngebuild.com${pathname}`;
  return Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @font-face { font-family: Kanit; src: url(data:font/truetype;base64,${fontBase64}) format('truetype'); font-weight: 600; }
          text { font-family: Kanit, sans-serif; }
        </style>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#060606" stop-opacity=".68"/>
          <stop offset=".52" stop-color="#0a0a0a" stop-opacity=".76"/>
          <stop offset="1" stop-color="#050505" stop-opacity=".88"/>
        </linearGradient>
        <radialGradient id="focus" cx="50%" cy="46%" r="58%">
          <stop offset="0" stop-color="#000" stop-opacity=".08"/>
          <stop offset="1" stop-color="#000" stop-opacity=".42"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <rect width="1200" height="630" fill="url(#focus)"/>
      <rect x="52" y="42" width="1096" height="546" rx="10" fill="none" stroke="#fff" stroke-opacity=".16"/>
      <rect x="557" y="64" width="86" height="7" rx="3.5" fill="#f5a400"/>
      <text x="600" y="116" fill="#fff" font-size="30" font-weight="600" text-anchor="middle" letter-spacing="2">NEXT GEN ENGINEERING</text>
      <text x="600" y="168" fill="#f5a400" font-size="25" font-weight="600" text-anchor="middle">${escapeXml(categoryFor(pathname))}</text>
      <text fill="#fff" font-size="${fontSize}" font-weight="600" text-anchor="middle" dominant-baseline="middle">${tspans}</text>
      <text x="600" y="548" fill="#fff" fill-opacity=".9" font-size="24" font-weight="600" text-anchor="middle">${escapeXml(displayPath)}</text>
    </svg>`);
}

async function getText(url) {
  const response = await fetch(url, { headers: { "user-agent": "NGE social preview generator" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function getBuffer(url) {
  const response = await fetch(url, { headers: { "user-agent": "NGE social preview generator" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

const sitemap = await getText(`${siteUrl}/sitemap.xml`);
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeHtml(match[1]));
const extraUrls = ["/construction-quote", "/home-extension-quote", "/renovation-quote"].map((path) => `${siteUrl}${path}`);
const urls = [...new Set([...sitemapUrls, ...extraUrls])].filter((url) => new URL(url).pathname !== "/");

mkdirSync(outputDir, { recursive: true });

for (const url of urls) {
  const pathname = new URL(url).pathname.replace(/\/$/, "") || "/";
  const html = await getText(url);
  const title = pageTitle(html)
    .replace(/\s*\|\s*ผลงาน Next Gen Engineering$/i, "")
    .replace(/\s*\|\s*NGE$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const originalImage = metaContent(html, "og:image");
  const backgroundPath = backgroundOverrides[pathname] || originalImage || "/assets/hero-home-modern-v2.webp";
  const backgroundUrl = new URL(backgroundPath, siteUrl).toString();
  let background;
  try {
    background = await getBuffer(backgroundUrl);
  } catch {
    background = await getBuffer(`${siteUrl}/assets/hero-home-modern-v2.webp`);
  }
  const filename = `${pathname.slice(1).replaceAll("/", "--")}.jpg`;
  await sharp(background)
    .rotate()
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.82, saturation: 0.9 })
    .composite([{ input: overlaySvg({ title, pathname }) }])
    .jpeg({ quality: 91, chromaSubsampling: "4:4:4", progressive: true })
    .toFile(join(outputDir, filename));
  console.log(`${pathname} -> ${filename}`);
}

console.log(`Generated ${urls.length} social preview images in ${outputDir}`);
