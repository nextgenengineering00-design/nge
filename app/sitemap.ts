import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/site-data";
import { legacySlugs } from "@/lib/legacy-content";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only report a modification date when the page content actually changed.
  const updated = new Set(["", "services", "renovation-service-nonthaburi", "renovation-nonthaburi", "renovation-budget-guide", "renovation-structure-check-guide", "renovation-mep-guide"]);
  const paths = ["", "about", "services", "projects", "knowledge", "contact", "privacy", ...projects.map(p => `projects/${p.slug}`), ...legacySlugs];
  return [...new Set(paths)].map(path => ({
    url: path ? `${site.url}/${path}` : `${site.url}/`,
    ...(updated.has(path) ? { lastModified: "2026-09-28" } : {}),
    changeFrequency: path ? "monthly" : "weekly",
    priority: !path ? 1 : path === "renovation-service-nonthaburi" ? .9 : .75,
  }));
}
