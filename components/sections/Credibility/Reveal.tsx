"use client";

import { useEffect, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Reveal({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    if (!element || reduced || !inView) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = element.getBoundingClientRect();
      if (box.bottom > 0 && box.top < window.innerHeight) {
        element.style.setProperty("--cred-parallax", `${Math.max(-20, Math.min(20, (window.innerHeight / 2 - box.top - box.height / 2) * 0.035))}px`);
      }
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); element.style.removeProperty("--cred-parallax"); };
  }, [inView, reduced, ref]);
  return <div ref={ref} className="nge-cred-shell" data-visible={inView || reduced}>{children}</div>;
}
