"use client";

import { useEffect } from "react";

export function LegacyBodyState({ page, bodyClass }: { page: string; bodyClass: string }) {
  useEffect(() => {
    const previousPage = document.body.dataset.page;
    const classes = bodyClass.split(/\s+/).filter(Boolean);
    document.body.dataset.page = page;
    document.body.dataset.legacy = "true";
    document.body.classList.add(...classes);

    return () => {
      if (previousPage) document.body.dataset.page = previousPage;
      else delete document.body.dataset.page;
      delete document.body.dataset.legacy;
      document.body.classList.remove(...classes, "menu-open");
    };
  }, [page, bodyClass]);

  return null;
}
