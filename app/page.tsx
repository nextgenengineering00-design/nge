import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LegacyPage } from "@/components/legacy-page";
import { absoluteUrl, site } from "@/lib/site-data";

const homeTitle = "รับเหมาก่อสร้างครบวงจร นนทบุรี | NGE";
const homeDescription =
  "NGE รับเหมาก่อสร้างครบวงจร นนทบุรี สร้างบ้าน อาคาร ต่อเติม รีโนเวท งานโครงสร้าง งานระบบและงานโยธา ดูแลโดยทีมวิศวกร ประสบการณ์กว่า 40 ปี";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: site.name,
    url: "/",
    title: homeTitle,
    description: homeDescription,
    images: [
      {
        url: "/og-ngebuild-preview-20260922.jpg",
        width: 1200,
        height: 630,
        alt: "NGE รับเหมาก่อสร้างครบวงจร นนทบุรี",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: ["/og-ngebuild-preview-20260922.jpg"],
  },
};

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${site.url}/#webpage`,
  url: `${site.url}/`,
  name: homeTitle,
  description: homeDescription,
  inLanguage: "th-TH",
  isPartOf: { "@id": `${site.url}/#website` },
  about: { "@id": `${site.url}/#organization` },
  mainEntity: { "@id": `${site.url}/#organization` },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: absoluteUrl("/og-ngebuild-preview-20260922.jpg"),
  },
};

export default function Home() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/assets/hero-home-modern-v2.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <JsonLd data={homePageSchema} />
      <LegacyPage file="index.html" includeJsonLd={false} />
    </>
  );
}
