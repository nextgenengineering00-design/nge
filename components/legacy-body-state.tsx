"use client";

import { useEffect } from "react";
import type { SiteLocale } from "@/lib/static-i18n";

export function LegacyBodyState({ page, bodyClass, locale = "th" }: { page: string; bodyClass: string; locale?: SiteLocale }) {
  useEffect(() => {
    const previousPage = document.body.dataset.page;
    const previousLang = document.documentElement.lang;
    const previousLocale = document.documentElement.dataset.ngeLanguage;
    const hadTranslated = document.documentElement.classList.contains("nge-translated");
    const classes = bodyClass.split(/\s+/).filter(Boolean);
    document.body.dataset.page = page;
    document.body.dataset.legacy = "true";
    document.body.classList.add(...classes);
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
    document.documentElement.dataset.ngeLanguage = locale === "zh" ? "zh-CN" : locale;
    document.documentElement.classList.toggle("nge-translated", locale !== "th");

    return () => {
      if (previousPage) document.body.dataset.page = previousPage;
      else delete document.body.dataset.page;
      delete document.body.dataset.legacy;
      document.body.classList.remove(...classes, "menu-open");
      document.documentElement.lang = previousLang || "th";
      if (previousLocale) document.documentElement.dataset.ngeLanguage = previousLocale;
      else delete document.documentElement.dataset.ngeLanguage;
      document.documentElement.classList.toggle("nge-translated", hadTranslated);
    };
  }, [page, bodyClass, locale]);

  return null;
}
