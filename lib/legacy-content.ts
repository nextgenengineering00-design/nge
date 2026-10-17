import type { Metadata } from "next";
import { localAreaSlugs } from "@/lib/local-area-data";
import { localServiceSlugs } from "@/lib/local-service-data";
import { legacyHtml } from "@/lib/legacy-content.generated";

export type LegacyDocument = {
  title: string;
  description: string;
  html: string;
  bodyClass: string;
  page: string;
  jsonLd: string[];
  styles: string[];
  image?: string;
};

export const knowledgeArticleSlugs = ["choose-contractor-nonthaburi", "boq-construction-guide", "construction-contract-guide", "construction-process-guide", "renovation-budget-guide", "building-permit-guide", "home-extension-law-guide", "construction-payment-inspection-guide", "build-house-first-step-guide", "renovation-mep-guide", "renovation-nonthaburi", "renovation-structure-check-guide", "concrete-road-guide", "concrete-road-cost-guide", "house-construction-cost-guide", "house-construction-timeline-guide", "contractor-quotation-guide"] as const;
export const legacySlugs=[...knowledgeArticleSlugs,"build-home-nonthaburi",...localAreaSlugs,...localServiceSlugs,"extend-home-nonthaburi","faq","renovation-service-nonthaburi","condo-renovation-nonthaburi","building-renovation-nonthaburi"] as const;

function decodeMetadata(value: string) {
  const entities: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", "#39": "'", "#x27": "'" };
  return value.replace(/&(amp|quot|apos|lt|gt|#39|#x27);/g, (_, entity: string) => entities[entity]);
}

export function readLegacyDocument(relativeFile: string): LegacyDocument {
  const source = legacyHtml[relativeFile.replaceAll("\\", "/")];
  if (!source) throw new Error(`Legacy page not found: ${relativeFile}`);
  const title = decodeMetadata(source.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "Next Gen Engineering");
  const description = decodeMetadata(source.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]
    || source.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i)?.[1]
    || "Next Gen Engineering");
  const image = source.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i)?.[1]
    || source.match(/<meta\s+content=["']([^"']*)["']\s+property=["']og:image["']/i)?.[1]
    || source.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']*)["']/i)?.[1];
  const bodyMatch = source.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) throw new Error(`Legacy page has no body: ${relativeFile}`);
  const attributes = bodyMatch[1];
  const bodyClass = attributes.match(/class=["']([^"']*)["']/i)?.[1] || "";
  const page = attributes.match(/data-page=["']([^"']*)["']/i)?.[1] || "home";
  let firstImage = true;
  const html = bodyMatch[2]
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<img\b[^>]*>/gi, tag => {
      let optimized = /\sdecoding=/i.test(tag) ? tag : tag.replace(/>$/, ' decoding="async">');
      if (firstImage) {
        firstImage = false;
        if (!/\sloading=/i.test(optimized)) optimized = optimized.replace(/>$/, ' loading="eager">');
        if (!/\sfetchpriority=/i.test(optimized)) optimized = optimized.replace(/>$/, ' fetchpriority="high">');
        return optimized;
      }
      if (!/\sloading=/i.test(optimized) && !/\sfetchpriority=["']high["']/i.test(optimized)) optimized = optimized.replace(/>$/, ' loading="lazy">');
      return optimized;
    })
    .replace(/\r\n?/g, "\n");
  const jsonLd = [...source.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1].trim().replaceAll("https://ngebuild.com/og-nonthaburi.jpg", "https://ngebuild.com/og-ngebuild-preview-20260922.jpg").replaceAll("https://ngebuild.com/og-ngebuild-cover-2026.jpg", "https://ngebuild.com/og-ngebuild-preview-20260922.jpg"));
  const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1].trim());
  return { title, description, html, bodyClass, page, jsonLd, styles, image };
}

export function legacyMetadata(relativeFile: string, canonical: string, noindex = false): Metadata {
  const page = readLegacyDocument(relativeFile);
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical },
    openGraph: { type: "website", locale: "th_TH", title: page.title, description: page.description, url: canonical, images: page.image ? [{ url: page.image }] : undefined },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: page.image ? [page.image] : undefined },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}
