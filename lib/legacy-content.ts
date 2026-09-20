import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { localAreaSlugs } from "@/lib/local-area-data";

export type LegacyDocument = {
  title: string;
  description: string;
  html: string;
  bodyClass: string;
  page: string;
  jsonLd: string[];
  styles: string[];
};

export const legacySlugs=["boq-construction-guide","build-home-nonthaburi","choose-contractor-nonthaburi","concrete-road-cost-guide","concrete-road-guide","construction-contract-guide","construction-process-guide",...localAreaSlugs,"extend-home-nonthaburi","faq","renovation-budget-guide","renovation-nonthaburi","renovation-service-nonthaburi","renovation-structure-check-guide","why-us"] as const;

export function readLegacyDocument(relativeFile: string): LegacyDocument {
  const fullPath = path.join(process.cwd(), "legacy-source", relativeFile);
  const source = fs.readFileSync(fullPath, "utf8");
  const title = source.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "Next Gen Engineering";
  const description = source.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]
    || source.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i)?.[1]
    || "Next Gen Engineering";
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
  const jsonLd = [...source.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1].trim());
  const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1].trim());
  return { title, description, html, bodyClass, page, jsonLd, styles };
}

export function legacyMetadata(relativeFile: string, canonical: string, noindex = false): Metadata {
  const page = readLegacyDocument(relativeFile);
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical },
    openGraph: { type: "website", locale: "th_TH", title: page.title, description: page.description, url: canonical },
    twitter: { card: "summary_large_image", title: page.title, description: page.description },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
