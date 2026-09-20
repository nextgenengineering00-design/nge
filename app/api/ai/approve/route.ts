import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request:Request){if(!isAdmin(request))return NextResponse.json({error:"รหัสผู้ดูแลไม่ถูกต้อง"},{status:401});const body=z.object({id:z.string().uuid()}).safeParse(await request.json().catch(()=>null));if(!body.success)return NextResponse.json({error:"ไม่พบร่าง"},{status:400});const supabase=getSupabaseAdmin();if(!supabase)return NextResponse.json({error:"ยังไม่ได้เชื่อม Supabase"},{status:503});const {error}=await supabase.from("marketing_content").update({status:"approved",approved_at:new Date().toISOString()}).eq("id",body.data.id).eq("status","draft");if(error)return NextResponse.json({error:"อนุมัติไม่สำเร็จ"},{status:500});return NextResponse.json({message:"อนุมัติแล้ว พร้อมโพสต์"})}
