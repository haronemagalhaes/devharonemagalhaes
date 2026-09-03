"use client";

import { Reveal } from "@/components/motion/reveal";
import { CardSticky, ContainerScroll } from "@/components/ui/cards-stack";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Rule } from "@/components/motion/rule";
import { SectionHeading } from "@/components/site/section-heading";
import { CornerMarks } from "@/components/site/corner-marks";
import { cn } from "@/lib/utils";
import { isPlaceholder, publishedCases, stripPlaceholders, type Case, type Metric } from "./cases";

/*
 * Resultados — prova social em três tempos (como estava → o que eu fiz →
 * o que mudou). Hierarquia por tamanho, peso e espaço, nunca por cor:
 *   métrica (Geist 700, grande — é o elo entre a headline e a prova) >
 *   o que mudou (corpo, ink, medium) > o que eu fiz (corpo, ink) >
 *   como estava (corpo, ink-soft).
 *
 * Degradação (a pilha precisa de 3 cards pra existir):
 *   - 0 cases publicados → a seção não renderiza
 *   - 1 ou 2 → cards no fluxo normal, sem sticky (hoje é o caso: 1)
 *   - 3+ → pilha: cada card gruda 14px abaixo do anterior e o seguinte
 *     sobe por cima; o gap entre eles (56vh) é o scroll de leitura de cada
 *     um. Sem sticky no mobile (< md) e com reduced-motion.
 * Trechos "[preencher: …]" são removidos do texto; campo que fica vazio some
 * do card; métrica com placeholder tira o case do ar (cases.ts).
 */

/** O número se adapta ao comprimento (sem contar espaços): "75" e "4 → 1" vão grandes, "3 planilhas → 1 painel" cabe. */
function metricSize(valor: string, variant: "destaque" | "card") {
  const n = valor.replace(/\s/g, "").length;
  if (variant === "destaque") {
    if (n <= 4) return "text-[length:clamp(96px,11vw,144px)] tracking-[-0.035em]";
    if (n <= 12) return "text-[length:clamp(44px,6vw,72px)] tracking-[-0.03em]";
    return "text-[length:clamp(30px,3.6vw,44px)] tracking-[-0.02em]";
  }
  if (n <= 4) return "text-[length:clamp(56px,7vw,80px)] tracking-[-0.03em]";
  if (n <= 12) return "text-[length:clamp(34px,4vw,48px)] tracking-[-0.025em]";
  return "text-[length:clamp(26px,2.8vw,34px)] tracking-[-0.02em]";
}

function BigMetric({ m, variant }: { m: Metric; variant: "destaque" | "card" }) {
  return (
    <p className="flex flex-col gap-2">
      <span
        className={cn(
          "block font-display font-bold leading-[0.95] text-ink tabular-nums [text-wrap:balance]",
          // número curto nunca quebra ("4 → 1" em uma linha só)
          m.valor.replace(/\s/g, "").length <= 4 && "whitespace-nowrap",
          metricSize(m.valor, variant),
        )}
      >
        {m.valor}
      </span>
      <span className="eyebrow">{m.rotulo}</span>
    </p>
  );
}

function SupportMetrics({ items }: { items: Metric[] }) {
  const real = items.filter((m) => !isPlaceholder(m.valor) && !isPlaceholder(m.rotulo));
  if (real.length === 0) return null;
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-5">
      {real.map((m) => (
        <div key={`${m.valor}-${m.rotulo}`} className="flex flex-col gap-1">
          <dd className="order-first font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums md:text-[30px]">
            {m.valor}
          </dd>
          <dt className="text-[13px] text-ink-soft">{m.rotulo}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Empresa + segmento · frente · período. */
function CaseHeader({ c, compact }: { c: Case; compact?: boolean }) {
  const meta = [c.segmento, c.servico, c.periodo].filter((s) => !isPlaceholder(s));
  return (
    <div className="flex flex-col gap-1.5">
      <h3
        className={cn(
          "font-display font-semibold leading-[1.15] tracking-[-0.01em] text-ink",
          compact ? "text-[20px]" : "text-[22px] md:text-[26px]",
        )}
      >
        {c.empresa}
      </h3>
      {meta.length > 0 && (
        <p className="text-[13px] leading-snug text-ink-soft">{meta.join(" · ")}</p>
      )}
    </div>
  );
}

/** Os três tempos. Placeholder → o bloco não aparece. */
function Story({ c, compact }: { c: Case; compact?: boolean }) {
  const rows: { label: string; text: string; className: string }[] = [
    {
      label: "Como estava",
      text: stripPlaceholders(c.comoEstava),
      className: compact ? "text-[15px] text-ink-soft" : "text-[16px] text-ink-soft md:text-[17px]",
    },
    {
      label: "O que eu fiz",
      text: stripPlaceholders(c.oQueEuFiz),
      className: compact ? "text-[15px] text-ink" : "text-[16px] text-ink md:text-[17px]",
    },
    {
      label: "O que mudou",
      text: stripPlaceholders(c.oQueMudou),
      className: compact
        ? "text-[16px] font-medium text-ink"
        : "text-[18px] font-medium text-ink md:text-[20px]",
    },
  ].filter((r) => r.text.length > 0);

  if (rows.length === 0) return null;
  return (
    <dl>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={cn(
            "grid grid-cols-12 gap-x-6 gap-y-1.5 border-t border-line",
            compact ? "py-4" : "py-5 md:py-6",
          )}
        >
          <dt className="eyebrow col-span-12 md:col-span-4">{r.label}</dt>
          <dd
            className={cn(
              "col-span-12 leading-relaxed md:col-span-8",
              r.className,
              i === rows.length - 1 && "[text-wrap:pretty]",
            )}
          >
            {r.text}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FeaturedCase({ c, solid }: { c: Case; solid?: boolean }) {
  return (
    <Reveal
      as="article"
      // na pilha o fundo precisa ser opaco: sem isso o card de baixo aparece através
      className={cn(
        "relative grid grid-cols-12 gap-x-6 gap-y-10 border border-line p-7 md:p-12 lg:p-16",
        solid && "rounded-[8px] bg-bg shadow-[0_24px_60px_-32px_color-mix(in_oklch,var(--ink)_35%,transparent)]",
      )}
      aria-label={`Resultado: ${c.empresa}`}
    >
      <CornerMarks size={16} inset={-1} />

      {/* número primeiro: é onde o olho bate */}
      <div className="col-span-12 flex flex-col gap-8 lg:col-span-5 lg:gap-12">
        <BigMetric m={c.metrica} variant="destaque" />
        {c.apoio && <SupportMetrics items={c.apoio} />}
      </div>

      <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
        <CaseHeader c={c} />
        <Story c={c} />
      </div>
    </Reveal>
  );
}

function CaseCard({ c, delay }: { c: Case; delay: number }) {
  return (
    <Reveal as="article" delay={delay} className="flex flex-col gap-6" aria-label={`Resultado: ${c.empresa}`}>
      <Rule delay={delay} />
      <div className="flex flex-col gap-6 pt-2">
        <BigMetric m={c.metrica} variant="card" />
        {c.apoio && <SupportMetrics items={c.apoio} />}
        <CaseHeader c={c} compact />
        <Story c={c} compact />
      </div>
    </Reveal>
  );
}

/**
 * Espaço de rolagem entre cards da pilha: é o quanto se lê de um card
 * antes do próximo cobrir. 56vh ≈ 500px a 900 de altura — um card inteiro
 * na tela mais uma pausa. O demo cravava min-h-[400vh] pra qualquer
 * quantidade; aqui a altura vem do fluxo, então é proporcional ao número
 * de cases: N cards ≈ N × (altura do card + 56vh).
 */
const STACK_GAP = "56vh";
/** o primeiro card gruda abaixo do header; cada seguinte 14px mais baixo */
const STACK_TOP = 96;
const STACK_STEP = 14;

export function CasesSection() {
  const reduced = useReducedMotion();
  const cases = publishedCases();
  if (cases.length === 0) return null;

  const featured = cases.find((c) => c.destaque) ?? cases[0];
  const rest = cases.filter((c) => c.id !== featured.id);
  /* a pilha só existe com 3+ cards; abaixo disso, o layout de sempre */
  const stacked = cases.length >= 3;
  const ordered = [featured, ...rest];

  return (
    <section id="resultados" className="section-pad" aria-labelledby="resultados-title">
      <div className="container-studio">
        <SectionHeading
          index="02"
          eyebrow="Resultados"
          title="O que mudou pra quem contratou"
          sub="Como estava, o que eu fiz e o que mudou. Número real, sem arredondar."
          id="resultados-title"
        />

        {stacked ? (
          /* ordem no DOM = ordem de leitura; o sticky só muda onde cada um para */
          <ContainerScroll
            className="mt-14 flex flex-col md:mt-20"
            style={{ gap: reduced ? "3rem" : STACK_GAP }}
          >
            {ordered.map((c, i) => (
              <CardSticky
                key={c.id}
                index={i}
                incrementY={STACK_STEP}
                topBase={STACK_TOP}
                /* sem sticky no mobile e com reduced-motion: lista normal */
                className={reduced ? "!static" : "!static md:!sticky"}
              >
                <FeaturedCase c={c} solid />
              </CardSticky>
            ))}
          </ContainerScroll>
        ) : (
          <>
            <div className="mt-14 md:mt-20">
              <FeaturedCase c={featured} />
            </div>

            {rest.length > 0 && (
              <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((c, i) => (
                  <li key={c.id}>
                    <CaseCard c={c} delay={Math.min(i * 0.08, 0.3)} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
