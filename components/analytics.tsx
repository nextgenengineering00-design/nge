"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function Analytics(){
  const ga=process.env.NEXT_PUBLIC_GA_ID;
  const pixel=process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [consent,setConsent]=useState<"yes"|"no"|null>(null);
  useEffect(()=>{const frame=requestAnimationFrame(()=>setConsent(localStorage.getItem("nge-analytics-consent") as "yes"|"no"|null));return()=>cancelAnimationFrame(frame)},[]);
  function choose(value:"yes"|"no"){localStorage.setItem("nge-analytics-consent",value);setConsent(value)}
  return <>
    {consent==="yes"&&ga&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive"/><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script></>}
    {consent==="yes"&&pixel&&<Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}</Script>}
    {consent===null&&(ga||pixel)&&<div className="consent-banner"><p><b>ขออนุญาตเก็บข้อมูลการใช้งาน</b><span>เพื่อวัดผลว่าหน้าไหนช่วยให้ลูกค้าติดต่อเรา โดยไม่ขายข้อมูลส่วนตัว</span></p><button onClick={()=>choose("no")}>ไม่อนุญาต</button><button className="accept" onClick={()=>choose("yes")}>อนุญาต</button></div>}
  </>;
}
