import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LegacyPage, translatedLegacyMetadataText } from "@/components/legacy-page";
import { legacySlugs } from "@/lib/legacy-content";
import { projects } from "@/lib/site-data";
import { isLocalAreaSlug } from "@/lib/local-area-data";
import { isLocalServiceSlug } from "@/lib/local-service-data";
import { type SiteLocale, localeConfig, stripLocalePrefix, translateText } from "@/lib/static-i18n";

const directLegacy: Record<string, string> = {
  "": "index.html",
  about: "about.html",
  services: "services.html",
  projects: "projects.html",
  knowledge: "knowledge.html",
  contact: "contact.html",
  privacy: "privacy.html",
  "construction-quote": "construction-quote.html",
  "renovation-quote": "renovation-quote.html",
  "home-extension-quote": "home-extension-quote.html",
};

function normalizeParts(parts?: string[]) {
  return (parts || []).filter(Boolean);
}

export function resolveLocalizedPage(parts?: string[]) {
  const clean = normalizeParts(parts);
  if (clean.length === 0) return { kind: "legacy" as const, file: "index.html", canonical: "/" };

  if (clean[0] === "reviews") return { kind: "redirect" as const, href: "/projects#reviews" };

  if (clean[0] === "knowledge" && clean.length === 2) {
    const slug = clean[1];
    if (legacySlugs.includes(slug as (typeof legacySlugs)[number])) return { kind: "redirect" as const, href: `/${slug}` };
  }

  if (clean[0] === "projects" && clean.length === 2) {
    const slug = clean[1];
    if (projects.some(project => project.slug === slug)) return { kind: "project" as const, file: `projects/${slug}.html`, canonical: `/projects/${slug}` };
  }

  if (clean.length === 1) {
    const slug = clean[0];
    if (isLocalAreaSlug(slug)) return { kind: "local-area" as const, slug, canonical: `/${slug}` };
    if (isLocalServiceSlug(slug)) return { kind: "local-service" as const, slug, canonical: `/${slug}` };
    if (directLegacy[slug]) return { kind: "legacy" as const, file: directLegacy[slug], canonical: `/${slug}` };
    if (legacySlugs.includes(slug as (typeof legacySlugs)[number])) return { kind: "legacy" as const, file: `${slug}.html`, canonical: `/${slug}` };
  }

  return { kind: "not-found" as const };
}

export function localizedStaticParams() {
  const base = [
    [],
    ...Object.keys(directLegacy).filter(Boolean).map(slug => [slug]),
    ...legacySlugs.map(slug => [slug]),
    ...projects.map(project => ["projects", project.slug]),
  ];
  const unique = new Map<string, string[]>();
  for (const parts of base) unique.set(parts.join("/"), parts);
  return [...unique.values()].map(slug => ({ slug }));
}

export function localizedMetadata(parts: string[] | undefined, locale: Exclude<SiteLocale, "th">): Metadata {
  const resolved = resolveLocalizedPage(parts);
  const prefix = localeConfig[locale].prefix;
  const baseCanonical = "canonical" in resolved ? resolved.canonical : "/";
  const localizedUrl = baseCanonical === "/" ? prefix : `${prefix}${baseCanonical}`;

  if (resolved.kind === "legacy" || resolved.kind === "project") {
    const page = translatedLegacyMetadataText(resolved.file, locale);
    return {
      title: { absolute: page.title },
      description: page.description,
      alternates: {
        canonical: baseCanonical,
        languages: { "th-TH": baseCanonical, en: `/en${baseCanonical === "/" ? "" : baseCanonical}`, "zh-CN": `/zh${baseCanonical === "/" ? "" : baseCanonical}` },
      },
      openGraph: { type: "website", locale: locale === "zh" ? "zh_CN" : "en_US", url: localizedUrl, title: page.title, description: page.description, images: page.image ? [{ url: page.image }] : undefined },
      twitter: { card: "summary_large_image", title: page.title, description: page.description, images: page.image ? [page.image] : undefined },
      // Translated routes are ready for visitors but kept out of the index until every long-form article is fully localized.
      robots: { index: false, follow: true },
    };
  }

  if (resolved.kind === "local-area" || resolved.kind === "local-service") {
    return {
      title: { absolute: translateText("Next Gen Engineering", locale) },
      alternates: { canonical: baseCanonical },
      robots: { index: false, follow: true },
    };
  }
  return {};
}

export function LocalizedSitePage({ parts, locale }: { parts?: string[]; locale: Exclude<SiteLocale, "th"> }) {
  const resolved = resolveLocalizedPage(parts);
  if (resolved.kind === "not-found") notFound();
  if (resolved.kind === "redirect") {
    const base = stripLocalePrefix(resolved.href.split("#")[0] || "/");
    const hash = resolved.href.includes("#") ? `#${resolved.href.split("#")[1]}` : "";
    redirect(`${localeConfig[locale].prefix}${base === "/" ? "" : base}${hash}`);
  }
  if (resolved.kind === "project") return <LegacyPage file={resolved.file} project locale={locale} />;
  if (resolved.kind === "legacy") return <LegacyPage file={resolved.file} locale={locale} />;
  if (resolved.kind === "local-area" || resolved.kind === "local-service") redirect(`${localeConfig[locale].prefix}/services`);
  notFound();
}
