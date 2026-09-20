import type { Metadata, Viewport } from "next";
import { Bai_Jamjuree, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, site } from "@/lib/site-data";

const thai = IBM_Plex_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "600"], variable: "--font-legacy-body", display: "optional", preload: false });
const display = Bai_Jamjuree({ subsets: ["thai", "latin"], weight: "700", variable: "--font-legacy-display", display: "optional", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "รับเหมาก่อสร้าง นนทบุรี | บางใหญ่ บางกรวย บางบัวทอง ไทรน้อย ปากเกร็ด", template: "%s | NGE" },
  description: "รับเหมาก่อสร้าง นนทบุรี สร้างบ้าน อาคาร ต่อเติม รีโนเวท งานโยธาและงานระบบ ครอบคลุมบางใหญ่ บางกรวย บางบัวทอง ไทรน้อย ปากเกร็ด และพื้นที่ใกล้เคียง",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "th_TH", siteName: site.name, url: "/", images: [{ url: "/og-ngebuild-cover-2026.jpg", width: 1200, height: 630, alt: "Next Gen Engineering" }] },
  twitter: { card: "summary_large_image", images: ["/og-ngebuild-cover-2026.jpg"] },
  icons: { icon: "/nge-icon.svg" },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0a2a5e" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = [{
    "@context": "https://schema.org", "@type": "GeneralContractor", name: site.name,
    url: site.url, image: absoluteUrl("/og-ngebuild-cover-2026.jpg"), telephone: site.phone,
    areaServed: ["นนทบุรี", "บางใหญ่", "บางกรวย", "บางบัวทอง", "ไทรน้อย", "ปากเกร็ด", "กรุงเทพมหานคร", "ปทุมธานี", "ปริมณฑล"], priceRange: "฿฿฿",
    sameAs: ["https://www.dataforthai.com/company/0103528028423/"]
  }, { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, inLanguage: "th-TH" }];
  return <html lang="th"><body className={`${thai.variable} ${display.variable}`}><JsonLd data={schema} />{children}</body></html>;
}
