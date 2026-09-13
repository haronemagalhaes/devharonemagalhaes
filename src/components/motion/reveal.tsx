"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { DUR, EASE, VIEWPORT } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Deslocamento inicial em px (padrão 24). */
  y?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "p" | "span";
};

/**
 * Entrada de bloco ao rolar: opacity 0→1 + translateY 24→0, 600ms,
 * viewport once com margem de -15%. Em reduced-motion vira só opacity.
 */
export function Reveal({
  delay = 0,
  y = 24,
  as = "div",
  children,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = m[as] as typeof m.div;

  return (
    <Comp
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={
        reduced
          ? { duration: 0.2 }
          : { duration: DUR.base, delay, ease: EASE }
      }
      {...rest}
    >
      {children}
    </Comp>
  );
}
