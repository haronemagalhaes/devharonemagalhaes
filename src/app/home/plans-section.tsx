"use client";

import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Rule } from "@/components/motion/rule";
import { SectionHeading } from "@/components/site/section-heading";
import { StudioButton } from "@/components/site/studio-button";
import { CONTACT_ID, CTA_PRIMARY } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * PENDÊNCIA — valores finais definidos pelo Harone antes de publicar.
 * Faixas de referência de mercado (não publicar sem confirmar):
 *   Essencial ............ R$ 3.500 – 6.000
 *   Presença Completa .... R$ 7.000 – 14.000
 *   Sob medida ........... sob projeto — típico R$ 15.000 a R$ 60.000+
 *   Manutenção ........... R$ 250 – 600/mês (site) · R$ 600 – 1.500/mês (com sistema)
 *   Tráfego avulso ....... setup a partir de R$ ___ + gestão mensal
 */
const PRICE_PLACEHOLDER = "R$ ___";

type Plan = {
  name: string;
  price: string;
  priceNote?: string;
  summary: string;
  items: string[];
  recommended?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Essencial",
    price: `a partir de ${PRICE_PLACEHOLDER}`,
    summary: "Pra empresa que precisa existir direito na internet, rápido.",
    items: [
      "Site institucional ou landing até 5 páginas",
      "Layout a partir de template próprio",
      "SEO local básico",
      "Formulário de contato + link na bio",
      "1 rodada de ajustes · ~2 semanas",
      "Escopo travado",
    ],
  },
  {
    name: "Presença Completa",
    price: `a partir de ${PRICE_PLACEHOLDER}`,
    summary: "Site, texto e anúncio trabalhando juntos pra trazer cliente.",
    recommended: true,
    items: [
      "Tudo do Essencial",
      "Páginas extras + copy trabalhada",
      "Tráfego pago: setup + 1º mês de gestão",
      "Página de conversão dedicada",
      "2 rodadas de ajustes",
    ],
  },
  {
    name: "Sob medida",
    price: "sob projeto",
    priceNote: `faixa típica a partir de ${PRICE_PLACEHOLDER}`,
    summary: "Sistema ou plataforma feita pra sua operação.",
    items: [
      "Levantamento da operação",
      "Sistema / plataforma sob medida",
      "Integrações com o que você já usa",
      "Treinamento da equipe",
    ],
  },
];

export function PlansSection() {
  return (
    <section id="planos" className="section-pad" aria-labelledby="planos-title">
      <div className="container-studio">
        <SectionHeading
          index="03"
          eyebrow="Planos"
          title="Planos"
          sub="Sempre com número na mesa. O valor final sai no diagnóstico, por escrito."
          id="planos-title"
        />

        <ul className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-3 md:gap-5">
          {PLANS.map((plan, i) => (
            <Reveal
              as="li"
              key={plan.name}
              delay={i * 0.08}
              className={cn(
                "relative flex flex-col rounded-[8px] border bg-surface p-7 md:p-8",
                plan.recommended ? "border-ink" : "border-line",
              )}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-7 rounded-full bg-ink px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-bg md:left-8">
                  Recomendado
                </span>
              )}
              <h3 className="font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-ink">
                {plan.name}
              </h3>
              <p className="mt-2 text-[15px] leading-snug text-ink-soft">
                {plan.summary}
              </p>

              <div className="mt-6 border-y border-line py-5">
                <p className="font-display text-[22px] font-bold tracking-[-0.02em] text-ink">
                  {plan.price}
                </p>
                {plan.priceNote && (
                  <p className="mt-1 text-[13px] text-ink-soft">{plan.priceNote}</p>
                )}
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                    <Check className="mt-[3px] h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-2 md:mt-auto md:pt-8">
                <StudioButton
                  href={`#${CONTACT_ID}`}
                  variant={plan.recommended ? "primary" : "secondary"}
                  className="w-full"
                >
                  {CTA_PRIMARY}
                </StudioButton>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* Manutenção — add-on que vale pros três */}
        <div className="mt-10 md:mt-12">
          <Rule />
          <Reveal className="grid grid-cols-12 gap-x-6 gap-y-2 py-6 md:py-7">
            <p className="eyebrow col-span-12 md:col-span-3">
              Manutenção · add-on
            </p>
            <p className="col-span-12 text-[16px] leading-relaxed text-ink md:col-span-6">
              Hospedagem, backup, ajustes e suporte. O projeto continua tendo
              dono depois do ar.
            </p>
            <p className="col-span-12 font-display text-[18px] font-bold tracking-[-0.02em] text-ink md:col-span-3 md:text-right">
              {PRICE_PLACEHOLDER}/mês
            </p>
          </Reveal>
          <Rule />
          <Reveal className="pt-6 text-[15px] text-ink-soft">
            <p>
              Tráfego pago avulso: setup a partir de {PRICE_PLACEHOLDER} + gestão
              mensal, verba de anúncio à parte.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
