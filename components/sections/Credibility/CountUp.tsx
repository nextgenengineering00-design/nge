"use client";

import { useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CountUp({ value, suffix = "+", unit = "" }: { value: number; suffix?: string; unit?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const played = useRef(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || !inView || reduced || played.current) return;
    played.current = true;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1800, 1);
      element.textContent = String(Math.round(value * (progress === 1 ? 1 : 1 - 2 ** (-10 * progress))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      element.textContent = String(value);
    };
  }, [inView, reduced, ref, value]);
  return <span aria-label={`${value}${suffix} ${unit}`}><span aria-hidden="true"><span ref={ref}>{value}</span>{suffix} {unit}</span></span>;
}
