"use client";

import Image from "next/image";
import { m, } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/site/eyebrow";
import { CornerMarks } from "@/components/site/corner-marks";
import { StudioButton } from "@/components/site/studio-button";
import { EASE, VIEWPORT } from "@/lib/motion";
import { CONTACT_ID, CTA_PRIMARY } from "@/lib/site";
import Foto from "@/assets/eu.jpeg";

/** Único lugar em que o Harone aparece em primeira pessoa. */
export function AboutSection() {
  const reduced = useReducedMotion();
  return (
    <section id="sobre" className="section-pad bg-surface-2/60" aria-labelledby="sobre-title">
      <div className="container-studio grid grid-cols-12 items-center gap-x-6 gap-y-12">
        <m.div
          className="relative col-span-12 mx-auto w-full max-w-[380px] md:col-span-5 md:mx-0 md:max-w-none"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={reduced ? { duration: 0.2 } : { duration: 1.1, ease: EASE }}
        >
          <CornerMarks inset={12} color="var(--ink)" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-surface-2">
            <Image
              src={Foto}
              alt="Harone Magalhães, fundador do estúdio"
              fill
              placeholder="blur"
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover object-[center_20%]"
            />
          </div>
        </m.div>

        <Reveal className="col-span-12 flex flex-col gap-6 md:col-span-6 md:col-start-7">
          <Eyebrow index="07">Quem faz</Eyebrow>
          <h2
            id="sobre-title"
            className="font-display text-[28px] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[32px] md:text-[40px]"
          >
            Quem faz
          </h2>
          <p className="text-[18px] leading-relaxed text-ink md:text-[20px]">
            Sou o Harone Magalhães. Toco um estúdio especializado em site,
            sistema de gestão, tráfego pago e automação de processos para
            empresas — e conduzo cada projeto pessoalmente, do primeiro
            rascunho à manutenção. Aquela tarefa repetitiva que consome horas
            da sua equipe todo dia, eu transformo em rotina automática. Quem
            combina o escopo com você é quem faz o trabalho.
          </p>
          <p className="text-[0.85rem] leading-relaxed text-ink-soft">
            Harone Magalhães · Aracaju/SE · atende todo o Brasil
          </p>
          <div className="mt-2">
            <StudioButton href={`#${CONTACT_ID}`} arrow>
              {CTA_PRIMARY}
            </StudioButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
