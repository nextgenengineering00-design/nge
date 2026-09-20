"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bot, CheckCircle2, ClipboardList, Copy, Eye, EyeOff, KeyRound, LoaderCircle, LogOut, Search, Send, Sparkles, Target, Users, WandSparkles } from "lucide-react";

type Idea = { title: string; angle: string; format: string };
type Draft = {
  id?: string;
  status?: string;
  strategy: { goalSummary: string; audience: string; funnelStage: string; customerProblem: string; keyMessage: string; reasonToBelieve: string };
  postIdeas: Idea[];
  primaryPost: { title: string; hook: string; body: string; cta: string; hashtags: string[] };
  visualPlan: { concept: string; format: string; shotList: string[]; overlayText: string; altText: string; avoid: string };
  seoPlan: { primaryKeyword: string; secondaryKeywords: string[]; slug: string; metaDescription: string; internalLinks: string[] };
  leadPlan: { qualificationQuestions: string[]; kpis: string[]; followUp: string };
  publishingPlan: { bestTime: string; frequency: string; repurpose: string[] };
};

const goals = [
  ["qualified-leads", "หาลูกค้าพร้อมคุยงาน"], ["booked-surveys", "เพิ่มนัดสำรวจหน้างาน"], ["trust", "สร้างความน่าเชื่อถือ"],
  ["local-seo", "ดัน Local SEO"], ["project-showcase", "โชว์ผลงานจริง"], ["educate", "ให้ความรู้ก่อนตัดสินใจ"],
  ["objection", "แก้ข้อกังวลเรื่องราคา/ผู้รับเหมา"], ["remarketing", "ตามลูกค้าที่เคยทัก"], ["referral", "ขอรีวิวและการบอกต่อ"],
];

const channels = ["Facebook", "Google Business Profile", "บทความเว็บไซต์", "LINE OA", "TikTok / Reels"];

export function MarketingStudio() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("post");

  useEffect(() => {
    fetch("/api/ai/session", { cache: "no-store" }).then((res) => res.json()).then((json) => {
      setAuthenticated(Boolean(json.authenticated));
      setConfigured(Boolean(json.configured));
    }).catch(() => setAuthenticated(false));
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice("");
    const res = await fetch("/api/ai/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
    const json = await res.json(); setBusy(false);
    if (!res.ok) return setNotice(json.error || "เข้าสู่ระบบไม่สำเร็จ");
    setAuthenticated(true); setToken(""); setNotice(json.message);
  }

  async function logout() {
    await fetch("/api/ai/session", { method: "DELETE" });
    setAuthenticated(false); setDraft(null); setNotice("");
  }

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice("");
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const res = await fetch("/api/ai/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setBusy(false);
    if (res.status === 401) { setAuthenticated(false); return setNotice("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่"); }
    if (!res.ok) return setNotice(json.error || "สร้างแผนไม่สำเร็จ");
    setDraft(json.draft); setActiveTab("post");
    setNotice(json.mode === "demo" ? "โหมดตัวอย่าง: โครงสร้างใช้งานได้แล้ว ใส่ OPENAI_API_KEY เพื่อให้ AI เขียนตามโจทย์จริง" : "AI สร้างแผนและโพสต์ฉบับเต็มแล้ว กรุณาตรวจหลักฐานก่อนอนุมัติ");
  }

  async function action(kind: "approve" | "publish") {
    if (!draft?.id) return setNotice("ยังไม่ได้เชื่อม Supabase จึงคัดลอกได้ แต่ยังอนุมัติ/โพสต์อัตโนมัติไม่ได้");
    setBusy(true); setNotice("");
    const res = await fetch(`/api/ai/${kind}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: draft.id }) });
    const json = await res.json(); setBusy(false); setNotice(json.message || json.error);
    if (res.ok) setDraft({ ...draft, status: kind === "approve" ? "approved" : "published" });
  }

  const postText = useMemo(() => draft ? `${draft.primaryPost.hook}\n\n${draft.primaryPost.body}\n\n${draft.primaryPost.cta}\n\n${draft.primaryPost.hashtags.join(" ")}` : "", [draft]);
  const fullPlan = useMemo(() => draft ? [
    `เป้าหมาย: ${draft.strategy.goalSummary}`, `กลุ่มลูกค้า: ${draft.strategy.audience}`, `สารหลัก: ${draft.strategy.keyMessage}`,
    `\nหัวข้อ: ${draft.primaryPost.title}`, postText,
    `\nภาพ: ${draft.visualPlan.concept}`, `รูปแบบ: ${draft.visualPlan.format}`, `ช็อตที่ต้องมี:\n- ${draft.visualPlan.shotList.join("\n- ")}`,
    `\nSEO: ${draft.seoPlan.primaryKeyword}`, `คำถามคัดกรอง:\n- ${draft.leadPlan.qualificationQuestions.join("\n- ")}`,
    `KPI:\n- ${draft.leadPlan.kpis.join("\n- ")}`,
  ].join("\n") : "", [draft, postText]);

  if (authenticated === null) return <div className="agent-loading"><LoaderCircle className="spin" /><p>กำลังตรวจสอบสิทธิ์ผู้ดูแล…</p></div>;

  if (!authenticated) return <section className="agent-login panel">
    <div className="login-mascot"><Image src="/brand/nge-ai-engineer.png" width={150} height={150} alt="NGE AI Engineer" /></div>
    <span className="agent-kicker"><KeyRound size={16} /> ADMIN ACCESS</span>
    <h2>เข้าสู่ระบบ NGE AI Agent</h2>
    <p>รหัสนี้เจ้าของเว็บไซต์เป็นคนตั้งเองในตัวแปร <code>AI_ADMIN_TOKEN</code> ไม่ใช่ OpenAI API Key</p>
    <form onSubmit={login}>
      <label>รหัสผู้ดูแล
        <span className="password-field"><input autoFocus type={showToken ? "text" : "password"} value={token} onChange={(event) => setToken(event.target.value)} placeholder="วาง AI_ADMIN_TOKEN" /><button type="button" onClick={() => setShowToken(!showToken)} aria-label="แสดงหรือซ่อนรหัส">{showToken ? <EyeOff /> : <Eye />}</button></span>
      </label>
      <button className="primary-action" disabled={busy || !token}>{busy ? <LoaderCircle className="spin" /> : <KeyRound />} เข้าสู่ระบบ</button>
    </form>
    {!configured && <p className="studio-notice error">ยังไม่ได้ตั้งค่า AI_ADMIN_TOKEN ที่ฝั่งเซิร์ฟเวอร์</p>}
    {notice && <p className="studio-notice error">{notice}</p>}
    <div className="token-help"><b>ตั้งรหัสที่ไหน</b><ol><li>เครื่องนี้: ไฟล์ <code>.env.local</code></li><li>ตอนขึ้นเว็บจริง: Environment Variables ของ Cloudflare/Vercel</li><li>ตั้งแล้วต้อง Restart หรือ Deploy ใหม่</li></ol></div>
  </section>;

  return <>
    <div className="agent-session"><span><i /> ผู้ดูแลเข้าสู่ระบบแล้ว · เซสชัน 8 ชั่วโมง</span><button onClick={logout}><LogOut size={15} /> ออกจากระบบ</button></div>
    <div className="studio-grid">
      <section className="studio-control panel">
        <div className="studio-mascot"><Image src="/brand/nge-ai-engineer.png" width={118} height={118} alt="น้องเอ็นจิ AI Marketing Agent" /><div><span><Bot size={16} /> NGE GROWTH AGENT</span><h2>สร้างแผนที่พร้อมใช้จริง</h2><p>ได้ทั้งเป้าหมาย ไอเดียโพสต์ โพสต์ฉบับเต็ม แผนภาพ SEO คำถามคัดกรอง และ KPI</p></div></div>
        <form onSubmit={generate} className="studio-form">
          <div className="form-section"><span><Target /> 1. เป้าหมายและช่องทาง</span>
            <div className="form-grid two"><label>เป้าหมายหลัก<select name="goal" defaultValue="qualified-leads">{goals.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>ช่องทาง<select name="channel">{channels.map((channel) => <option key={channel}>{channel}</option>)}</select></label></div>
            <div className="form-grid two"><label>ประเภทคอนเทนต์<select name="contentType"><option>โพสต์ขายแบบให้ความรู้</option><option>ผลงาน Before / After</option><option>กรณีศึกษาโครงการ</option><option>FAQ ตอบข้อกังวล</option><option>Carousel เช็กลิสต์</option><option>วิดีโอสั้น / Reel</option><option>บทความ SEO</option><option>โปรโมชัน / ข้อเสนอ</option></select></label><label>ขั้นตอนของลูกค้า<select name="funnelStage"><option>ยังไม่รู้จักแบรนด์</option><option>กำลังหาข้อมูล</option><option>กำลังเทียบผู้รับเหมา</option><option>พร้อมนัดสำรวจ</option><option>เคยทักแต่ยังไม่ตัดสินใจ</option><option>ลูกค้าเก่า / ขอรีวิว</option></select></label></div>
          </div>
          <div className="form-section"><span><Users /> 2. ลูกค้าและโจทย์งาน</span>
            <label>หัวข้อหรือหน้างานที่อยากสื่อสาร<input name="topic" required placeholder="เช่น รีโนเวทบ้านเก่า 2 ชั้น แก้รั่วและปรับพื้นที่" /></label>
            <div className="form-grid two"><label>บริการ<input name="service" placeholder="รีโนเวท / สร้างบ้าน / งานโยธา" /></label><label>พื้นที่เป้าหมาย<input name="location" defaultValue="นนทบุรีและปริมณฑล" /></label></div>
            <label>กลุ่มลูกค้าเป้าหมาย<textarea name="audience" rows={2} placeholder="เช่น เจ้าของบ้านอายุ 35–55 ปี มีบ้านเดิมและต้องการเริ่มงานใน 3 เดือน" /></label>
            <div className="form-grid two"><label>ช่วงงบ/ขนาดงาน<input name="budget" placeholder="เช่น 800,000–1,500,000 บาท" /></label><label>โทนภาษา<select name="tone"><option>มืออาชีพ เป็นธรรมชาติ</option><option>จริงใจ เข้าใจง่าย</option><option>ผู้เชี่ยวชาญ เชิงเทคนิค</option><option>เป็นกันเอง กระชับ</option><option>พรีเมียม น่าเชื่อถือ</option></select></label></div>
          </div>
          <div className="form-section"><span><ClipboardList /> 3. หลักฐานและข้อเสนอ</span>
            <label>หลักฐานจริงที่ใช้ได้<textarea name="proof" rows={3} placeholder="รูปก่อน-หลัง ขนาดงาน ระยะเวลา ปัญหาที่แก้ ขั้นตอนตรวจงาน รีวิวจริง" /></label>
            <label>ข้อเสนอหรือจุดเด่น<textarea name="offer" rows={2} placeholder="เช่น ช่วยตรวจข้อมูลและเรียงขอบเขตก่อนนัดสำรวจ" /></label>
            <label>อยากให้ลูกค้าทำอะไรต่อ<input name="desiredAction" defaultValue="ส่งรูป พิกัด และช่วงงบประมาณเพื่อประเมินเบื้องต้น" /></label>
            <label>ข้อห้าม/ข้อมูลเพิ่มเติม<textarea name="constraints" rows={2} placeholder="เช่น ห้ามระบุราคาแน่นอน ห้ามใช้คำว่าถูกที่สุด" /></label>
          </div>
          <button className="generate-button" disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <WandSparkles />} สร้างแผนการตลาดและโพสต์ฉบับเต็ม</button>
        </form>
        {notice && <p className="studio-notice">{notice}</p>}
      </section>

      <section className="draft-panel panel">
        {!draft ? <div className="empty-draft"><Sparkles /><h2>ผลลัพธ์จะแยกเป็นหมวดชัดเจน</h2><p>โพสต์ฉบับเต็ม · 5 ไอเดียต่อยอด · ภาพที่ต้องถ่าย · SEO · คัดกรองลูกค้า · KPI</p></div> : <>
          <div className="draft-head"><div><span className={`status ${draft.status || "draft"}`}>{draft.status || "draft"}</span><small>{draft.strategy.goalSummary}</small></div><div className="draft-actions"><button onClick={() => navigator.clipboard.writeText(postText)}><Copy /> คัดลอกโพสต์</button><button onClick={() => navigator.clipboard.writeText(fullPlan)}><Copy /> คัดลอกทั้งหมด</button></div></div>
          <nav className="result-tabs" aria-label="หมวดผลลัพธ์">{[["post", "โพสต์"], ["ideas", "ไอเดีย"], ["visual", "ภาพ"], ["seo", "SEO"], ["leads", "ลูกค้า/KPI"]].map(([key, label]) => <button key={key} className={activeTab === key ? "active" : ""} onClick={() => setActiveTab(key)}>{label}</button>)}</nav>

          {activeTab === "post" && <div className="result-section"><div className="strategy-cards"><article><Target /><b>สารหลัก</b><p>{draft.strategy.keyMessage}</p></article><article><Users /><b>กลุ่มลูกค้า</b><p>{draft.strategy.audience}</p></article></div><span className="result-label">หัวข้อโพสต์</span><h2>{draft.primaryPost.title}</h2><div className="post-preview"><h3>{draft.primaryPost.hook}</h3><p>{draft.primaryPost.body}</p><blockquote>{draft.primaryPost.cta}</blockquote><div className="hashtags">{draft.primaryPost.hashtags.join(" ")}</div></div><div className="proof-note"><b>เหตุผลที่ลูกค้าควรเชื่อ</b><p>{draft.strategy.reasonToBelieve}</p></div></div>}

          {activeTab === "ideas" && <div className="result-section"><span className="result-label">5 หัวข้อสำหรับทำต่อ</span><div className="idea-list">{draft.postIdeas.map((idea, index) => <article key={idea.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{idea.title}</h3><p>{idea.angle}</p><small>{idea.format}</small></div></article>)}</div><div className="plan-box"><b>แผนเผยแพร่</b><p>{draft.publishingPlan.frequency}</p><p>{draft.publishingPlan.bestTime}</p><ul>{draft.publishingPlan.repurpose.map((item) => <li key={item}>{item}</li>)}</ul></div></div>}

          {activeTab === "visual" && <div className="result-section"><span className="result-label">ภาพและวิดีโอที่ควรใช้</span><h2>{draft.visualPlan.concept}</h2><div className="visual-spec"><b>รูปแบบ</b><p>{draft.visualPlan.format}</p><b>ข้อความบนภาพ</b><p>{draft.visualPlan.overlayText}</p></div><h3>ช็อตที่ต้องถ่าย</h3><ol className="check-list">{draft.visualPlan.shotList.map((shot) => <li key={shot}>{shot}</li>)}</ol><div className="alt-box"><b>Alt text</b><p>{draft.visualPlan.altText}</p></div><div className="warning-box"><b>สิ่งที่ควรเลี่ยง</b><p>{draft.visualPlan.avoid}</p></div></div>}

          {activeTab === "seo" && <div className="result-section"><span className="result-label"><Search /> SEO PLAN</span><h2>{draft.seoPlan.primaryKeyword}</h2><div className="keyword-list">{draft.seoPlan.secondaryKeywords.map((word) => <span key={word}>{word}</span>)}</div><div className="seo-details"><b>URL Slug</b><code>/{draft.seoPlan.slug}</code><b>Meta description</b><p>{draft.seoPlan.metaDescription}</p><b>ลิงก์ภายในที่ควรใส่</b><p>{draft.seoPlan.internalLinks.join(" · ")}</p></div></div>}

          {activeTab === "leads" && <div className="result-section"><span className="result-label">คัดกรองและวัดผล</span><div className="lead-columns"><div><h3>คำถามคัดกรองลูกค้า</h3><ol className="check-list">{draft.leadPlan.qualificationQuestions.map((question) => <li key={question}>{question}</li>)}</ol></div><div><h3>KPI ที่ต้องดู</h3><ol className="check-list">{draft.leadPlan.kpis.map((kpi) => <li key={kpi}>{kpi}</li>)}</ol></div></div><div className="plan-box"><b>วิธี Follow-up</b><p>{draft.leadPlan.followUp}</p></div></div>}

          <div className="approval-bar"><button className="approve" disabled={busy || draft.status === "approved" || draft.status === "published"} onClick={() => action("approve")}><CheckCircle2 /> อนุมัติ</button><button className="publish" disabled={busy || draft.status !== "approved"} onClick={() => action("publish")}><Send /> โพสต์ Facebook</button></div>
          <small className="safety-note">AI ทำร่างและแผนให้ แต่จะไม่โพสต์จนกว่าผู้ดูแลตรวจหลักฐานและกดอนุมัติ</small>
        </>}
      </section>
    </div>
  </>;
}
