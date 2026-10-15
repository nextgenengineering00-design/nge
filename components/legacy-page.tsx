import { knowledgeArticleSlugs, readLegacyDocument } from "@/lib/legacy-content";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { LegacyBodyState } from "@/components/legacy-body-state";

/* eslint-disable @next/next/no-css-tags */

export function LegacyPage({ file, project = false, includeJsonLd = true }: { file: string; project?: boolean; includeJsonLd?: boolean }) {
  const page = readLegacyDocument(file);
  const slug = file.replace(/\.html$/, "");
  const isKnowledgeArticle = knowledgeArticleSlugs.some(item => item === slug);
  const isKnowledgePage = isKnowledgeArticle || slug === "knowledge";
  const tabs = [
    ["บทความทั้งหมด", "/knowledge"],
    ["เริ่มสร้างบ้าน", "/build-house-first-step-guide"],
    ["งบและ BOQ", "/boq-construction-guide"],
    ["ผู้รับเหมาและสัญญา", "/choose-contractor-nonthaburi"],
    ["รีโนเวท", "/renovation-budget-guide"],
    ["ตรวจรับงาน", "/construction-payment-inspection-guide"],
  ];
  const navigation = `<nav class="knowledge-template-tabs" aria-label="หมวดหมู่คลังความรู้"><div class="knowledge-template-tabs-inner">${tabs.map(([label, href]) => `<a href="${href}"${href === `/${slug}` ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</div></nav>`;
  const html = isKnowledgePage ? page.html.replace(/(<main\b[^>]*>)/i, `$1${navigation}`) : page.html;
  return <div className={page.bodyClass} data-legacy-page={page.page} data-knowledge-article={isKnowledgeArticle ? "true" : undefined}>
    <LegacyBodyState page={page.page} bodyClass={page.bodyClass} />
    <link rel="stylesheet" href="/legacy/styles.min.css?v=20261013-11" />
    {(page.page === "home" || page.page === "projects") && <link rel="stylesheet" href="/portfolio-reference.css?v=20261013-1" />}
    {!project && <link rel="stylesheet" href="/legacy/service-seo.css?v=20261006-1" />}
    {page.page === "home" && <link rel="stylesheet" href="/legacy/home-facebook-reel.css?v=20261011-1" />}
    {project && <link rel="stylesheet" href="/legacy/project-detail.css?v=20260920" />}
    {includeJsonLd && page.jsonLd.map((value, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: value.replace(/</g, "\\u003c") }} />)}
    {page.styles.map((value, index) => <style key={`style-${index}`} dangerouslySetInnerHTML={{ __html: value }} />)}
    {isKnowledgePage && <link rel="stylesheet" href="/legacy/knowledge-template.css?v=20261015-3" />}
    <div dangerouslySetInnerHTML={{ __html: html }} />
    <LegacyRuntimeScripts sources={project
      ? ["/legacy/site-config.js?v=20260925-1", "/legacy/project-detail.js?v=20260925-2"]
      : ["/legacy/site-config.js?v=20260925-1", "/legacy/site-shell.js?v=20261013-3", "/legacy/app.js?v=20261011-2"]} />
  </div>;
}
