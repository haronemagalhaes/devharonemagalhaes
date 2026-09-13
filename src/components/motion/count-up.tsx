"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { EASE, VIEWPORT } from "@/lib/motion";

type Props = {
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
};

/** Numeral que sobe de 0 até `to` ao entrar na viewport. */
export function CountUp({
  to,
  duration = 1.4,
  className,
  prefix = "",
  suffix = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // mesma margem do <Reveal>: o número só começa a contar quando o bloco já está visível
  const inView = useInView(ref, { once: true, margin: VIEWPORT.margin });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {(reduced ? to : value).toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}
