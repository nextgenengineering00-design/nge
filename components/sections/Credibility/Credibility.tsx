import Image from "next/image";
import { StatCard, type CredibilityStat } from "./StatCard";
import { Reveal } from "./Reveal";
import "./credibility.css";

export const credibilityStats: CredibilityStat[] = [
  { id: "registered", icon: "calendar", value: "5 พ.ย. 2528", label: "วันที่จดทะเบียนเกิดการ" },
  { id: "experience", icon: "institution", value: 40, suffix: "+", unit: "ปี", label: "ประสบการณ์งานก่อสร้าง", countUp: true },
  { id: "projects", icon: "handshake", value: 300, suffix: "+", unit: "ผลงาน", label: "ผลงานก่อสร้างและปรับปรุง", countUp: true, wide: true },
];

export function Credibility({ stats = credibilityStats, image = "/images/credibility-construction.webp" }: { stats?: CredibilityStat[]; image?: string }) {
  return <section className="nge-cred" aria-labelledby="nge-cred-title">
    <Reveal>
      <div className="nge-cred-banner">
        <div className="nge-cred-photo" aria-hidden="true"><Image src={image} alt="" fill sizes="(max-width: 960px) 100vw, 960px" /></div>
        <div className="nge-cred-heading">
          <p className="nge-cred-eyebrow"><span />VERIFIABLE EXPERIENCE<span /></p>
          <h2 id="nge-cred-title"><span>ความ</span><em>น่าเชื่อถือ</em></h2>
        </div>
      </div>
      <div className="nge-cred-grid">{stats.map((stat, index) => <StatCard key={stat.id} stat={stat} index={index} />)}</div>
    </Reveal>
  </section>;
}
