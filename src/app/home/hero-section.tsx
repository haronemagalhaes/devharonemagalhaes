import type { CSSProperties } from "react";
import Image from "next/image";
import { StudioButton } from "@/components/site/studio-button";
import { CONTACT_ID, CTA_PRIMARY, CTA_WORK } from "@/lib/site";

/*
 * H1: "Software e presença digital sob medida para a sua empresa"
 *
 * // alt: Sites, sistemas e tráfego pago — um estúdio, um responsável
 * // alt: O digital da sua empresa, do site ao sistema
 * // versão para anúncio (não usar na home): Tiro sua empresa do improviso digital
 *
 * Quebra (um bloco só):
 *   - lg+ ....... 2 linhas com <br>: "Software e presença digital" /
 *                 "sob medida para a sua empresa". A 2ª mede ≈ 24.8em no Syne
 *                 ExtraBold (tracking -0.03em), então o corpo é
 *                 (100vw − 80px) / 25.2 com teto de 44px — enche os 1120px do
 *                 container. 2 linhas dentro de ~58% da largura seria ~26px.
 *   - < lg ...... sem <br>: quebra natural + `text-wrap: balance` +
 *                 `overflow-wrap: anywhere` (nunca corta). Corpo fluido
 *                 (100vw − 48px) / 13.4 → 4 linhas equilibradas no celular
 *                 (a maior ≈ 13.3em), 3 no tablet. Um clamp em vw "normal"
 *                 (ex. 8.5vw) daria 6–7 linhas com essa fonte larga.
 * A revelação é do bloco inteiro (cortina + translateY), não linha a linha,
 * então não depende de largura fixa.
 *
 * As animações de entrada são CSS puro (globals.css → .hero-*) pra pintar
 * antes da hidratação e não segurar o LCP.
 */
const SUB = "Site, sistema de gestão e tráfego pago. Um estúdio, um responsável.";
// alt: "Site, sistema e tráfego pago — um estúdio, um responsável."

/*
 * Marca d'água HM (public/favicon.png) — canto inferior direito, sangrando
 * 38% pra fora da borda direita e 40% da inferior. Só aparece ≥ 900px.
 * O teto de 60svh garante que o topo dela fique abaixo da última linha do
 * H1 (que termina em ≈ 54% da altura do hero) em viewports baixas, ex.
 * 1280×720. Estática; a oscilação opcional em rotateY está comentada em
 * globals.css (.hero-wm).
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
        {/* < 640px: só o descritor — cidade/abrangência já aparecem na faixa de prova */}
        <p
          className="hero-fade eyebrow max-w-full !text-[11px] !tracking-[0.12em] leading-relaxed md:!text-[12px] md:!tracking-[0.14em]"
          style={delay(0.05)}
        >
          Estúdio de tecnologia e presença digital
          <span className="hidden sm:inline"> · Aracaju · Atendo todo o Brasil</span>
        </p>

        <h1
          id="hero-title"
          className="mt-6 max-w-full font-display text-[length:clamp(1.35rem,calc((100vw-48px)/13.4),2.4rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink [overflow-wrap:anywhere] md:mt-8 lg:text-[length:min(44px,calc((100vw-80px)/25.2))]"
        >
          <span className="hero-line" style={delay(0.25)}>
            <span className="text-balance">
              Software e presença digital
              <br className="hidden lg:inline" /> sob medida para a sua empresa
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
