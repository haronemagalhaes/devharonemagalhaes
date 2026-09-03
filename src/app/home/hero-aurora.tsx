import "./hero-aurora.css";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/site/magnetic-button";
import { StudioButton } from "@/components/site/studio-button";
import { CONTACT_ID, CTA_PRIMARY, SITE_DESCRIPTOR } from "@/lib/site";

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
 *            sem aurora — é a diferenciação entre as duas. Esquerda: "O que
 *            eu faço" + h2 + CTA; direita: chamada de sistemas (h3).
 *   O wrapper `relative` limita o sticky: quando ele termina, a capa 1 sai
 *   de cena junto (sticky não escapa do pai), então nada fica preso.
 *
 * Altura da capa 2: pelo conteúdo (mín. 72svh no desktop) em vez de 100svh
 * — o terço inferior ficava vazio. O empilhamento continua funcionando com
 * a capa 2 mais baixa: a capa 1 vai sendo coberta de baixo pra cima e some
 * quando o wrapper acaba.
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

/*
 * Capa 2, lado direito — chamada de sistemas e automação. A capa 1 fala só
 * da frente (ser encontrado, vender); a metade de sistema e automação, que
 * é a prioridade nº 1 de serviço, entra aqui. A lista das quatro frentes
 * saiu: duplicava a seção Capacidades, logo abaixo.
 * Escolha: a versão universal (sintoma que qualquer equipe reconhece) em
 * vez do caso "4 → 1", que já é o destaque de Resultados e depende de um
 * número ainda não confirmado.
 */
const SYSTEMS = {
  eyebrow: "Sistemas e automação",
  title: "Se a sua equipe digita a mesma coisa duas vezes, eu resolvo.",
  text: "Planilha e sistema solto viram um painel só — agenda, financeiro, orçamento, ordem de serviço no mesmo lugar. E a tarefa repetitiva que consome horas todo dia vira rotina automática.",
};

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
        className="relative z-10 flex items-center bg-ink text-bg md:min-h-[72svh]"
        aria-labelledby="resposta-title"
      >
        {/* pt maior no mobile: o header fixo (60px rolado) cobriria o eyebrow quando a capa 2 chega ao topo.
            Sem 100svh: a capa não precisa ser mais alta que o conteúdo pra cobrir a capa 1 — o terço
            inferior vazio era espaço morto. Colunas alinhadas pelo centro. */}
        <div className="container-studio grid w-full grid-cols-12 items-center gap-x-6 gap-y-12 pb-16 pt-24 md:gap-y-12 md:py-24">
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

          <div className="col-span-12 flex flex-col gap-5 lg:col-span-5 lg:col-start-8">
            <p className="eyebrow !text-bg/70">{SYSTEMS.eyebrow}</p>
            <h3 className="font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.015em] text-balance sm:text-[26px] md:text-[30px]">
              {SYSTEMS.title}
            </h3>
            <p className="max-w-[34rem] text-[16px] leading-relaxed text-bg/75 [text-wrap:pretty] md:text-[18px]">
              {SYSTEMS.text}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
