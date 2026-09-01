"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  lines: string[];
  className?: string;
  /** Atraso inicial em segundos. */
  delay?: number;
  /** Intervalo entre linhas (s). */
  stagger?: number;
  as?: "h1" | "h2" | "p" | "span";
  id?: string;
};

/**
 * Revelação de texto linha a linha: cada linha sobe por trás de uma máscara
 * (overflow hidden), 850ms, stagger de 70ms. Em reduced-motion: fade 200ms.
 */
export function TextReveal({
  lines,
  className,
  delay = 0,
  stagger = 0.07,
  as = "span",
  id,
}: Props) {
  const reduced = useReducedMotion();
  const Tag = as;

  return (
    <Tag id={id} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="block overflow-hidden pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            className="block will-change-transform"
            initial={reduced ? { opacity: 0 } : { y: "110%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            transition={
              reduced
                ? { duration: 0.2, delay }
                : { duration: 0.85, delay: delay + i * stagger, ease: EASE }
            }
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
