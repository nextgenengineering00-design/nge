import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const Input = z.object({
  goal: z.string().min(2).max(120),
  channel: z.string().min(2).max(80),
  contentType: z.string().min(2).max(80),
  funnelStage: z.string().min(2).max(80),
  topic: z.string().min(3).max(300),
  service: z.string().max(180).optional().default(""),
  audience: z.string().max(300).optional().default(""),
  location: z.string().max(150).optional().default("นนทบุรีและปริมณฑล"),
  budget: z.string().max(150).optional().default(""),
  tone: z.string().max(100).optional().default("มืออาชีพ เป็นธรรมชาติ ไม่ขายเกินจริง"),
  proof: z.string().max(1800).optional().default(""),
  offer: z.string().max(500).optional().default(""),
  desiredAction: z.string().max(200).optional().default("ส่งรูป พิกัด และช่วงงบประมาณเพื่อประเมินเบื้องต้น"),
  constraints: z.string().max(800).optional().default(""),
});

const Idea = z.object({ title: z.string(), angle: z.string(), format: z.string() });
const Draft = z.object({
  strategy: z.object({
    goalSummary: z.string(), audience: z.string(), funnelStage: z.string(), customerProblem: z.string(), keyMessage: z.string(), reasonToBelieve: z.string(),
  }),
  postIdeas: z.array(Idea).min(5).max(5),
  primaryPost: z.object({ title: z.string(), hook: z.string(), body: z.string(), cta: z.string(), hashtags: z.array(z.string()).min(4).max(8) }),
  visualPlan: z.object({ concept: z.string(), format: z.string(), shotList: z.array(z.string()).min(3).max(6), overlayText: z.string(), altText: z.string(), avoid: z.string() }),
  seoPlan: z.object({ primaryKeyword: z.string(), secondaryKeywords: z.array(z.string()).min(3).max(6), slug: z.string(), metaDescription: z.string(), internalLinks: z.array(z.string()).min(2).max(4) }),
  leadPlan: z.object({ qualificationQuestions: z.array(z.string()).min(3).max(6), kpis: z.array(z.string()).min(3).max(6), followUp: z.string() }),
  publishingPlan: z.object({ bestTime: z.string(), frequency: z.string(), repurpose: z.array(z.string()).min(2).max(4) }),
});

const stringArray = (minItems: number, maxItems: number) => ({ type: "array", items: { type: "string" }, minItems, maxItems });
const schema = {
  type: "object", additionalProperties: false,
  required: ["strategy", "postIdeas", "primaryPost", "visualPlan", "seoPlan", "leadPlan", "publishingPlan"],
  properties: {
    strategy: { type: "object", additionalProperties: false, required: ["goalSummary", "audience", "funnelStage", "customerProblem", "keyMessage", "reasonToBelieve"], properties: { goalSummary: { type: "string" }, audience: { type: "string" }, funnelStage: { type: "string" }, customerProblem: { type: "string" }, keyMessage: { type: "string" }, reasonToBelieve: { type: "string" } } },
    postIdeas: { type: "array", minItems: 5, maxItems: 5, items: { type: "object", additionalProperties: false, required: ["title", "angle", "format"], properties: { title: { type: "string" }, angle: { type: "string" }, format: { type: "string" } } } },
    primaryPost: { type: "object", additionalProperties: false, required: ["title", "hook", "body", "cta", "hashtags"], properties: { title: { type: "string" }, hook: { type: "string" }, body: { type: "string" }, cta: { type: "string" }, hashtags: stringArray(4, 8) } },
    visualPlan: { type: "object", additionalProperties: false, required: ["concept", "format", "shotList", "overlayText", "altText", "avoid"], properties: { concept: { type: "string" }, format: { type: "string" }, shotList: stringArray(3, 6), overlayText: { type: "string" }, altText: { type: "string" }, avoid: { type: "string" } } },
    seoPlan: { type: "object", additionalProperties: false, required: ["primaryKeyword", "secondaryKeywords", "slug", "metaDescription", "internalLinks"], properties: { primaryKeyword: { type: "string" }, secondaryKeywords: stringArray(3, 6), slug: { type: "string" }, metaDescription: { type: "string" }, internalLinks: stringArray(2, 4) } },
    leadPlan: { type: "object", additionalProperties: false, required: ["qualificationQuestions", "kpis", "followUp"], properties: { qualificationQuestions: stringArray(3, 6), kpis: stringArray(3, 6), followUp: { type: "string" } } },
    publishingPlan: { type: "object", additionalProperties: false, required: ["bestTime", "frequency", "repurpose"], properties: { bestTime: { type: "string" }, frequency: { type: "string" }, repurpose: stringArray(2, 4) } },
  },
} as const;

function demo(i: z.infer<typeof Input>): z.infer<typeof Draft> {
  const service = i.service || i.topic;
  const audience = i.audience || `เจ้าของบ้านหรือเจ้าของกิจการใน${i.location}ที่มีพื้นที่จริงและกำลังเทียบผู้รับเหมา`;
  return {
    strategy: {
      goalSummary: `${i.goal} ผ่านคอนเทนต์ ${i.contentType} บน ${i.channel}`,
      audience,
      funnelStage: i.funnelStage,
      customerProblem: "กลัวงบบาน ขอบเขตไม่ชัด และไม่รู้ว่าจะตรวจผู้รับเหมาอย่างไร",
      keyMessage: `เริ่ม${service}ด้วยการตรวจพื้นที่และแยกขอบเขต ก่อนเทียบราคาและกำหนดงวดงาน`,
      reasonToBelieve: i.proof || "ใช้ภาพหน้างานจริง ขั้นตอนตรวจงาน และเอกสารขอบเขตเป็นหลักฐาน ห้ามแต่งผลงานเพิ่ม",
    },
    postIdeas: [
      { title: `ก่อนเริ่ม${service} ต้องเตรียมอะไรบ้าง`, angle: "เช็กลิสต์ก่อนคุยราคา", format: "ภาพ Carousel 5 หน้า" },
      { title: `ทำไมราคา${service}แต่ละเจ้าจึงต่างกัน`, angle: "อธิบายขอบเขต งานระบบ และวัสดุ", format: "โพสต์ให้ความรู้" },
      { title: `3 จุดที่ควรถ่ายรูปก่อนนัดสำรวจ`, angle: "ช่วยลูกค้าเตรียมข้อมูลให้ประเมินได้เร็ว", format: "Reel 30–45 วินาที" },
      { title: `ตัวอย่างการแบ่งงวดงานที่ตรวจรับได้`, angle: "สร้างความมั่นใจเรื่องเงินและความคืบหน้า", format: "Infographic" },
      { title: `คำถามที่ควรถามผู้รับเหมาก่อนเซ็นสัญญา`, angle: "แก้ความกังวลและคัดกรองลูกค้าที่จริงจัง", format: "FAQ Post" },
    ],
    primaryPost: {
      title: `ก่อนเริ่ม${service}ใน${i.location} อย่าเพิ่งเทียบแค่ยอดรวม`,
      hook: "ราคาที่ต่างกัน อาจไม่ได้แปลว่าใครแพงกว่า แต่อาจกำลังเทียบกันคนละขอบเขต",
      body: `ถ้ากำลังวางแผน${service}ใน${i.location} เริ่มจากเตรียมรูปพื้นที่ พิกัด แบบที่มี และสิ่งที่อยากแก้ให้ครบก่อน\n\nขอให้แยกรายการงานโครงสร้าง งานระบบ งานสถาปัตยกรรม วัสดุ และสิ่งที่ไม่รวมในราคา จากนั้นผูกงวดจ่ายกับผลงานที่ตรวจรับได้จริง${i.budget ? `\n\nช่วงงบประมาณเบื้องต้น: ${i.budget}` : ""}${i.proof ? `\n\nหลักฐานจากหน้างาน: ${i.proof}` : ""}\n\nก่อนตัดสินใจ ควรดูทั้งขอบเขต ระยะเวลา ผู้ควบคุมงาน และเงื่อนไขรับประกัน ไม่ใช่ดูเฉพาะยอดรวม`,
      cta: i.desiredAction || "ส่งรูป พิกัด และช่วงงบประมาณให้ทีม NGE ช่วยเรียงข้อมูลก่อนนัดสำรวจได้ครับ",
      hashtags: ["#รับเหมาก่อสร้างนนทบุรี", "#รีโนเวทบ้าน", "#ผู้รับเหมา", "#ตรวจรับงาน", "#NGE"],
    },
    visualPlan: {
      concept: "ใช้ภาพหน้างานจริงเป็นภาพหลัก เห็นวิศวกรกำลังตรวจรายละเอียด และมีภาพ close-up จุดตรวจประกอบ",
      format: i.channel.includes("TikTok") ? "วิดีโอแนวตั้ง 9:16" : "Carousel 4:5 จำนวน 5 หน้า",
      shotList: ["ภาพกว้างของพื้นที่จริง", "วิศวกรตรวจวัดหรือเช็กแบบ", "รายละเอียดปัญหาก่อนแก้", "ขั้นตอนทำงาน", "ผลลัพธ์หรือเอกสารตรวจรับ"],
      overlayText: `ก่อนเริ่ม${service} เช็ก 4 เรื่องนี้`,
      altText: `ทีมวิศวกร NGE ตรวจพื้นที่สำหรับ${service}ใน${i.location}`,
      avoid: "ไม่ใช้ภาพสต็อก ไม่ใส่ข้อความเกิน 7 คำต่อภาพ และไม่แต่ง Before/After ที่ไม่มีหลักฐานจริง",
    },
    seoPlan: {
      primaryKeyword: `${service} ${i.location}`,
      secondaryKeywords: [`ผู้รับเหมา ${i.location}`, `ประเมินราคา ${service}`, `ตรวจหน้างาน ${i.location}`],
      slug: service.toLowerCase().replace(/\s+/g, "-").slice(0, 60),
      metaDescription: `แนวทางเตรียมข้อมูลก่อนเริ่ม${service}ใน${i.location} พร้อมรายการขอบเขตที่ควรตรวจให้ชัดก่อนตัดสินใจ`,
      internalLinks: ["/services", "/projects", "/contact"],
    },
    leadPlan: {
      qualificationQuestions: ["หน้างานอยู่เขต/จังหวัดใด", "มีรูป พิกัด หรือแบบแล้วหรือยัง", "ต้องการเริ่มงานช่วงไหน", "มีช่วงงบประมาณที่วางไว้หรือไม่"],
      kpis: ["จำนวนลูกค้าที่ให้พิกัดและรูปครบ", "Qualified leads", "นัดสำรวจหน้างาน", "ใบเสนอราคาที่ส่ง", "งานที่ปิดการขาย"],
      followUp: "ตอบภายในเวลาทำการ ขอรูป+พิกัด+ช่วงงบก่อน แล้วบันทึกสถานะใน CRM เพื่อวัดจากนัดสำรวจและงานที่ปิดได้",
    },
    publishingPlan: {
      bestTime: "ทดลองโพสต์ช่วง 11:30–13:00 หรือ 19:00–21:00 แล้วใช้ข้อมูลเพจจริงตัดสิน",
      frequency: "โพสต์หลัก 3 ครั้งต่อสัปดาห์ สลับผลงานจริง ความรู้ และคำถามลูกค้า",
      repurpose: ["ย่อเป็น LINE OA Broadcast", "ทำ Carousel จากหัวข้อย่อย", "ตัดเป็น Reel พร้อมซับ", "ขยายเป็นบทความเว็บไซต์"],
    },
  };
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: "เซสชันผู้ดูแลหมดอายุ กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  const input = Input.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "กรอกเป้าหมาย หัวข้อ ประเภทคอนเทนต์ และขั้นตอนลูกค้าให้ครบ" }, { status: 400 });

  let draft: z.infer<typeof Draft>;
  let mode = "live";
  if (!process.env.OPENAI_API_KEY) {
    draft = demo(input.data);
    mode = "demo";
  } else {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions: "คุณคือ Head of Growth และ Content Strategist ของบริษัทรับเหมาก่อสร้าง Next Gen Engineering ทำแผนที่ลงมือใช้ได้จริงและเน้น qualified lead ไม่ใช่ vanity metrics เขียนภาษาไทยธรรมชาติ ชัดเจน มีรายละเอียดโพสต์ครบ ใช้เฉพาะหลักฐานที่ผู้ใช้ให้ ห้ามสร้างผลงาน รีวิว ราคา ระยะเวลา หรือสถิติปลอม ห้ามอ้างว่าถูกที่สุด ห้ามรับประกันอันดับ Google แยกกลยุทธ์ ไอเดียโพสต์ โพสต์ฉบับเต็ม แผนภาพ SEO การคัดกรองลูกค้า KPI และการนำคอนเทนต์ไปใช้ซ้ำให้ชัดเจน",
      input: JSON.stringify(input.data),
      max_output_tokens: 5000,
      text: { format: { type: "json_schema", name: "nge_marketing_plan", strict: true, schema } },
    });
    draft = Draft.parse(JSON.parse(response.output_text));
  }

  const supabase = getSupabaseAdmin();
  let id: string | undefined;
  if (supabase) {
    const { data, error } = await supabase.from("marketing_content").insert({ channel: input.data.channel, goal: input.data.goal, topic: input.data.topic, location: input.data.location, proof: input.data.proof, draft, status: "draft", ai_mode: mode }).select("id").single();
    if (!error) id = data.id;
  }
  return NextResponse.json({ draft: { ...draft, id, status: "draft" }, mode });
}
