"use client";

import { useEffect } from "react";
export function useHtmlModalOpen(open: boolean) {
  useEffect(() => {
    const el = document.documentElement;
    if (!el) return;

    if (open) {
      el.classList.add("modal-open");
    } else {
      el.classList.remove("modal-open");
    }
    return () => el.classList.remove("modal-open");
  }, [open]);
}
