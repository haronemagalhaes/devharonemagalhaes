"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Fio de 1px que entra com scaleX 0→1 (origem à esquerda). */
export function Rule({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn("h-px w-full origin-left bg-line", className)}
      initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
      whileInView={reduced ? { opacity: 1 } : { scaleX: 1 }}
      viewport={VIEWPORT}
      transition={
        reduced ? { duration: 0.2 } : { duration: 0.5, delay, ease: EASE }
      }
    />
  );
}
