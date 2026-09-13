"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { scrollToId } from "@/components/motion/smooth-scroll";

/**
 * Botão magnético — porte do MagneticButton (gsap) do CinematicFooter pra
 * framer-motion, que o projeto já carrega (LazyMotion/domAnimation).
 *   - o centro do botão segue o cursor (0.35 do deslocamento) com leve
 *     rotação 3D; ao sair, volta com mola elástica (useSpring)
 *   - só com ponteiro fino e hover real (`(hover: hover) and (pointer: fine)`)
 *     e sem `prefers-reduced-motion` — no touch é um link comum
 *   - href "#id" faz o scroll suave do site (scrollToId), como o StudioButton;
 *     href externo passa direto, com `target`/`rel`/`ariaLabel` opcionais
 */
export function MagneticButton({
  href,
  className,
  children,
  strength = 0.35,
  target,
  rel,
  ariaLabel,
  onClick: onClickProp,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  strength?: number;
  /* o botão também serve pra link externo (o CTA do hero abre o WhatsApp) */
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const active = fine && !reduced;

  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // mola "elástica": pouco amortecimento → passa do ponto e volta, como o elastic.out do original
  const sx = useSpring(x, { stiffness: 170, damping: 11, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 170, damping: 11, mass: 0.7 });
  const rotateX = useTransform(sy, (v) => (-v / strength) * 0.15);
  const rotateY = useTransform(sx, (v) => (v / strength) * 0.15);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClickProp?.(e);
    /* o scroll suave é só pra âncora interna; link externo segue o caminho
       normal do navegador (nova aba, ctrl+clique, botão do meio…) */
    if (href.startsWith("#") && !e.defaultPrevented) {
      e.preventDefault();
      scrollToId(href.slice(1));
    }
  };

  return (
    <m.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy, rotateX, rotateY }}
      whileHover={active ? { scale: 1.05 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "cursor-pointer select-none [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
        className,
      )}
    >
      {children}
    </m.a>
  );
}
