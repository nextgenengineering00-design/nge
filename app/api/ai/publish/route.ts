import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request:Request){
  if(!isAdmin(request))return NextResponse.json({error:"รหัสผู้ดูแลไม่ถูกต้อง"},{status:401});
  const body=z.object({id:z.string().uuid()}).safeParse(await request.json().catch(()=>null));if(!body.success)return NextResponse.json({error:"ไม่พบร่าง"},{status:400});
  const supabase=getSupabaseAdmin();if(!supabase)return NextResponse.json({error:"ยังไม่ได้เชื่อม Supabase"},{status:503});
  const {data:item,error}=await supabase.from("marketing_content").select("id,draft,status,channel").eq("id",body.data.id).single();
  if(error||!item)return NextResponse.json({error:"ไม่พบร่าง"},{status:404});if(item.status!=="approved")return NextResponse.json({error:"ต้องอนุมัติก่อนโพสต์"},{status:409});if(item.channel!=="Facebook")return NextResponse.json({error:"ตอนนี้เชื่อมโพสต์อัตโนมัติเฉพาะ Facebook"},{status:422});
  const pageId=process.env.FACEBOOK_PAGE_ID,token=process.env.FACEBOOK_PAGE_ACCESS_TOKEN;if(!pageId||!token)return NextResponse.json({error:"ยังไม่ได้ตั้งค่า Facebook Page ID และ Page Access Token"},{status:503});
  const d=item.draft as {primaryPost?:{hook:string;body:string;cta:string;hashtags:string[]};hook?:string;body?:string;cta?:string;hashtags?:string[]};
  const post=d.primaryPost||{hook:d.hook||"",body:d.body||"",cta:d.cta||"",hashtags:d.hashtags||[]};
  const message=[post.hook,post.body,post.cta,post.hashtags.join(" ")].filter(Boolean).join("\n\n");
  const fb=await fetch(`https://graph.facebook.com/${encodeURIComponent(pageId)}/feed`,{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({message,access_token:token})});const result=await fb.json();
  if(!fb.ok){await supabase.from("marketing_audit_log").insert({content_id:item.id,action:"publish_failed",details:{error:result?.error?.message||"facebook_error"}});return NextResponse.json({error:"Facebook ปฏิเสธการโพสต์ กรุณาตรวจสิทธิ์ Page Token"},{status:502})}
  await supabase.from("marketing_content").update({status:"published",published_at:new Date().toISOString(),external_post_id:result.id}).eq("id",item.id);
  await supabase.from("marketing_audit_log").insert({content_id:item.id,action:"published",details:{external_post_id:result.id}});
  return NextResponse.json({message:"โพสต์ Facebook สำเร็จ",postId:result.id});
}
