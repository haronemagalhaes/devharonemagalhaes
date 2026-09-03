import "./hero-aurora.css";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/site/magnetic-button";
import { StudioButton } from "@/components/site/studio-button";
import { CONTACT_ID, CTA_PRIMARY, REACH, SITE_DESCRIPTOR } from "@/lib/site";

/*
 * Hero empilhado (branch hero-aurora). Alterna com o hero atual em page.tsx
 * (const HERO).
 *
 * Duas capas, CSS puro (sem gsap/ScrollTrigger/framer-motion):
 *   capa 1 — a pergunta: `sticky top-0`, z-0, 100svh. Papel, grid + aurora
 *            (adaptados do CinematicFooter do 21st.dev, sem a cortina de
 *            rodapé, sem o texto gigante).
 *   capa 2 — a resposta: `relative z-10`, fundo de tinta 100% opaco. Sobe
 *            por cima da capa 1 conforme o usuário rola. Limpa: sem grid,
 *            sem aurora — é a diferenciação entre as duas.
 *   O wrapper `relative` limita o sticky: quando ele termina, a capa 1 sai
 *   de cena junto (sticky não escapa do pai), então nada fica preso.
 *
 * Mobile: capa 2 com altura pelo conteúdo (mín. 80svh) em vez de 100svh —
 * duas telas cheias antes da faixa de prova é rolo demais. O empilhamento
 * continua funcionando com a capa 2 mais baixa: a capa 1 vai sendo coberta
 * de baixo pra cima e some quando o wrapper acaba.
 *
 * Headings: um único <h1> (capa 1). A capa 2 usa <h2>.
 *
 * Contraste — capa 1: a aurora fica centrada no H1 e some antes do sub; o
 * grid tem um vazio atrás do bloco de texto. O sub NÃO usa --ink-soft: o
 * cinza médio sobre o papel mede 4,63:1 nominal e, com o grain do site,
 * o pior pixel fica em 4,46–4,59 — no limite do AA. Aqui o sub é tinta a
 * 75% (≈ 7:1). O brilho da 2ª linha vai só até 72% de tinta (o original
 * ia a 40% e reprovaria o AA na base dos glifos). Capa 2: papel sobre
 * tinta (16:1); eyebrow e numerais a 70% de papel (≈ 8:1 no claro, ≈ 6:1
 * no escuro — a 60% o escuro dava 4,49).
 *
 * H1 — medido no Chrome (Geist 600, -0.025em, lh 1.08): mobile 3 linhas,
 * (100vw − 48px) / 11 teto 46px → 30px a 375px; desktop 2 linhas,
 * min(64px, (100vw − 80px) / 14.8).
 */
const SUB =
  "Construo a estrutura digital que faz o cliente achar, confiar e comprar — site, tráfego pago, sistema e automação de rotina. Quem fecha o escopo com você é quem executa.";

/** Capa 2 — as quatro frentes, em ordem de prioridade. */
const FRONTS = [
  { n: "01", title: "Sistemas" },
  { n: "02", title: "Automação de tarefas" },
  { n: "03", title: "Site e Landing Page" },
  { n: "04", title: "Tráfego pago" },
];

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HeroAurora() {
  return (
    <div className="relative">
      {/* ---------- capa 1 — a pergunta ---------- */}
      <section
        id="top"
        className="sticky top-0 z-0 flex min-h-[100svh] items-center overflow-hidden bg-bg pt-[var(--header-h)]"
        aria-labelledby="hero-title"
      >
        <div aria-hidden className="hero-bg-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="hero-aurora pointer-events-none" />

        <div className="container-studio relative z-10 flex w-full flex-col items-center py-12 text-center md:py-24">
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

      {/* ---------- capa 2 — a resposta ---------- */}
      <section
        id="resposta"
        className="relative z-10 flex min-h-[80svh] items-center bg-ink text-bg md:min-h-[100svh]"
        aria-labelledby="resposta-title"
      >
        {/* pt maior no mobile: o header fixo (60px rolado) cobriria o eyebrow quando a capa 2 chega ao topo */}
        <div className="container-studio grid w-full grid-cols-12 gap-x-6 gap-y-10 pb-14 pt-24 md:gap-y-12 md:py-28">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-6">
            <p className="eyebrow !text-bg/70">O que eu faço</p>
            <h2
              id="resposta-title"
              className="max-w-[12ch] font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-balance sm:text-[40px] md:text-[52px] lg:text-[60px]"
            >
              Construo o caminho até você.
            </h2>
            {/* < 640px sai: header e capa 1 já têm CTA, e cada 60px conta antes da faixa de prova */}
            <div className="mt-2 hidden sm:block">
              <StudioButton
                href="#abordagem"
                variant="secondary"
                className="!border-bg !text-bg hover:!bg-bg hover:!text-ink"
                arrow
              >
                Ver como eu trabalho
              </StudioButton>
            </div>
          </div>

          <ol className="col-span-12 lg:col-span-6 lg:col-start-7 lg:self-center" aria-label="Frentes de trabalho">
            {FRONTS.map((f) => (
              <li
                key={f.n}
                className="flex items-baseline gap-5 border-t border-bg/15 py-4 last:border-b md:gap-8 md:py-6"
              >
                <span className="eyebrow !text-bg/70 tabular-nums">{f.n}</span>
                <strong className="font-display text-[24px] font-semibold leading-tight tracking-[-0.015em] md:text-[30px]">
                  {f.title}
                </strong>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
