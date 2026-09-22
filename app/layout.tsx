import type { Metadata, Viewport } from "next";
import { Anuphan, Sarabun } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, site } from "@/lib/site-data";

const thai = Sarabun({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600"], variable: "--font-legacy-body", display: "swap", preload: false });
const display = Anuphan({ subsets: ["thai", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-legacy-display", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Next Gen Engineering | สร้าง ต่อเติม รีโนเวท โดยทีมวิศวกร", template: "%s | NGE" },
  description: "Next Gen Engineering ดูแลงานสร้างบ้าน อาคาร ต่อเติม รีโนเวท งานโยธาและงานระบบในนนทบุรี กรุงเทพฯ และปริมณฑล โดยทีมวิศวกรโยธา",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "th_TH", siteName: site.name, url: "/", images: [{ url: "/og-ngebuild-cover-2026.jpg", width: 1200, height: 630, alt: "Next Gen Engineering" }] },
  twitter: { card: "summary_large_image", images: ["/og-ngebuild-cover-2026.jpg"] },
  icons: {
    icon: [{ url: "/nge-logo-icon-v2-32.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/nge-logo-icon-v2-180.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0a2a5e" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = [{
    "@context": "https://schema.org", "@type": ["Organization", "GeneralContractor"], "@id": `${site.url}/#organization`, name: site.name,
    legalName: site.legalName, url: site.url, image: absoluteUrl("/og-ngebuild-cover-2026.jpg"), logo: absoluteUrl("/nge-logo-icon-v2-180.png"), telephone: site.phone, email: site.email,
    address: { "@type": "PostalAddress", streetAddress: site.streetAddress, addressLocality: "นนทบุรี", addressRegion: "นนทบุรี", postalCode: site.postalCode, addressCountry: "TH" },
    hasMap: site.mapUrl,
    identifier: [{ "@type": "PropertyValue", name: "เลขทะเบียนนิติบุคคล", value: site.legalId }, { "@type": "PropertyValue", name: "ใบอนุญาตวิศวกรโยธา", value: site.engineerLicense }],
    areaServed: ["นนทบุรี", "บางใหญ่", "บางกรวย", "บางบัวทอง", "ไทรน้อย", "ปากเกร็ด", "กรุงเทพมหานคร", "ปทุมธานี", "ปริมณฑล"], priceRange: "฿฿฿",
    sameAs: [site.facebook, `https://www.dataforthai.com/company/${site.legalId}/`]
  }, { "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url, inLanguage: "th-TH", publisher: { "@id": `${site.url}/#organization` } }];
  return <html lang="th"><body className={`${thai.variable} ${display.variable}`}><JsonLd data={schema} />{children}</body></html>;
}
