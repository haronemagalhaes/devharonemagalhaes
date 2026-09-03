"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Rule } from "@/components/motion/rule";
import { SectionHeading } from "@/components/site/section-heading";

const FAQ = [
  {
    q: "Quanto tempo leva?",
    a: "Depende do escopo do projeto. Fecho o prazo com você na proposta, por escrito, antes de começar — e ele é cumprido.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Entrada + parcelas ao longo do projeto. Manutenção é mensal à parte.",
  },
  {
    q: "Você atende minha cidade?",
    a: "Atendo o Brasil todo, 100% online. Sou de Aracaju/SE.",
  },
  {
    q: "E depois que o site entra no ar?",
    a: "Tem plano de manutenção: hospedagem, ajustes e suporte. O projeto continua tendo dono.",
  },
  {
    q: "Quanto custa em média?",
    a: "Depende do escopo. Fecho o valor na proposta, por escrito, depois do diagnóstico.",
  },
  {
    q: "Trabalha com contrato?",
    a: "Sim. Escopo, prazo e valor por escrito antes de começar.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="section-pad" aria-labelledby="faq-title">
      <div className="container-studio grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 lg:col-span-4">
          <SectionHeading index="09" eyebrow="FAQ" title="Perguntas frequentes" id="faq-title" />
        </div>

        <Reveal className="col-span-12 lg:col-span-8">
          <Rule />
          <Accordion.Root type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <Accordion.Item key={i} value={`faq-${i}`} className="border-b border-line">
                <Accordion.Header asChild>
                  <h3 className="m-0">
                    <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink md:py-6 md:text-[20px]">
                      {item.q}
                      <Plus
                        aria-hidden
                        className="h-5 w-5 shrink-0 text-ink-soft transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=open]:rotate-45"
                      />
                    </Accordion.Trigger>
                  </h3>
                </Accordion.Header>
                <Accordion.Content className="acc-content overflow-hidden">
                  <p className="pb-6 pr-10 text-[16px] leading-relaxed text-ink-soft md:text-[17px]">
                    {item.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  );
}
