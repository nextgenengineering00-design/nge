import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/site-data";
import { legacySlugs } from "@/lib/legacy-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...["about", "services", "projects", "knowledge", "reviews", "contact", "privacy"].map(path => ({ url: `${site.url}/${path}`, lastModified: now, changeFrequency: "monthly" as const, priority: path === "contact" ? .8 : .9 })),
    ...projects.map(p => ({ url: `${site.url}/projects/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .8 })),
    ...legacySlugs.map(slug => ({ url: `${site.url}/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .75 }))
  ];
}
