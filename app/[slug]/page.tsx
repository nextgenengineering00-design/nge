import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/legacy-page";
import { legacyMetadata, legacySlugs } from "@/lib/legacy-content";
import { LocalAreaPage } from "@/components/local-area-page";
import { isLocalAreaSlug, localAreas } from "@/lib/local-area-data";
import { absoluteUrl } from "@/lib/site-data";

export function generateStaticParams(){return legacySlugs.map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  if(isLocalAreaSlug(slug)){
    const page=localAreas[slug];
    return {
      title:{absolute:page.title},description:page.description,alternates:{canonical:`/${slug}`},
      openGraph:{type:"website",locale:"th_TH",url:`/${slug}`,title:page.title,description:page.description,images:[{url:page.image,alt:page.imageAlt}]},
      twitter:{card:"summary_large_image",title:page.title,description:page.description,images:[absoluteUrl(page.image)]},
    };
  }
  if(!legacySlugs.includes(slug as typeof legacySlugs[number]))return{};
  return legacyMetadata(`${slug}.html`,`/${slug}`);
}
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(isLocalAreaSlug(slug))return <LocalAreaPage slug={slug}/>;if(!legacySlugs.includes(slug as typeof legacySlugs[number]))notFound();return <LegacyPage file={`${slug}.html`}/>}
