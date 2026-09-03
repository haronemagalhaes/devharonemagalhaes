"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { TESTIMONIALS, type Testimonial } from "./testimonials";

/*
 * Depoimentos em carrossel (embla-carousel-react).
 *   - loop, align start, swipe; autoplay via setInterval + scrollNext() a
 *     cada 4s (ref) — pausa em pointerenter/focusin, retoma em
 *     pointerleave/focusout
 *   - o carrossel sangra só até a calha do container (24/40px) e é ali que
 *     fica o fade da máscara: o(s) card(s) encaixado(s) ficam 100% visíveis
 *   - prefers-reduced-motion: faixa nativa com scroll-snap, sem autoplay
 *   - TESTIMONIALS vazio → a seção não renderiza
 */
const AUTOPLAY_MS = 4000;

/**
 * calha = padding-inline do container-studio (24px < md, 40px ≥ md). No
 * desktop cabem exatamente 3 cards, então o fade fica só na calha; no mobile
 * o próximo card "espia" ~30px e o fade cobre a espiada inteira (64px).
 */
const GUTTER_MASK =
  "[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-64px),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]";
const GUTTER = cn("-mx-6 px-6 md:-mx-10 md:px-10", GUTTER_MASK);
/** na faixa nativa o padding-esquerdo desconta o gap do slide (pl-4/pl-5) */
const GUTTER_STRIP = cn(
  "-mx-6 pl-2 pr-6 md:-mx-10 md:pl-5 md:pr-10 [scroll-padding-inline:8px] md:[scroll-padding-inline:20px]",
  GUTTER_MASK,
);
/** slide = card + gap (16px < md, 20px ≥ md): ~1,1 card no mobile, 3 inteiros no desktop */
const SLIDE = "min-w-0 flex-[0_0_calc(82vw+16px)] pl-4 md:flex-[0_0_calc(100%/3)] md:pl-5";

/** Foto → círculo 40px · logo inline → 24px sem moldura · logo tile → 32px radius 8. */
function Mark({ t }: { t: Testimonial }) {
  if (t.avatar) {
    return (
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-2">
        <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
      </span>
    );
  }
  if (t.logo?.style === "tile") {
    return (
      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[8px] bg-surface-2">
        <Image src={t.logo.src} alt={t.name} fill sizes="32px" className="object-cover" />
      </span>
    );
  }
  if (t.logo) {
    return (
      <Image
        src={t.logo.src}
        alt={t.name}
        width={96}
        height={24}
        sizes="96px"
        className="h-6 w-auto max-w-[96px] shrink-0 object-contain"
      />
    );
  }
  return null;
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-[8px] border border-line bg-surface p-6">
      <span aria-hidden className="mb-5 block h-px w-[14px] bg-line" />
      <blockquote className="line-clamp-3 text-[1rem] leading-[1.5] text-ink md:text-[1.05rem]">
        <p>{t.quote}</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        <Mark t={t} />
        <span className="flex min-w-0 flex-col">
          <span className="text-[0.9rem] font-medium leading-snug text-ink">{t.name}</span>
          <span className="text-[0.8rem] leading-snug text-ink-soft">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Arrows({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-ink text-ink transition-colors duration-300 hover:bg-ink hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
  return (
    <div className="hidden items-center gap-2 md:flex">
      <button type="button" onClick={onPrev} className={btn} aria-label="Depoimento anterior">
        <ArrowLeft className="h-4 w-4" aria-hidden />
      </button>
      <button type="button" onClick={onNext} className={btn} aria-label="Próximo depoimento">
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

/** Versão embla: loop + autoplay (setInterval numa ref; pausa/retoma por ponteiro e foco). */
function AutoCarousel({ items }: { items: Testimonial[] }) {
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: "start", duration: 32 });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);
  const start = useCallback(() => {
    if (!embla) return;
    stop();
    timer.current = setInterval(() => embla.scrollNext(), AUTOPLAY_MS);
  }, [embla, stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <div onPointerEnter={stop} onPointerLeave={start} onFocus={stop} onBlur={start}>
      <div className="mb-6 flex justify-end md:mb-8">
        <Arrows onPrev={prev} onNext={next} />
      </div>
      {/* a calha recorta e esmaece; o viewport do embla fica visível dentro dela */}
      <div className={cn("overflow-hidden", GUTTER)}>
        <div ref={viewportRef}>
          <ul className="flex items-stretch touch-pan-y -ml-4 md:-ml-5" aria-live="off">
            {items.map((t, i) => (
              <li key={`${t.name}-${i}`} className={SLIDE}>
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Versão reduced-motion: faixa nativa com scroll-snap, sem autoplay. */
function SnapStrip({ items }: { items: Testimonial[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * (card?.getBoundingClientRect().width ?? 360), behavior: "auto" });
  };
  return (
    <div>
      <div className="mb-6 flex justify-end md:mb-8">
        <Arrows onPrev={() => by(-1)} onNext={() => by(1)} />
      </div>
      <ul
        ref={ref}
        className={cn(
          "flex snap-x snap-mandatory items-stretch overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          GUTTER_STRIP,
        )}
      >
        {items.map((t, i) => (
          <li key={`${t.name}-${i}`} className={cn(SLIDE, "snap-start")}>
            <TestimonialCard t={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TestimonialsSection() {
  const reduced = useReducedMotion();
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section id="depoimentos" className="section-pad" aria-labelledby="depoimentos-title">
      <div className="container-studio">
        <SectionHeading
          index="07"
          eyebrow="Depoimentos"
          title="O que dizem os clientes"
          id="depoimentos-title"
        />
        <Reveal className="mt-10 md:mt-14">
          {reduced ? <SnapStrip items={TESTIMONIALS} /> : <AutoCarousel items={TESTIMONIALS} />}
        </Reveal>
      </div>
    </section>
  );
}
