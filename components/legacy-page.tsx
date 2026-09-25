import { readLegacyDocument } from "@/lib/legacy-content";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { LegacyBodyState } from "@/components/legacy-body-state";
import { type SiteLocale, translateLegacyHtml, translateLegacyJsonLd, translateText } from "@/lib/static-i18n";

/* eslint-disable @next/next/no-css-tags */

export function LegacyPage({ file, project = false, locale = "th" }: { file: string; project?: boolean; locale?: SiteLocale }) {
  const page = readLegacyDocument(file);
  const translatedHtml = translateLegacyHtml(page.html, locale);
  return <div className={page.bodyClass} data-legacy-page={page.page} data-site-locale={locale}>
    <LegacyBodyState page={page.page} bodyClass={page.bodyClass} locale={locale} />
    <link rel="stylesheet" href="/legacy/styles.min.css?v=20260925-5" />
    {!project && <link rel="stylesheet" href="/legacy/service-seo.css?v=20260925-1" />}
    {project && <link rel="stylesheet" href="/legacy/project-detail.css?v=20260920" />}
    {page.jsonLd.map((value, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: translateLegacyJsonLd(value, locale).replace(/</g, "\\u003c") }} />)}
    {page.styles.map((value, index) => <style key={`style-${index}`} dangerouslySetInnerHTML={{ __html: value }} />)}
    <div dangerouslySetInnerHTML={{ __html: translatedHtml }} />
    <LegacyRuntimeScripts sources={project
      ? ["/legacy/site-config.js?v=20260925-1","/legacy/project-detail.js?v=20260925-1","/legacy/language-route-switcher.js?v=20260925-2"]
      : ["/legacy/site-config.js?v=20260925-1","/legacy/site-shell.js?v=20260925-6","/legacy/app.js?v=20260925-1","/legacy/language-route-switcher.js?v=20260925-2"]} />
  </div>;
}

export function translatedLegacyMetadataText(file: string, locale: SiteLocale) {
  const page = readLegacyDocument(file);
  return { title: translateText(page.title, locale), description: translateText(page.description, locale), image: page.image };
}
