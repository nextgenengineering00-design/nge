import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/site-data";
import { legacySlugs } from "@/lib/legacy-content";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only report a modification date when the page content actually changed.
  const updated: Record<string, string> = {
    "": "2026-10-04",
    services: "2026-10-04",
    "renovation-service-nonthaburi": "2026-10-04",
    "renovation-nonthaburi": "2026-09-28",
    "renovation-budget-guide": "2026-09-28",
    "renovation-structure-check-guide": "2026-09-28",
    "renovation-mep-guide": "2026-09-28",
    projects: "2026-10-04",
    "projects/pum-garage-roof-nawamin-26": "2026-10-04",
    "condo-renovation-nonthaburi": "2026-10-04",
    "building-renovation-nonthaburi": "2026-10-04",
    "contractor-mueang-nonthaburi": "2026-10-05",
    "projects/lake-legend": "2026-10-05",
  };
  const paths = ["", "about", "services", "projects", "knowledge", "contact", "privacy", ...projects.map(p => `projects/${p.slug}`), ...legacySlugs];
  return [...new Set(paths)].map(path => ({
    url: path ? `${site.url}/${path}` : `${site.url}/`,
    ...(updated[path] ? { lastModified: updated[path] } : {}),
    changeFrequency: path ? "monthly" : "weekly",
    priority: !path ? 1 : path === "renovation-service-nonthaburi" ? .95 : path.includes("renovation") ? .85 : .75,
  }));
}
