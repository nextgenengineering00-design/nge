"use client";

import { useEffect } from "react";

export function LegacyRuntimeScripts({ sources }: { sources: string[] }) {
  useEffect(() => {
    let cancelled = false;
    const added: HTMLScriptElement[] = [];
    async function load() {
      for (const src of sources) {
        if (cancelled) return;
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector<HTMLScriptElement>(`script[data-nge-runtime="${src}"]`);
          if (existing?.dataset.loaded === "true") return resolve();
          const script = existing || document.createElement("script");
          const done = () => { script.dataset.loaded = "true"; resolve(); };
          script.addEventListener("load", done, { once: true });
          script.addEventListener("error", () => reject(new Error(`Unable to load ${src}`)), { once: true });
          if (!existing) {
            script.src = src;
            script.async = false;
            script.dataset.ngeRuntime = src;
            document.body.appendChild(script);
            added.push(script);
          }
        });
      }
    }
    load().catch(error => console.error(error));
    return () => { cancelled = true; added.forEach(script => script.remove()); };
  }, [sources]);
  return null;
}
