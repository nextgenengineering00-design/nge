import type { Metadata } from "next";
import { HouseCatalogue } from "@/components/house-catalogue";
import { HouseInquiry } from "@/components/house-inquiry";
import { HouseShell } from "@/components/house-shell";
export const metadata:Metadata={title:"ค้นหาแบบบ้าน Modern Tropical, Classic และ Loft",description:"เลือกแบบบ้าน NGE ดูพื้นที่ใช้สอย ห้องนอน ห้องน้ำ และรายละเอียดแต่ละแบบ พร้อมปรึกษางบประมาณก่อสร้าง",alternates:{canonical:"/house-designs"},openGraph:{url:"/house-designs",title:"ค้นหาแบบบ้าน | NGE",images:["/assets/house-designs/wisteria.webp"]}};
export default function Page(){return <HouseShell><HouseCatalogue standalone/><HouseInquiry/></HouseShell>;}
