import { readLegacyDocument } from "@/lib/legacy-content";
import { LegacyRuntimeScripts } from "@/components/legacy-runtime-scripts";
import { LegacyBodyState } from "@/components/legacy-body-state";

/* eslint-disable @next/next/no-css-tags */

export function LegacyCrm(){
  const page=readLegacyDocument("crm.html");
  return <div className={page.bodyClass}>
    <LegacyBodyState page={page.page} bodyClass={page.bodyClass} />
    <link rel="stylesheet" href="/legacy/crm.css" />
    {page.styles.map((value,index)=><style key={index} dangerouslySetInnerHTML={{__html:value}} />)}
    <div dangerouslySetInnerHTML={{__html:page.html}} />
    <LegacyRuntimeScripts sources={["/legacy/site-config.js","https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.min.js","/legacy/crm.js"]} />
  </div>
}
