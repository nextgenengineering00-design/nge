import { CalendarDays, Landmark, Handshake } from "lucide-react";
import type { CSSProperties } from "react";
import { CountUp } from "./CountUp";

export type CredibilityStat = {
  id: string;
  icon: "calendar" | "institution" | "handshake";
  value: string | number;
  suffix?: string;
  unit?: string;
  label: string;
  countUp?: boolean;
  wide?: boolean;
};
const icons = { calendar: CalendarDays, institution: Landmark, handshake: Handshake };

export function StatCard({ stat, index }: { stat: CredibilityStat; index: number }) {
  const Icon = icons[stat.icon];
  return <div className={`nge-cred-card${stat.wide ? " nge-cred-wide" : ""}`} style={{ "--i": index } as CSSProperties}>
    <div className="nge-cred-card-inner">
      <span className="nge-cred-icon" aria-hidden="true"><Icon size={34} strokeWidth={1.5} /></span>
      <div className="nge-cred-stat">
        <strong className={stat.countUp ? "nge-cred-value" : "nge-cred-value nge-cred-date"}>
          {stat.countUp && typeof stat.value === "number" ? <CountUp value={stat.value} suffix={stat.suffix} unit={stat.unit} /> : stat.value}
        </strong>
        <span className="nge-cred-underline" aria-hidden="true" />
        <p>{stat.label}</p>
      </div>
    </div>
  </div>;
}
