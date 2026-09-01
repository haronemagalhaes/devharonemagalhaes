"use client";

import { Reveal } from "@/components/motion/reveal";
import { Rule } from "@/components/motion/rule";
import { SectionHeading } from "@/components/site/section-heading";

const ITEMS = [
  {
    n: "01",
    title: "Sites & Landing Pages",
    text: "Site institucional, landing de campanha, página de captação e link na bio. Rápido de carregar, fácil de achar no Google e feito pra transformar visita em contato.",
  },
  {
    n: "02",
    title: "Sistemas & Plataformas",
    text: (
      <>
        Sistema de gestão sob medida pra sua operação: agenda, financeiro,
        estoque, orçamentos, ordens de serviço, painéis. Ou o{" "}
        <strong className="font-medium text-ink">SI-Agenda</strong>, minha
        plataforma pronta pra adaptar ao seu negócio.
      </>
    ),
  },
  {
    n: "03",
    title: "Automação",
    text: "Confirmação e lembrete por WhatsApp, integração entre as ferramentas que você já usa, relatório que chega pronto. O trabalho repetitivo sai da sua mão.",
  },
  {
    n: "04",
    title: "Tráfego Pago",
    text: "Campanha no Google e no Meta ligada a uma página feita pra converter. Você acompanha quanto entrou, quanto custou e o que virou cliente.",
  },
];

export function CapabilitiesSection() {
  return (
    <section id="capacidades" className="section-pad" aria-labelledby="capacidades-title">
      <div className="container-studio">
        <SectionHeading
          index="01"
          eyebrow="Capacidades"
          title="O que eu faço"
          sub="Quatro frentes, um só responsável — do primeiro rascunho à manutenção."
          id="capacidades-title"
        />

        <ul className="mt-14 md:mt-20">
          <li aria-hidden>
            <Rule />
          </li>
          {ITEMS.map((item, i) => (
            <li key={item.n} className="group">
              <Reveal
                delay={0.05}
                className="grid grid-cols-12 gap-x-6 gap-y-3 py-8 md:py-10"
              >
                <span className="eyebrow col-span-12 tabular-nums transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:col-span-1">
                  {item.n}
                </span>
                <h3 className="col-span-12 font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:col-span-4 md:text-[26px]">
                  {item.title}
                </h3>
                <p className="col-span-12 text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:text-lg">
                  {item.text}
                </p>
              </Reveal>
              <Rule delay={0.1 + i * 0.05} />
            </li>
          ))}
        </ul>

        <Reveal className="mt-8 text-[15px] text-ink-soft md:mt-10">
          <p>
            Precisa de identidade visual, design ou vídeo pro projeto?{" "}
            <span className="text-ink">Faço também.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
