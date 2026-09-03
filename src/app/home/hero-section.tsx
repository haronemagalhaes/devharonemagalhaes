import type { CSSProperties } from "react";
import Image from "next/image";
import { StudioButton } from "@/components/site/studio-button";
import { CONTACT_ID, CTA_PRIMARY, CTA_WORK, REACH, SITE_DESCRIPTOR } from "@/lib/site";

/*
 * H1: "Tiro sua empresa da planilha e coloco na frente do cliente."
 *
 * Transformação explícita (antes → depois) nos dois jobs, em primeira
 * pessoa: sai da planilha (sistema + automação) e chega na frente do
 * cliente (site + tráfego). "Planilha" é o símbolo da bagunça operacional
 * tanto pra clínica quanto pra indústria.
 *
 * // versão para anúncio (não usar na home): Tiro sua empresa do improviso digital
 * // descartadas:
 * //   "Software e presença digital sob medida para a sua empresa" — produto, não resultado
 * //   "Sua empresa encontrada, escolhida e contratada." — só fala com quem vende por busca
 * //   "Mais cliente chegando. Menos tarefa manual." — estado final, não o movimento
 * //   "Da planilha ao painel. Do invisível ao encontrado." — "painel" nomeia entregável, abstrata
 *
 * Corpo — medido no Chrome (Geist 600, tracking -0.02em, line-height 1.1),
 * frase inteira ≈ 27.5em:
 *   - < lg ...... sem <br>: quebra natural + `text-wrap: balance` em 3 linhas
 *                 ("Tiro sua empresa / da planilha e coloco / na frente do
 *                 cliente."). Corpo = (100vw − 48px) / 9.6, teto 48px →
 *                 320: 28px · 360: 32.5px · 375: 34px · 390: 35.6px · 430: 40px.
 *                 Máximo medido pra 3 linhas: 29/33/35/36/40. Duas linhas
 *                 exigiriam 23px a 375px (divisor 13.9) — corpo de sub, não
 *                 de H1. Nunca 4 linhas.
 *   - lg+ ....... 2 linhas com <br> após "planilha": a 2ª linha mede 13.70em
 *                 → corpo = (100vw − 80px) / 14, teto 80px → 1024: 67px ·
 *                 1280+: 80px.
 * Se trocar a copy ou a fonte: medir de novo e refazer os divisores.
 *
 * As animações de entrada são CSS puro (globals.css → .hero-*) pra pintar
 * antes da hidratação e não segurar o LCP.
 */
const SUB =
  "Site, tráfego pago, sistema e automação de rotina. Quem fecha o escopo com você é quem executa.";

/*
 * Marca d'água HM (public/favicon.png) — canto inferior direito, sangrando
 * 38% pra fora da borda direita e 40% da inferior. Só aparece ≥ 900px.
 * O teto de 60svh garante que o topo dela fique abaixo da última linha do
 * H1 em viewports baixas, ex. 1280×720. Estática; a oscilação opcional em
 * rotateY está comentada em globals.css (.hero-wm).
 */
const WM_SIZE = "min(clamp(420px, 40vw, 680px), 60svh)";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex items-start overflow-hidden pt-[var(--header-h)] md:min-h-[calc(100svh-var(--header-h))] md:items-center lg:min-h-[calc(88svh-var(--header-h))]"
      aria-labelledby="hero-title"
    >
      <div
        aria-hidden
        className="hero-wm hero-fade pointer-events-none absolute hidden select-none min-[900px]:block"
        style={{
          ...delay(0.8),
          width: WM_SIZE,
          right: `calc(${WM_SIZE} * -0.38)`,
          bottom: `calc(${WM_SIZE} * -0.4)`,
        }}
      >
        <Image
          src="/favicon.png"
          alt=""
          width={500}
          height={500}
          sizes="(min-width: 900px) 40vw, 0px"
          className="h-auto w-full opacity-[0.05]"
        />
      </div>

      <div className="container-studio relative z-10 w-full pb-16 pt-24 md:py-24 lg:py-28">
        {/* Eyebrow = prateleira + alcance. Sem cidade: ela fica no rodapé e no
            contato. < 640px só o descritor — a faixa de prova logo abaixo já
            diz "Atendo todo o Brasil". */}
        <p
          className="hero-fade eyebrow max-w-full !text-[11px] !tracking-[0.12em] leading-relaxed md:!text-[12px] md:!tracking-[0.14em]"
          style={delay(0.05)}
        >
          {SITE_DESCRIPTOR}
          <span className="hidden sm:inline"> · {REACH}</span>
        </p>

        <h1
          id="hero-title"
          className="mt-6 max-w-full font-display text-[length:clamp(1.5rem,calc((100vw-48px)/9.6),3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink [overflow-wrap:anywhere] md:mt-8 lg:text-[length:min(80px,calc((100vw-80px)/14))]"
        >
          <span className="hero-line" style={delay(0.25)}>
            <span className="text-balance">
              Tiro sua empresa da planilha
              <br className="hidden lg:inline" /> e coloco na frente do cliente.
            </span>
          </span>
        </h1>

        {/* coluna de apoio: sub + CTAs, alinhada à esquerda */}
        <div className="max-w-[680px]">
          <p
            className="hero-fade mt-6 max-w-full text-[17px] leading-[1.55] text-ink-soft md:mt-9 md:text-[20px]"
            style={delay(0.5)}
          >
            {SUB}
          </p>

          <div
            className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-12"
            style={delay(0.65)}
          >
            <StudioButton href={`#${CONTACT_ID}`} size="lg" arrow>
              {CTA_PRIMARY}
            </StudioButton>
            <StudioButton href="#trabalho" variant="secondary" size="lg">
              {CTA_WORK}
            </StudioButton>
          </div>
        </div>
      </div>
    </section>
  );
}
