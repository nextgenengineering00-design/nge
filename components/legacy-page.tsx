import { readLegacyDocument } from "@/lib/legacy-content";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { LegacyBodyState } from "@/components/legacy-body-state";

/* eslint-disable @next/next/no-css-tags */

export function LegacyPage({ file, project = false }: { file: string; project?: boolean }) {
  const page = readLegacyDocument(file);
  return <div className={page.bodyClass} data-legacy-page={page.page}>
    <LegacyBodyState page={page.page} bodyClass={page.bodyClass} />
    <link rel="stylesheet" href="/legacy/styles.min.css?v=20260925-4" />
    {!project && <link rel="stylesheet" href="/legacy/service-seo.css?v=20260925-1" />}
    {project && <link rel="stylesheet" href="/legacy/project-detail.css?v=20260920" />}
    {page.jsonLd.map((value, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: value.replace(/</g, "\\u003c") }} />)}
    {page.styles.map((value, index) => <style key={`style-${index}`} dangerouslySetInnerHTML={{ __html: value }} />)}
    <div dangerouslySetInnerHTML={{ __html: page.html }} />
    <LegacyRuntimeScripts sources={project
      ? ["/legacy/site-config.js","/legacy/project-detail.js","/legacy/language-switcher.js?v=20260925-4"]
      : ["/legacy/site-config.js?v=20260925-1","/legacy/site-shell.js?v=20260925-3","/legacy/app.js?v=20260925-1","/legacy/language-switcher.js?v=20260925-4"]} />
  </div>;
}
