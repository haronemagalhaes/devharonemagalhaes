/**
 * Sistema de movimento — rápido, preciso, discreto.
 * Curva padrão e durações compartilhadas por todos os componentes.
 */
import type { Transition, Variants } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
} as const;

export const VIEWPORT = { once: true, margin: "-15% 0px -15% 0px" } as const;

export const transition = (
  duration: number = DUR.base,
  delay = 0,
): Transition => ({ duration, delay, ease: EASE });

/** Entrada padrão de seção/bloco: opacity 0→1 + translateY 24→0 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: transition(DUR.base, delay),
  }),
};

/** Versão reduzida: só opacity, 200ms. */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
