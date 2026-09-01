"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { TESTIMONIALS, type Testimonial } from "./testimonials";

/*
 * Depoimentos em carrossel (embla-carousel-react, já no package.json).
 *   - loop, align start, swipe no touch; autoplay via setInterval +
 *     scrollNext() a cada 4,5s — pausa no hover, no focus e fora da viewport
 *   - fade nas bordas com mask-image; o overflow fica dentro do viewport
 *   - prefers-reduced-motion: sem embla/autoplay — vira uma faixa nativa com
 *     scroll-snap-type: x, navegável por swipe e pelas setas
 *   - TESTIMONIALS vazio → a seção não renderiza
 */
const AUTOPLAY_MS = 4500;

const SLIDE = "min-w-0 flex-[0_0_86vw] pl-4 sm:flex-[0_0_400px] md:pl-5";
const EDGE_FADE =
  "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** fotos preenchem o círculo; logos ficam contidos com um respiro */
const isPhoto = (src: string) => /foto|photo|retrato/i.test(src);

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col gap-5 rounded-[8px] border border-line bg-surface p-7 md:p-8">
      <span
        aria-hidden
        className="font-display text-[64px] font-extrabold leading-[0.55] text-ink-soft"
      >
        “
      </span>
      <blockquote className="text-[1.05rem] leading-[1.5] text-ink md:text-[1.1rem]">
        <p>{t.quote}</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-2">
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-2">
          {t.avatar ? (
            <Image
              src={t.avatar}
              alt={t.name}
              fill
              sizes="40px"
              className={isPhoto(t.avatar) ? "object-cover" : "object-contain p-1.5"}
            />
          ) : (
            <span
              aria-hidden
              className="flex h-full w-full items-center justify-center font-display text-[13px] font-bold tracking-[-0.02em] text-ink"
            >
              {initials(t.name)}
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[15px] font-medium leading-snug text-ink">{t.name}</span>
          <span className="text-[0.85rem] leading-snug text-ink-soft">{t.role}</span>
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

/** Versão embla: loop + autoplay. */
function AutoCarousel({ items }: { items: Testimonial[] }) {
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: "start", duration: 32 });
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!embla || paused || !inView) return;
    const id = setInterval(() => embla.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [embla, paused, inView]);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mb-6 flex justify-end md:mb-8">
        <Arrows onPrev={prev} onNext={next} />
      </div>
      <div ref={viewportRef} className={cn("overflow-hidden", EDGE_FADE)}>
        <ul className="flex touch-pan-y -ml-4 md:-ml-5" aria-live="off">
          {items.map((t, i) => (
            <li key={`${t.name}-${i}`} className={SLIDE}>
              <TestimonialCard t={t} />
            </li>
          ))}
        </ul>
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
    el.scrollBy({ left: dir * (card?.getBoundingClientRect().width ?? 400), behavior: "auto" });
  };
  return (
    <div>
      <div className="mb-6 flex justify-end md:mb-8">
        <Arrows onPrev={() => by(-1)} onNext={() => by(1)} />
      </div>
      <ul
        ref={ref}
        className={cn(
          "-ml-4 flex snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none] md:-ml-5 [&::-webkit-scrollbar]:hidden",
          EDGE_FADE,
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
          index="06"
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
