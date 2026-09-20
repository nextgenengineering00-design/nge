import { LegacyPage } from "@/components/legacy-page";
import { legacyMetadata } from "@/lib/legacy-content";
export const metadata=legacyMetadata("about.html","/about");
export default function Page(){return <LegacyPage file="about.html"/>}
