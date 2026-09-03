import "./hero-aurora.css";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/site/magnetic-button";
import { CONTACT_ID, CTA_PRIMARY, REACH, SITE_DESCRIPTOR } from "@/lib/site";

/*
 * Hero experimental "aurora" (branch hero-aurora) — versão sem fotos.
 * Alterna com o hero atual em page.tsx (const HERO).
 *
 * Origem: CinematicFooter (21st.dev). É um rodapé com cortina (clip-path +
 * <footer fixed>) que se revela ao rolar — no topo da página não há o que
 * rolar, então ficou só o visual: grid com máscara, aurora respirando,
 * texto gigante, brilho do título e glass pill. Marquee NÃO entrou: seria a
 * quarta camada decorativa na dobra e uma lista de serviços rolando embaixo
 * de uma headline que é uma pergunta — compete e repete o sub.
 *
 * Camadas (de trás pra frente): grid → aurora → HARONEDEV → conteúdo.
 * Tudo decorativo é aria-hidden. Cores: só --foreground/--background em
 * color-mix (zero acento). Fonte: Geist, como o resto do site.
 *
 * H1 — mesma medição do hero anterior (Geist 600, -0.025em, lh 1.08):
 *   mobile 3 linhas, (100vw − 48px) / 11 teto 46px → 30px a 375px;
 *   desktop 2 linhas, min(64px, (100vw − 80px) / 14.8).
 * Contraste: a aurora fica centrada no H1 e some antes do sub; o grid tem
 * um vazio atrás do bloco de texto. Mesmo assim o sub NÃO usa --ink-soft:
 * o cinza médio sobre o papel mede 4,63:1 nominal, e com o grain do site
 * (ruído por pixel) o pior pixel oscila entre 4,46 e 4,59 — no limite do
 * AA (4,5) em qualquer seção. Aqui o sub é tinta a 75% (≈ 7:1). O brilho
 * da 2ª linha vai só até 72% de tinta (o original ia a 40% e reprovaria
 * o AA na base dos glifos).
 */
const SUB =
  "Construo a estrutura digital que faz o cliente achar, confiar e comprar — site, tráfego pago, sistema e automação de rotina. Quem fecha o escopo com você é quem executa.";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HeroAurora() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-bg pt-[var(--header-h)] md:min-h-[92svh]"
      aria-labelledby="hero-title"
    >
      <div aria-hidden className="hero-bg-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-aurora pointer-events-none" />
      <div
        aria-hidden
        className="hero-giant-text pointer-events-none absolute bottom-[-0.06em] left-1/2 -translate-x-1/2 select-none font-display"
      >
        HARONEDEV
      </div>

      <div className="container-studio relative z-10 flex w-full flex-col items-center py-16 text-center md:py-24">
        <p
          className="hero-fade eyebrow max-w-full !text-[11px] !tracking-[0.12em] leading-relaxed md:!text-[12px] md:!tracking-[0.14em]"
          style={delay(0.05)}
        >
          {SITE_DESCRIPTOR}
          <span className="hidden sm:inline"> · {REACH}</span>
        </p>

        <h1
          id="hero-title"
          className="hero-fade mt-6 max-w-full font-display text-[length:clamp(1.5rem,calc((100vw-48px)/11),2.875rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink md:mt-8 lg:text-[length:min(64px,calc((100vw-80px)/14.8))]"
          style={delay(0.2)}
        >
          {/* a pergunta é o clímax: cinza na primeira linha, tinta com brilho na segunda */}
          <span className="block text-ink-soft">Você tem o que vender.</span>
          <span className="hero-text-glow block text-balance">Seu cliente sabe te encontrar?</span>
        </h1>

        <p
          className="hero-sub hero-fade mt-6 max-w-[34rem] text-[16px] leading-[1.55] text-ink/75 [text-wrap:pretty] md:mt-8 md:max-w-[40rem] md:text-[19px]"
          style={delay(0.45)}
        >
          {SUB}
        </p>

        <div className="hero-fade mt-8 w-full sm:w-auto md:mt-10 [perspective:600px]" style={delay(0.6)}>
          <MagneticButton
            href={`#${CONTACT_ID}`}
            className="hero-glass-pill inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-medium text-ink sm:w-auto"
          >
            {CTA_PRIMARY}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
