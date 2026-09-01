import type { CSSProperties } from "react";
import { StudioButton } from "@/components/site/studio-button";
import { HeroSeal } from "@/components/motion/hero-seal";
import { CONTACT_ID, CTA_PRIMARY, CTA_WORK } from "@/lib/site";

/*
 * H1: "Software e presença digital sob medida para a sua empresa"
 *
 * // alt: Sites, sistemas e tráfego pago — um estúdio, um responsável
 * // alt: O digital da sua empresa, do site ao sistema
 * // versão para anúncio (não usar na home): Tiro sua empresa do improviso digital
 *
 * Quebra: cada item de H1_LINES é um bloco com revelação própria.
 *   - lg+: 3 linhas — "Software e presença digital" / "sob medida" /
 *     "para a sua empresa" (o <br> do 2º bloco só existe em lg+).
 *     Corpo clamp(2.6rem, 4vw, 3.3rem): a 1ª linha mede ≈ 20.9em no Syne
 *     ExtraBold, então 3.3rem (52.8px) é o teto que cabe nos 1120px.
 *   - < lg: 2 blocos que quebram com `text-wrap: balance` → 4 linhas no
 *     mobile, 3 no tablet largo; corpo fluido (100vw − 48px) / 14.2.
 *
 * As animações de entrada são CSS puro (globals.css → .hero-*) pra pintar
 * antes da hidratação e não segurar o LCP.
 */
const H1_LINES = [
  <>Software e presença digital</>,
  <>
    sob medida
    <br className="hidden lg:inline" /> para a sua empresa
  </>,
];

const SUB =
  "Site, sistema de gestão e tráfego pago — feitos e integrados por um estúdio só, com você falando direto com quem executa.";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-var(--header-h))] items-center overflow-hidden pt-[var(--header-h)] lg:min-h-[calc(88svh-var(--header-h))]"
      aria-labelledby="hero-title"
    >
      {/* Arcos concêntricos ao fundo + selo HM (lg+) — --line, sem preenchimento */}
      <HeroSeal className="-right-[22vw] w-[78vw] md:-right-[14vw] md:w-[58vw] lg:-right-[10vw] lg:w-[52vw]" />

      <div className="container-studio relative z-10 w-full py-16 md:py-24">
        <p
          className="hero-fade eyebrow max-w-[36ch] leading-relaxed sm:max-w-none"
          style={delay(0.05)}
        >
          Estúdio de tecnologia e presença digital · Aracaju · Atendo todo o
          Brasil
        </p>

        <h1
          id="hero-title"
          className="mt-6 font-display text-[length:min(44px,calc((100vw-48px)/14.2))] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink md:mt-8 lg:text-[length:clamp(2.6rem,4vw,3.3rem)]"
        >
          {H1_LINES.map((line, i) => (
            <span key={i} className="hero-line" style={delay(0.25 + i * 0.07)}>
              <span className="text-balance">{line}</span>
            </span>
          ))}
        </h1>

        <p
          className="hero-fade mt-7 max-w-[560px] text-[18px] leading-[1.55] text-ink-soft md:mt-9 md:text-[21px]"
          style={delay(0.55)}
        >
          {SUB}
        </p>

        <div
          className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-11"
          style={delay(0.7)}
        >
          <StudioButton href={`#${CONTACT_ID}`} size="lg" arrow>
            {CTA_PRIMARY}
          </StudioButton>
          <StudioButton href="#trabalho" variant="secondary" size="lg">
            {CTA_WORK}
          </StudioButton>
        </div>
      </div>

      {/* fio inferior */}
      <div aria-hidden className="hero-rule absolute inset-x-0 bottom-0 h-px bg-line" />
    </section>
  );
}
