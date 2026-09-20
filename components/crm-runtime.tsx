"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

declare global {
  interface Window {
    supabase?: { createClient: typeof createClient };
  }
}

export function CrmRuntime() {
  useEffect(() => {
    let cancelled = false;
    const added: HTMLScriptElement[] = [];

    window.supabase = { createClient };

    async function loadScript(src: string) {
      await new Promise<void>((resolve, reject) => {
        const selector = `script[data-nge-runtime="${src}"]`;
        const existing = document.querySelector<HTMLScriptElement>(selector);
        if (existing?.dataset.loaded === "true") return resolve();

        const script = existing || document.createElement("script");
        const done = () => {
          script.dataset.loaded = "true";
          resolve();
        };
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

    async function load() {
      for (const src of ["/legacy/site-config.js", "/legacy/crm.js"]) {
        if (cancelled) return;
        await loadScript(src);
      }
    }

    load().catch((error) => console.error(error));
    return () => {
      cancelled = true;
      added.forEach((script) => script.remove());
    };
  }, []);

  return null;
}
