"use client";

import { useEffect } from "react";

/**
 * Sticky pra elemento MAIS ALTO que a viewport. `sticky; top: 0` deixa o
 * rodapé do elemento escondido pra sempre; `bottom: 0` não segura o
 * elemento quando ele sai por cima. A solução é `top: calc(100svh − altura)`
 * (negativo quando a capa passa da viewport): o elemento rola até o rodapé
 * dele encostar no fim da viewport e só então gruda. Quando cabe, top = 0.
 * Recalcula em resize (ResizeObserver no elemento + resize da janela).
 */
export function StickyFit({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const apply = () => {
      const h = el.getBoundingClientRect().height;
      el.style.top = `min(0px, calc(100svh - ${Math.ceil(h)}px))`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      el.style.top = "";
    };
  }, [targetId]);
  return null;
}
