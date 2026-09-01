"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Eyebrow com numeral de índice: `01 — CAPACIDADES`.
 * O numeral tem parallax leve (~-12px) no range em que a seção rola.
 */
export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [4, -10]);

  return (
    <p ref={ref} className={cn("eyebrow relative flex items-center gap-3", className)}>
      {index && (
        <m.span
          style={reduced ? undefined : { y }}
          className="inline-block tabular-nums"
        >
          {index}
        </m.span>
      )}
      {index && <span aria-hidden>—</span>}
      <span>{children}</span>
    </p>
  );
}
