"use client";

import { Reveal } from "@/components/motion/reveal";
import { Rule } from "@/components/motion/rule";
import { SectionHeading } from "@/components/site/section-heading";

const STEPS = [
  {
    n: "01",
    title: "Diagnóstico gratuito",
    text: "Você me conta onde a operação trava. Eu digo o que dá pra resolver e como.",
  },
  {
    n: "02",
    title: "Proposta fechada",
    text: "Escopo, prazo e valor por escrito antes de começar. Sem “vai saindo”.",
  },
  {
    n: "03",
    title: "Execução acompanhada",
    text: "Entregas parciais toda semana. Você vê o projeto andar, não some por um mês.",
  },
  {
    n: "04",
    title: "Entrega e manutenção",
    text: "Depois do ar, o projeto continua tendo dono: hospedagem, ajuste e suporte no plano mensal.",
  },
];

export function ApproachSection() {
  return (
    <section
      id="abordagem"
      className="section-pad bg-surface-2/60"
      aria-labelledby="abordagem-title"
    >
      <div className="container-studio">
        <SectionHeading
          index="03"
          eyebrow="Abordagem"
          title="Como a gente trabalha"
          id="abordagem-title"
        />

        <ol className="mt-14 grid grid-cols-1 gap-x-8 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.n} className="flex flex-col">
              <Rule delay={i * 0.08} />
              <Reveal delay={0.08 + i * 0.08} className="flex flex-1 flex-col gap-4 py-7 md:py-8">
                <span className="font-display text-[44px] font-bold leading-none tracking-[-0.02em] text-ink/15 md:text-[56px]">
                  {step.n}
                </span>
                <h3 className="mt-4 font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
                  {step.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-ink-soft md:text-[17px]">
                  {step.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
