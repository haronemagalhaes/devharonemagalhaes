"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/** Carrega só o pacote `domAnimation` do framer-motion (sem drag/layout). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
