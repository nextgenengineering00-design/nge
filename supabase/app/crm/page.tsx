import type { Metadata } from "next";
import { LegacyCrm } from "@/components/legacy-crm";
export const metadata:Metadata={title:{absolute:"NGE CRM | ระบบดูแลลูกค้า"},robots:{index:false,follow:false}};
export default function Page(){return <LegacyCrm/>}
