import "./hero-aurora.css";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/site/magnetic-button";
import { HeroFan } from "./hero-fan";
import { StudioButton } from "@/components/site/studio-button";
import { CONTACT_ID, CTA_PRIMARY, SITE_DESCRIPTOR } from "@/lib/site";

/*
 * Hero empilhado (branch hero-aurora). Alterna com o hero atual em page.tsx
 * (const HERO).
 *
 * Duas capas, CSS puro (sem gsap/ScrollTrigger/framer-motion):
 *   capa 1 — a pergunta: mín. 100svh. Papel, grid + aurora + textura e o
 *            leque de 3 cartões (Hero10) abaixo do CTA. Sticky só ≥ md: no
 *            desktop o leque escala pela altura da viewport (20svh) e a
 *            capa cabe em 100svh, então `sticky top-0` funciona sem JS;
 *            no mobile nenhuma altura comum cabe com o leque, então a capa
 *            rola normal e a capa 2 vem em seguida (sem cobrir). Decisão
 *            2026-09-03 = "opção 2"; alternativas: top negativo via JS
 *            (sticky-fit, removido) ou sem sticky em lugar nenhum.
 *   capa 2 — a resposta: `relative z-10`, fundo de tinta 100% opaco. Sobe
 *            por cima da capa 1 conforme o usuário rola. Limpa: sem grid,
 *            sem aurora — é a diferenciação entre as duas. Headline grande
 *            de sistemas (h2) + apoio; "Construo o caminho até você." (h3)
 *            pequeno, junto do CTA.
 *   O wrapper `relative` limita o sticky: quando ele termina, a capa 1 sai
 *   de cena junto (sticky não escapa do pai), então nada fica preso.
 *
 * Altura da capa 2: pelo conteúdo (mín. 72svh no desktop) em vez de 100svh
 * — o terço inferior ficava vazio. O empilhamento continua funcionando com
 * a capa 2 mais baixa: a capa 1 vai sendo coberta de baixo pra cima e some
 * quando o wrapper acaba.
 *
 * Headings: um único <h1> (capa 1). A capa 2 usa <h2> (sistemas) e <h3>.
 *
 * Textura (capa 1): realce + vinheta + grão, o mesmo sistema das artes do
 * Instagram, derivado dos tokens (hero-aurora.css). O grid ficou a 2,5%
 * como camada de apoio. A animação de entrada é a CSS do site (.hero-fade,
 * escalonada por --d; some com prefers-reduced-motion) — não precisou de
 * framer-motion.
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

/*
 * Capa 2 — hierarquia invertida (2026-09-03): a chamada de sistemas e
 * automação é o elemento GRANDE (h2, largura toda); "Construo o caminho
 * até você." virou apoio (h3 pequeno, ao lado do CTA). Sistemas é a
 * prioridade nº 1 de serviço e a capa 1 fala só da frente.
 *
 * Headline A ("O que sua equipe faz em 3 horas, o sistema faz sozinho."):
 * universal, número exato do caso real (≈ 3 h/dia varrendo 75 sites de
 * licitação) e completa sem depender do sub. B ("75 sites por dia. Hoje,
 * zero.") e D ("3 horas por dia. Ou nenhuma.") aguentam corpo gigante mas
 * são crípticas sem o apoio; C não tem número e cai pra 24px no mobile.
 *
 * Medição (Geist 600, -0.025em, lh 1.05): L1 "O que sua equipe faz em 3
 * horas," 15.62em · L2 "o sistema faz sozinho." 10.51em. Uma frase por
 * bloco:
 *   - < lg ...... L1 em 2 linhas + L2 em 1 = 3 linhas; corpo =
 *                 (100vw − 48px) / 10.7 (L2 manda), teto 48px →
 *                 320: 25px · 360: 29px · 375: 31px · 390: 32px · 430: 36px.
 *                 Sem os blocos, o balance dava "faz em 3 horas, o /
 *                 sistema faz sozinho." com o "o" órfão.
 *   - lg+ ....... 2 linhas: corpo = (100vw − 80px) / 15.9, teto 68px →
 *                 1024: 59px · 1280+: 68px (o H1 da capa 1 tem 64px; a
 *                 capa 2 precisa dominar a própria capa, não a página).
 */
const SYSTEMS = {
  eyebrow: "Sistemas sob medida e automação de tarefas",
  line1: "O que sua equipe faz em 3 horas,",
  line2: "o sistema faz sozinho.",
  // três casos reais, sem contar a história; ordem: licitação → financeiro → relatório
  // TODO: confirmar o que foi entregue no caso do financeiro — "vive num painel" é provisório
  apoio:
    "Buscar licitação em 75 sites, todo dia. Controlar o financeiro na planilha. Montar relatório fotográfico no Word. Três tarefas que eu tirei da mão de alguém: a lista chega pronta, o financeiro vive num painel e o relatório sai do sistema.",
};

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HeroAurora() {
  return (
    <div className="relative">
      {/* ---------- capa 1 — a pergunta ---------- */}
      <section
        id="top"
        className="relative z-0 flex min-h-[100svh] items-center overflow-hidden bg-bg pt-[var(--header-h)] md:sticky md:top-0"
        aria-labelledby="hero-title"
      >
        {/* textura (de trás pra frente): grid → realce → aurora → vinheta → grão */}
        <div aria-hidden className="hero-bg-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="hero-spot pointer-events-none absolute inset-0" />
        <div aria-hidden className="hero-aurora pointer-events-none" />
        <div aria-hidden className="hero-vignette pointer-events-none absolute inset-0" />
        <div aria-hidden className="hero-grain pointer-events-none absolute inset-0" />

        <div className="container-studio relative z-10 flex w-full flex-col items-center py-10 text-center">
          <p
            className="hero-fade eyebrow max-w-full !text-[11px] !tracking-[0.12em] leading-relaxed md:!text-[12px] md:!tracking-[0.14em]"
            style={delay(0.05)}
          >
            {/* só a prateleira: o alcance ("Atendo todo o Brasil") fica na faixa de prova, logo abaixo */}
            {SITE_DESCRIPTOR}
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

          {/* CTA sólido: é a ação mais importante da página e precisa ganhar do fundo — o vidro sumia no papel */}
          <div className="hero-fade mt-8 w-full sm:w-auto md:mt-10 [perspective:600px]" style={delay(0.6)}>
            <MagneticButton
              href={`#${CONTACT_ID}`}
              className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-medium text-bg shadow-[0_12px_32px_-12px_color-mix(in_oklch,var(--ink)_45%,transparent)] transition-colors duration-300 hover:bg-ink/90 sm:w-auto"
            >
              {CTA_PRIMARY}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </MagneticButton>
          </div>

          {/* leque de 3 cartões (Hero10): monograma · foto · print provisório */}
          <HeroFan className="mt-8 md:mt-10" />
        </div>
      </section>

      {/* ---------- capa 2 — a resposta ---------- */}
      <section
        id="resposta"
        className="relative z-10 flex items-center bg-ink text-bg md:min-h-[72svh]"
        aria-labelledby="resposta-title"
      >
        {/* pt maior no mobile: o header fixo (60px rolado) cobriria o eyebrow quando a capa 2 chega ao topo */}
        <div className="container-studio w-full pb-16 pt-24 md:py-24">
          <p className="eyebrow !text-bg/70">{SYSTEMS.eyebrow}</p>

          <h2
            id="resposta-title"
            className="mt-5 max-w-full font-display text-[length:clamp(1.5rem,calc((100vw-48px)/10.7),3rem)] font-semibold leading-[1.05] tracking-[-0.025em] md:mt-7 lg:text-[length:min(68px,calc((100vw-80px)/15.9))]"
          >
            <span className="block text-balance">{SYSTEMS.line1}</span>
            <span className="block">{SYSTEMS.line2}</span>
          </h2>

          <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-10 md:mt-12">
            <p className="capa2-apoio col-span-12 max-w-[40rem] text-[17px] leading-relaxed text-bg/75 [text-wrap:pretty] lg:col-span-7 md:text-[19px]">
              {SYSTEMS.apoio}
            </p>

            {/* apoio: a resposta à pergunta da capa 1, agora pequena, junto do CTA */}
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-bg/15 lg:pl-8">
              <p className="eyebrow !text-bg/70">O que eu faço</p>
              <h3 className="font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.015em] md:text-[26px]">
                Construo o caminho até você.
              </h3>
              {/* < 640px sai: header e capa 1 já têm CTA */}
              <div className="mt-1 hidden sm:block">
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
          </div>
        </div>
      </section>
    </div>
  );
}
