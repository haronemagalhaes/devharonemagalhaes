"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Arc } from "@/components/site/arc";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import HM from "@/assets/hm-selo.png";

/*
 * Selo do hero: os arcos concêntricos (estáticos, como sempre) + um anel de
 * texto girando entre o 3º e o 4º arco + o monograma HM parado no centro.
 * Tudo na mesma caixa/viewBox do <Arc>, então o selo fica concêntrico aos
 * arcos em qualquer tamanho.
 *
 *   anel de texto ... 36s/volta, linear (acelera até ~2× enquanto rola)
 *   HM .............. estático — a contra-rotação (90s) foi testada e o
 *                     monograma parecia torto em qualquer frame
 *   parallax ........ o grupo sobe 40px ao longo do hero
 *
 * reduced-motion → tudo estático. < lg → só os arcos (o selo some).
 */
const SIZE = 1000; // viewBox do <Arc>
const RING_R = 290; // arcos em r ≈ 249 e 332 (6 anéis)
const RING_C = 2 * Math.PI * RING_R;
const RING_TEXT = "HARONE MAGALHÃES · ESTÚDIO DE SOFTWARE · ARACAJU · ".repeat(3);
const RING_PATH = `M ${SIZE / 2} ${SIZE / 2 - RING_R} a ${RING_R} ${RING_R} 0 1 1 0 ${RING_R * 2} a ${RING_R} ${RING_R} 0 1 1 0 ${-RING_R * 2}`;

const RING_SECONDS = 36;

export function HeroSeal({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const sealRef = useRef<HTMLDivElement>(null);
  // false enquanto o selo está `display:none` (< lg) ou fora da viewport
  const inView = useInView(sealRef);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 720], [0, -40]);

  // velocidade do scroll → multiplicador da rotação do anel (1× parado, ~2× rolando)
  const velocity = useVelocity(scrollY);
  const boost = useSpring(useTransform(velocity, [-1500, 0, 1500], [2, 1, 2]), {
    stiffness: 80,
    damping: 20,
  });

  const ringRotate = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (reduced || !inView) return;
    const step = (delta / (RING_SECONDS * 1000)) * 360 * boost.get();
    ringRotate.set((ringRotate.get() + step) % 360);
  });

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 -translate-y-1/2 select-none",
        className,
      )}
    >
      <m.div style={reduced ? undefined : { y }} className="relative">
        {/* 1. arcos — intocados */}
        <div className="hero-arc">
          <Arc rings={6} className="h-auto w-full" />
        </div>

        {/* 2 + 3. selo — só no desktop */}
        <div
          ref={sealRef}
          className="hero-fade absolute inset-0 hidden lg:block"
          style={{ "--d": "0.9s" } as CSSProperties}
        >
          <m.svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="absolute inset-0 h-full w-full"
            style={reduced ? undefined : { rotate: ringRotate }}
            fill="none"
          >
            <defs>
              <path id="hero-seal-ring" d={RING_PATH} />
            </defs>
            <text
              className="font-sans"
              fontSize={16}
              fontWeight={500}
              fill="var(--ink-soft)"
              opacity={0.5}
              dy="0.36em"
              style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              <textPath href="#hero-seal-ring" textLength={RING_C} lengthAdjust="spacing">
                {RING_TEXT}
              </textPath>
            </text>
          </m.svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={HM}
              alt=""
              sizes="(min-width: 1024px) 9vw, 0px"
              className="h-auto w-[17%] opacity-90"
            />
          </div>
        </div>
      </m.div>
    </div>
  );
}
