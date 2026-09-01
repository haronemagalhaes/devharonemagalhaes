import type { CSSProperties } from "react";
import { StudioButton } from "@/components/site/studio-button";
import { Arc } from "@/components/site/arc";
import { CONTACT_ID, CTA_PRIMARY, CTA_WORK } from "@/lib/site";

/*
 * H1 escolhido: "Tiro sua empresa do improviso digital"
 * Alternativas:
 *   - "Seu cliente te procura na internet. Ele te encontra?"
 *   - "Site, sistema e tráfego pago — com o dono à frente"
 *
 * Sub alternativa:
 *   - "Monto e integro site, sistema e anúncios pra você parar de depender do
 *      improviso — e de cinco fornecedores diferentes."
 *   - "Uma pessoa só cuidando da parte digital da sua empresa: da página que
 *      vende ao sistema que organiza os bastidores."
 *
 * As animações de entrada são CSS puro (globals.css → .hero-*) pra pintar
 * antes da hidratação e não segurar o LCP.
 */
const H1_LINES = ["Tiro sua empresa", "do improviso digital"];

const SUB =
  "Crio o site que traz cliente, o sistema que organiza a operação e as campanhas que fazem o telefone tocar — tudo integrado, com você falando direto comigo, não com um atendimento.";

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
          className="mt-7 font-display text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink sm:text-[44px] md:mt-8 md:text-[46px] lg:text-[62px] xl:text-[74px]"
        >
          {H1_LINES.map((line, i) => (
            <span key={line} className="hero-line" style={delay(0.25 + i * 0.07)}>
              <span>{line}</span>
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
