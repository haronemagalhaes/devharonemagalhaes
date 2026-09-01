import type { CSSProperties } from "react";
import { StudioButton } from "@/components/site/studio-button";
import { Arc } from "@/components/site/arc";
import { CONTACT_ID, CTA_PRIMARY, CTA_WORK } from "@/lib/site";

/*
 * H1: "Software e presença digital sob medida para a sua empresa"
 *
 * // alt: Sites, sistemas e tráfego pago — um estúdio, um responsável
 * // alt: O digital da sua empresa, do site ao sistema
 * // versão para anúncio (não usar na home): Tiro sua empresa do improviso digital
 *
 * Quebra: cada item de H1_LINES é um bloco. Tamanho fluido calibrado na
 * largura real do Syne ExtraBold (tracking -0.03em):
 *   - linha "sob medida para a sua empresa" ≈ 24.8em → 44px enche os 1120px
 *     do container em 2 linhas (≥ ~1170px de viewport);
 *   - abaixo disso cada bloco quebra com `text-wrap: balance` em 2 subl.
 *     (a maior ≈ 13.2em) → 3 linhas no lg/tablet, 4 no mobile, sem órfã.
 * Se quiser o H1 maior no desktop, o custo é ir pra 3 linhas.
 *
 * As animações de entrada são CSS puro (globals.css → .hero-*) pra pintar
 * antes da hidratação e não segurar o LCP.
 */
const H1_LINES = ["Software e presença digital", "sob medida para a sua empresa"];

const SUB =
  "Site, sistema de gestão e tráfego pago — feitos e integrados por um estúdio só, com você falando direto com quem executa.";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-var(--header-h))] items-center overflow-hidden pt-[var(--header-h)]"
      aria-labelledby="hero-title"
    >
      {/* Arco concêntrico ao fundo — --line, sem preenchimento */}
      <div
        aria-hidden
        className="hero-arc pointer-events-none absolute -right-[22vw] top-1/2 w-[78vw] md:-right-[14vw] md:w-[58vw] lg:-right-[10vw] lg:w-[52vw]"
      >
        <Arc rings={6} className="h-auto w-full" />
      </div>

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
          className="mt-7 font-display text-[length:min(44px,calc((100vw-48px)/13.4))] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink md:mt-8"
        >
          {H1_LINES.map((line, i) => (
            <span key={line} className="hero-line" style={delay(0.25 + i * 0.07)}>
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
