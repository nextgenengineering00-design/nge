import { LegacyPage } from "@/components/legacy-page";
import { legacyMetadata } from "@/lib/legacy-content";

const baseMetadata = legacyMetadata("services.html", "/services");

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    images: [
      {
        url: "/og-services-2026-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Next Gen Engineering บริการรับเหมาก่อสร้างครบวงจร",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: ["/og-services-2026-v2.jpg"],
  },
};

export default function Page() {
  return <LegacyPage file="services.html" />;
}
