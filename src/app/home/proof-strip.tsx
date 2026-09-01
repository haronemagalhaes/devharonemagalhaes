"use client";

import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Rule } from "@/components/motion/rule";
import { CLIENTS_ACTIVE, PROJECTS_DELIVERED, RESPONSE_TIME } from "@/lib/site";

const NUM =
  "font-display text-2xl font-bold tabular-nums tracking-[-0.02em] text-ink";

/**
 * Tira fina de prova: fios entre itens, números com count-up.
 * O "+" é sufixo fixo depois do número; com reduced-motion o CountUp mostra
 * o valor final direto.
 */
export function ProofStrip() {
  const items: { key: string; node: React.ReactNode }[] = [
    {
      key: "projetos",
      node: (
        <>
          <CountUp to={PROJECTS_DELIVERED} suffix="+" className={NUM} /> projetos
          entregues
        </>
      ),
    },
    {
      key: "empresas",
      node: (
        <>
          <CountUp to={CLIENTS_ACTIVE} duration={1.1} className={NUM} /> empresas
          atendidas hoje
        </>
      ),
    },
    { key: "local", node: <>Aracaju/SE — atendo todo o Brasil</> },
    { key: "resposta", node: <>{RESPONSE_TIME.toLowerCase()}</> },
  ];

  return (
    <section aria-label="Prova" className="container-studio">
      {/* < 480px: lista vertical com fios horizontais · 480–767: 2×2 · md+: 4 colunas */}
      <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            as="li"
            key={item.key}
            delay={i * 0.06}
            className="relative flex items-center gap-2 border-t border-line py-4 text-[15px] leading-snug text-ink-soft first:border-t-0 min-[480px]:border-t-0 min-[480px]:py-6 min-[480px]:odd:pr-4 min-[480px]:even:pl-4 md:py-8 md:pl-6 md:pr-0 md:first:pl-0"
          >
            {i > 0 && (
              <span
                aria-hidden
                className={[
                  "absolute inset-y-5 left-0 w-px bg-line",
                  i % 2 === 1 ? "hidden min-[480px]:block" : "hidden md:block",
                ].join(" ")}
              />
            )}
            <span>{item.node}</span>
          </Reveal>
        ))}
      </ul>
      <Rule />
    </section>
  );
}
