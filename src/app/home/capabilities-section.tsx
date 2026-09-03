"use client";

import { Reveal } from "@/components/motion/reveal";
import { Rule } from "@/components/motion/rule";
import { SectionHeading } from "@/components/site/section-heading";

type Item = { n: string; title: string; text: React.ReactNode };
type Group = { label: string; items: Item[] };

/*
 * Duas metades da promessa do H1: cada rótulo de grupo é um dos dois arcos.
 * Só o título, sem frase de apoio — os cards já explicam. Os rótulos são o
 * que dá peso estrutural à segunda metade; sem eles a promessa vira
 * retórica. A numeração 01–04 é contínua. Ordem frente → trás, igual ao sub.
 */
const GROUPS: Group[] = [
  {
    label: "Traz mais cliente",
    items: [
      {
        n: "01",
        title: "Sites & Landing Pages",
        text: "Site institucional, landing de campanha, página de captação e link na bio. Rápido de carregar, fácil de achar no Google e feito pra transformar visita em contato.",
      },
      {
        n: "02",
        title: "Tráfego Pago",
        text: "Campanha no Google e no Meta ligada a uma página feita pra converter. Você acompanha quanto entrou, quanto custou e o que virou cliente.",
      },
    ],
  },
  {
    label: "Sai da planilha",
    items: [
      {
        n: "03",
        title: "Sistemas & Plataformas",
        text: (
          <>
            Sistema de gestão feito pra sua operação, no lugar da planilha:
            agenda, financeiro, estoque, orçamentos, ordens de serviço,
            painéis. Ou o{" "}
            <strong className="font-medium text-ink">SI-Agenda</strong>, minha
            plataforma pronta pra adaptar ao seu negócio.
          </>
        ),
      },
      {
        n: "04",
        title: "Automação",
        text: "Confirmação e lembrete por WhatsApp, integração entre as ferramentas que você já usa, relatório que chega pronto. O trabalho repetitivo sai da sua mão.",
      },
    ],
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
          sub="Da planilha pra frente do cliente, em quatro frentes. Um responsável, do primeiro rascunho à manutenção."
          id="capacidades-title"
        />

        <div className="mt-14 md:mt-20">
          {GROUPS.map((group, g) => (
            <div key={group.label} className={g > 0 ? "mt-14 md:mt-20" : undefined}>
              {/* cabeçalho do grupo: só o rótulo */}
              <Reveal as="header" className="pb-4 md:pb-5">
                <h3 className="eyebrow">{group.label}</h3>
              </Reveal>

              <ul>
                <li aria-hidden>
                  <Rule />
                </li>
                {group.items.map((item, i) => (
                  <li key={item.n} className="group">
                    <Reveal
                      delay={0.05}
                      className="grid grid-cols-12 gap-x-6 gap-y-3 py-8 md:py-10"
                    >
                      <span className="eyebrow col-span-12 tabular-nums transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:col-span-1">
                        {item.n}
                      </span>
                      <h4 className="col-span-12 font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink md:col-span-4 md:text-[26px]">
                        {item.title}
                      </h4>
                      <p className="col-span-12 text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:text-lg">
                        {item.text}
                      </p>
                    </Reveal>
                    <Rule delay={0.1 + i * 0.05} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

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
