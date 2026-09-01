"use client";

import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { CLIENTS_ACTIVE, PROJECTS_DELIVERED, SECTORS_SERVED } from "@/lib/site";
import { cn } from "@/lib/utils";

type Stat = { key: string; value: number; suffix?: string; label: string };

/** os três contam de 0 ao valor na mesma duração (terminam juntos); o "+" é fixo */
const COUNT_SECONDS = 0.9;

const STATS: Stat[] = [
  { key: "projetos", value: PROJECTS_DELIVERED, suffix: "+", label: "projetos entregues" },
  { key: "empresas", value: CLIENTS_ACTIVE, suffix: "+", label: "empresas atendidas hoje" },
  { key: "setores", value: SECTORS_SERVED, suffix: "+", label: "setores diferentes" },
];

const LEGEND = "Aracaju/SE — do consultório à obra, atendo todo o Brasil";

/**
 * Bloco de estatística: 3 números grandes (Syne 800) com rótulo embaixo,
 * divisores verticais em --line, hairline em cima e embaixo, legenda numa
 * linha. Os números sobem com <CountUp> ao entrar na viewport (o "+" é
 * fixo); com reduced-motion aparecem prontos. Só tipografia + fios.
 * Número em Geist 700, tracking -0.02em, line-height 1. O "+" é um span à
 * parte (0.5em, na base).
 */
export function ProofStrip() {
  return (
    <section aria-label="Números do estúdio" className="border-y border-line bg-bg">
      <div className="container-studio py-8 md:py-12">
        {/* < 640px: 3 linhas (número à esquerda, rótulo à direita, fio entre) · ≥ 640px: 3 colunas com divisor */}
        <dl className="grid grid-cols-1 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal
              as="div"
              key={stat.key}
              delay={i * 0.08}
              className={cn(
                "flex min-w-0 items-center gap-5 py-3.5 sm:flex-col sm:items-start sm:gap-3 sm:py-0",
                i > 0 && "border-t border-line sm:border-t-0 sm:border-l sm:pl-6 md:pl-10",
                i < STATS.length - 1 && "sm:pr-6 md:pr-10",
              )}
            >
              {/* dd antes do dt visualmente: número + "+" fixo (fora da contagem) */}
              <dd className="order-first flex w-[4.4ch] shrink-0 items-baseline font-display text-[2.1rem] font-bold leading-none tracking-[-0.02em] text-ink tabular-nums sm:w-auto md:text-[length:clamp(2.6rem,4vw,3.4rem)]">
                {/* largura final reservada pelo nº de dígitos → sem pulo de layout enquanto conta */}
                <span className="inline-block text-right" style={{ minWidth: `${String(stat.value).length}ch` }}>
                  <CountUp to={stat.value} duration={COUNT_SECONDS} />
                </span>
                {stat.suffix && (
                  <span aria-hidden={false} className="ml-[0.08em] align-baseline text-[0.5em] font-semibold">
                    {stat.suffix}
                  </span>
                )}
              </dd>
              <dt className="font-sans text-[0.8rem] font-medium uppercase leading-snug tracking-[0.08em] text-ink-soft">
                {stat.label}
              </dt>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.28} className="mt-6 md:mt-8">
          <p className="text-balance text-[0.9rem] leading-relaxed text-ink-soft">{LEGEND}</p>
        </Reveal>
      </div>
    </section>
  );
}
