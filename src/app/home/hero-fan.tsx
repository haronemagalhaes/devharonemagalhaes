"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Foto from "@/assets/eu.jpeg";

/*
 * Leque de três cartões abaixo do CTA da capa 1 — formato do Hero10
 * (21st.dev), sem as dependências dele: `motion` → framer-motion (já no
 * projeto), `react-wrap-balancer` → `text-balance` nativo, Slot/CVA já vêm
 * com o Button do shadcn, e o `Cta` que faltava é o MagneticButton do hero.
 *
 *   1 (esquerda, −6°)  monograma HM (public/favicon.png, o único com fundo
 *                       transparente) — object-contain, respiro de 24%,
 *                       fundo de papel; no escuro é invertido
 *   2 (centro, 0°)     foto do Harone (src/assets/eu.jpeg, a mesma do
 *                       "Quem faz"), retrato 4:5 sem corte relevante
 *   3 (direita, +6°)   print provisório — TODO: trocar (hoje psinaiade.png)
 *
 * Identidade: raio 8px como os outros cards, contorno em --line (nada de
 * preto/branco cru), sombra derivada de --ink. Decorativo: aria-hidden.
 * Entrada: whileInView once com stagger — dispara no carregamento porque a
 * capa 1 já nasce visível; com reduced-motion renderiza no estado final.
 */
type Card = { kind: "logo" | "photo" | "print"; rotate: number; y: number };

const CARDS: Card[] = [
  { kind: "logo", rotate: -6, y: 14 },
  { kind: "photo", rotate: 0, y: 0 },
  { kind: "print", rotate: 6, y: 14 },
];

const CARD =
  "relative aspect-[4/5] w-[104px] shrink-0 overflow-hidden rounded-[8px] bg-surface ring-1 ring-line shadow-[0_24px_48px_-28px_color-mix(in_oklch,var(--ink)_45%,transparent)] sm:w-[140px] md:w-[172px] lg:w-[196px]";

function CardContent({ kind }: { kind: Card["kind"] }) {
  if (kind === "logo") {
    return (
      // public/favicon.png é o único HM com fundo transparente (monograma.png é
      // branco opaco); no escuro inverte pra tinta clara
      <div className="flex h-full w-full items-center justify-center bg-bg p-[24%]">
        <Image
          src="/favicon.png"
          alt=""
          width={500}
          height={500}
          className="h-auto w-full object-contain dark:invert"
          sizes="200px"
        />
      </div>
    );
  }
  if (kind === "photo") {
    return (
      <Image
        src={Foto}
        alt=""
        fill
        placeholder="blur"
        sizes="(min-width: 1024px) 196px, (min-width: 640px) 140px, 104px"
        className="object-cover object-[center_20%]"
      />
    );
  }
  // TODO: imagem provisória — trocar pelo print definitivo
  return (
    <Image
      src="/psinaiade.png"
      alt=""
      fill
      sizes="(min-width: 1024px) 196px, (min-width: 640px) 140px, 104px"
      className="object-cover object-top"
    />
  );
}

export function HeroFan({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const wrap = "flex items-end justify-center -space-x-5 md:-space-x-7";

  if (reduced) {
    return (
      <div aria-hidden className={`${wrap} ${className ?? ""}`}>
        {CARDS.map((c) => (
          <div key={c.kind} className={CARD} style={{ transform: `translateY(${c.y}px) rotate(${c.rotate}deg)` }}>
            <CardContent kind={c.kind} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <m.div
      aria-hidden
      className={`${wrap} ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } } }}
    >
      {CARDS.map((c) => (
        <m.div
          key={c.kind}
          className={CARD}
          variants={{
            hidden: { opacity: 0, y: c.y + 28, rotate: 0 },
            show: { opacity: 1, y: c.y, rotate: c.rotate, transition: { duration: 0.7, ease: EASE } },
          }}
        >
          <CardContent kind={c.kind} />
        </m.div>
      ))}
    </m.div>
  );
}
