"use client";

import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { CLIENTS_ACTIVE, PROJECTS_DELIVERED, SECTORS_SERVED } from "@/lib/site";
import { cn } from "@/lib/utils";

type Stat = { key: string; value: number; suffix?: string; label: string };

const STATS: Stat[] = [
  { key: "projetos", value: PROJECTS_DELIVERED, suffix: "+", label: "projetos entregues" },
  { key: "empresas", value: CLIENTS_ACTIVE, label: "empresas atendidas hoje" },
  { key: "setores", value: SECTORS_SERVED, label: "setores diferentes" },
];

const LEGEND = "Aracaju/SE — do consultório à obra, atendo todo o Brasil";

/**
 * Bloco de estatística: 3 números grandes (Syne 800) com rótulo embaixo,
 * divisores verticais em --line, hairline em cima e embaixo, legenda numa
 * linha. Os números sobem com <CountUp> ao entrar na viewport (o "+" é
 * fixo); com reduced-motion aparecem prontos. Só tipografia + fios.
 */
export function ProofStrip() {
  return (
    <section aria-label="Números do estúdio" className="border-y border-line bg-bg">
      <div className="container-studio py-8 md:py-12">
        <dl className="grid grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal
              as="div"
              key={stat.key}
              delay={i * 0.08}
              className={cn(
                "flex min-w-0 flex-col gap-2 md:gap-3",
                i > 0 && "border-l border-line pl-3 sm:pl-6 md:pl-10",
                i < STATS.length - 1 && "pr-2 sm:pr-6 md:pr-10",
              )}
            >
              {/* dd antes do dt visualmente: número em cima, rótulo embaixo */}
              <dd className="order-first font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.03em] text-ink tabular-nums md:text-[length:clamp(2.4rem,5vw,3.4rem)]">
                <CountUp to={stat.value} />
                {stat.suffix && <span className="text-[0.6em]">{stat.suffix}</span>}
              </dd>
              <dt className="font-sans text-[0.78rem] font-medium uppercase leading-snug tracking-[0.06em] text-ink sm:text-[0.9rem]">
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
