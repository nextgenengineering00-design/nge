import { readLegacyDocument } from "@/lib/legacy-content";
import { CrmRuntime } from "@/components/crm-runtime";
import { LegacyBodyState } from "@/components/legacy-body-state";

/* eslint-disable @next/next/no-css-tags */

export function LegacyCrm(){
  const page=readLegacyDocument("crm.html");
  return <div className={page.bodyClass}>
    <LegacyBodyState page={page.page} bodyClass={page.bodyClass} />
    <link rel="stylesheet" href="/legacy/crm.css?v=20260925-1" />
    {page.styles.map((value,index)=><style key={index} dangerouslySetInnerHTML={{__html:value}} />)}
    <div dangerouslySetInnerHTML={{__html:page.html}} />
    <CrmRuntime />
  </div>
}
