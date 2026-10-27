import { LegacyPage } from "@/components/legacy-page";
import { legacyMetadata } from "@/lib/legacy-content";

const baseMetadata = legacyMetadata("services.html", "/services");

export const metadata = baseMetadata;

export default function Page() {
  return <>
    <link rel="preload" as="image" href="/assets/services/service-hero-house-team.webp" type="image/webp" fetchPriority="high" />
    <LegacyPage file="services.html" />
  </>;
}
