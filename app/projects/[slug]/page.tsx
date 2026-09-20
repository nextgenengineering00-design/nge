import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/legacy-page";
import { legacyMetadata } from "@/lib/legacy-content";
import { projects } from "@/lib/site-data";
export function generateStaticParams(){return projects.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;if(!projects.some(p=>p.slug===slug))return{};return legacyMetadata(`projects/${slug}.html`,`/projects/${slug}`)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;if(!projects.some(p=>p.slug===slug))notFound();return <LegacyPage file={`projects/${slug}.html`} project/>}
