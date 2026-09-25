import type { Metadata } from "next";
import { LocalizedSitePage, localizedMetadata, localizedStaticParams } from "@/components/localized-site-page";

export function generateStaticParams() { return localizedStaticParams(); }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  return localizedMetadata(slug, "zh");
}
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  return <LocalizedSitePage parts={slug} locale="zh" />;
}
