import type { MetadataRoute } from "next";
import { site } from "@/lib/site-data";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/ai-agent", "/ai-marketing", "/crm"] }], sitemap: `${site.url}/sitemap.xml`, host: site.url };
}
