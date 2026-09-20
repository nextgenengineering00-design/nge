import type { Metadata } from "next";
import Link from "next/link";
import { MarketingStudio } from "@/components/marketing-studio";
export const metadata:Metadata={title:{absolute:"NGE AI Agent | Digital Marketing"},description:"ระบบ AI Agent หลังบ้านสำหรับวางคอนเทนต์และอนุมัติโพสต์",robots:{index:false,follow:false}};
export default function Page(){return <section className="studio-page"><div className="studio-shell"><div className="studio-top"><div><span className="agent-kicker">NGE INTERNAL SYSTEM</span><h1>NGE AI Agent</h1><p>วางกลยุทธ์ เขียนโพสต์ วางภาพและ SEO เพื่อหาลูกค้าที่มีโอกาสปิดงานจริง</p></div><div className="studio-top-actions"><Link className="studio-badge" href="/crm">ไป NGE CRM</Link></div></div><MarketingStudio/></div></section>}
