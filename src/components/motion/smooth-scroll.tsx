"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function headerOffset() {
  const h = document.getElementById("site-header");
  return (h?.offsetHeight ?? 0) + 16;
}

/**
 * Scroll suave até uma âncora, descontando a altura do header.
 * Usa lenis quando disponível; cai para window.scrollTo caso contrário.
 */
export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  if (id === "top") {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const offset = -headerOffset();
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2 });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
}

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
      respectReducedMotion: true,
    });
    lenis = instance;
    return () => {
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
