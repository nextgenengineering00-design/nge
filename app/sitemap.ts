import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/site-data";
import { knowledgeArticleSlugs, legacySlugs } from "@/lib/legacy-content";
import { houseDesigns } from "@/lib/house-designs";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only report a modification date when the page content actually changed.
  const updated: Record<string, string> = {
    "": "2026-10-31",
    "house-designs": "2026-10-31",
    services: "2026-10-04",
    "renovation-service-nonthaburi": "2026-10-04",
    "renovation-nonthaburi": "2026-09-28",
    "renovation-budget-guide": "2026-09-28",
    "renovation-structure-check-guide": "2026-09-28",
    "renovation-mep-guide": "2026-09-28",
    projects: "2026-10-04",
    "projects/officer-residence-bangkok": "2026-10-24",
    "projects/pum-garage-roof-nawamin-26": "2026-10-04",
    "condo-renovation-nonthaburi": "2026-10-04",
    "building-renovation-nonthaburi": "2026-10-04",
    "build-home-nonthaburi": "2026-11-02",
    "contractor-mueang-nonthaburi": "2026-10-05",
    "projects/lake-legend": "2026-10-05",
    knowledge: "2026-10-15",
  };
  for (const slug of knowledgeArticleSlugs) updated[slug] = "2026-10-15";
  for (const house of houseDesigns) updated[`house-designs/${house.slug}`] = "2026-10-31";
  const paths = ["", "about", "services", "projects", "knowledge", "contact", "privacy", "house-designs", ...houseDesigns.map(h=>`house-designs/${h.slug}`), ...projects.map(p => `projects/${p.slug}`), ...legacySlugs];
  return [...new Set(paths)].map(path => ({
    url: path ? `${site.url}/${path}` : `${site.url}/`,
    ...(updated[path] ? { lastModified: updated[path] } : {}),
    changeFrequency: path ? "monthly" : "weekly",
    priority: !path ? 1 : path === "renovation-service-nonthaburi" ? .95 : path.includes("renovation") ? .85 : .75,
  }));
}
