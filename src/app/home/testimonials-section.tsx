"use client";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";

/*
 * PENDÊNCIA — 3 depoimentos reais (texto + nome + papel/segmento + foto opcional).
 * Nada aqui é ficção: os campos entre colchetes são marcadores visíveis.
 */
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  placeholder?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  { quote: "[frase do cliente sobre o resultado]", name: "[Nome]", role: "[papel, segmento]", placeholder: true },
  { quote: "[frase do cliente sobre o resultado]", name: "[Nome]", role: "[papel, segmento]", placeholder: true },
  { quote: "[frase do cliente sobre o resultado]", name: "[Nome]", role: "[papel, segmento]", placeholder: true },
];

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="section-pad" aria-labelledby="depoimentos-title">
      <div className="container-studio">
        <SectionHeading
          index="06"
          eyebrow="Depoimentos"
          title="O que dizem os clientes"
          id="depoimentos-title"
        />

        <ul className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-3 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 0.08}
              className={[
                "relative flex flex-col justify-between gap-8 rounded-[8px] border bg-surface p-7 md:p-8",
                t.placeholder ? "border-dashed border-ink-soft/50" : "border-line",
              ].join(" ")}
            >
              {t.placeholder && (
                <span className="absolute -top-3 left-7 rounded-full border border-dashed border-ink-soft/60 bg-bg px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                  Pendente
                </span>
              )}
              <blockquote className="font-display text-[19px] font-bold leading-snug tracking-[-0.01em] text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="flex flex-col gap-0.5 text-[14px]">
                <span className="font-medium text-ink">{t.name}</span>
                <span className="text-ink-soft">{t.role}</span>
              </figcaption>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
