"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HouseInquiry({houseName="ยังไม่ได้เลือกแบบบ้าน"}:{houseName?:string}) {
  const [status,setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");
  const [error,setError] = useState("");
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); if(status==="sending")return;
    const form=event.currentTarget; const values=Object.fromEntries(new FormData(form).entries());
    setStatus("sending");setError("");
    try {
      const response=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:values.name,phone:String(values.phone).replace(/[\s-]/g,""),location:values.location,budget:values.budget,service:"สร้างบ้าน/อาคาร",message:`แบบบ้านที่สนใจ: ${houseName}\n${values.message || ""}`,privacy_consent:values.privacy_consent==="on",consent_version:"2026-09",page_path:window.location.pathname,website:values.website})});
      if(!response.ok){const result=await response.json().catch(()=>({}));throw new Error(result.error || "ส่งข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง");}
      setStatus("success");form.reset();
      const w=window as typeof window & {gtag?:(...args:unknown[])=>void};w.gtag?.("event","generate_lead",{form_source:"house-designs",house_name:houseName});
    }catch(e){setStatus("error");setError(e instanceof Error?e.message:"เชื่อมต่อไม่สำเร็จ กรุณาลองอีกครั้ง");}
  }
  return <section id="budget-consult" className="hc-inquiry hc-scope"><div className="hc-container hc-inquiry-layout">
    {status==="success"?<div className="hc-form-success" role="status"><CheckCircle2 size={40}/><h3>ได้รับข้อมูลเรียบร้อยแล้ว</h3><p>ทีมงานจะติดต่อกลับเพื่อพูดคุยรายละเอียดโครงการครับ</p></div>:<form className="hc-form" onSubmit={submit}><header className="hc-form-head"><h2>ลงทะเบียนเพื่อรับข้อมูลเพิ่มเติม</h2><p>กรอกข้อมูลของคุณในแบบฟอร์มด้านล่าง ทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด</p><small>แบบบ้านที่สนใจ: {houseName}</small></header><input className="hc-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/><div className="hc-form-grid"><label>ชื่อผู้ติดต่อ *<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="ชื่อของคุณ"/></label><label>เบอร์โทรศัพท์ *<input name="phone" required type="tel" pattern="(0[0-9]{8,9}|\+66[0-9]{8,9})" maxLength={13} autoComplete="tel" placeholder="เบอร์โทรติดต่อกลับ"/></label><label>พื้นที่ก่อสร้าง *<input name="location" required minLength={2} maxLength={180} placeholder="อำเภอ / จังหวัด"/></label><label>งบประมาณที่วางไว้<select name="budget" defaultValue="3–5 ล้านบาท"><option>3–5 ล้านบาท</option><option>5–7 ล้านบาท</option><option>7–10 ล้านบาท</option><option>มากกว่า 10 ล้านบาท</option><option>ขอคำแนะนำเรื่องงบประมาณ</option></select></label></div><label>รายละเอียดเพิ่มเติม<textarea name="message" rows={3} maxLength={1200} placeholder="ขนาดที่ดิน จำนวนสมาชิก หรือช่วงเวลาที่อยากเริ่มสร้าง"/></label><label className="hc-consent"><input type="checkbox" name="privacy_consent" required/><span>ยินยอมให้ติดต่อกลับเรื่องโครงการ ตาม <a href="/privacy" target="_blank" rel="noopener noreferrer">นโยบายความเป็นส่วนตัว</a></span></label><button className="hc-button" type="submit" disabled={status==="sending"}>{status==="sending"?"กำลังส่งข้อมูล…":"ส่งข้อมูลให้ทีมงาน"}<ArrowRight size={18}/></button>{status==="error"&&<p role="alert" className="hc-error">{error} หรือติดต่อ 098-279-9145</p>}</form>}
  </div></section>;
}
