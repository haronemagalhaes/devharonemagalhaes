"use client";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/site/eyebrow";
import { StudioButton } from "@/components/site/studio-button";
import { CornerMarks } from "@/components/site/corner-marks";
import { CONTACT_ID } from "@/lib/site";

const FEATURES = [
  "Agenda",
  "Financeiro",
  "Estoque",
  "Orçamentos",
  "Ponto da equipe",
  "Tarefas",
  "Acesso por papel",
  "Confirmação por WhatsApp",
];

/** Bloco curto de produto (SI-Agenda) — sem preço. */
export function ProductSection() {
  return (
    <section id="si-agenda" className="section-pad bg-ink text-bg" aria-labelledby="produto-title">
      <div className="container-studio">
        <div className="relative grid grid-cols-12 gap-x-6 gap-y-10 border border-bg/15 p-7 md:p-12 lg:p-16">
          <CornerMarks color="var(--bg)" size={16} inset={-1} className="opacity-60" />

          <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-7">
            <Eyebrow index="05" className="!text-bg/60">
              Produto
            </Eyebrow>
            <h2
              id="produto-title"
              className="font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.015em] sm:text-[32px] md:text-[40px]"
            >
              SI-Agenda — minha plataforma de gestão
            </h2>
            <p className="max-w-[560px] text-[17px] leading-relaxed text-bg/75 md:text-lg">
              Agenda, financeiro, estoque, orçamentos, ponto da equipe e tarefas
              num sistema só, multiempresa. Nasceu numa clínica; hoje se adapta a
              qualquer negócio de serviço.
            </p>
            <div className="mt-2">
              <StudioButton
                href={`#${CONTACT_ID}`}
                variant="secondary"
                className="!border-bg !text-bg hover:!bg-bg hover:!text-ink"
                arrow
              >
                Conhecer o SI-Agenda
              </StudioButton>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="col-span-12 lg:col-span-5">
            <ul className="grid grid-cols-2 gap-x-6" aria-label="Módulos">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="border-b border-bg/15 py-3 text-[15px] text-bg/85"
                >
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
