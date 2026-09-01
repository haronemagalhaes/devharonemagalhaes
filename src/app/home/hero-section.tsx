"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TextReveal } from "@/components/motion/text-reveal";
import { StudioButton } from "@/components/site/studio-button";
import { Arc } from "@/components/site/arc";
import { EASE } from "@/lib/motion";
import { CONTACT_ID, CTA_PRIMARY, CTA_WORK } from "@/lib/site";

/*
 * H1 escolhido: "Tiro sua empresa do improviso digital"
 * Alternativas:
 *   - "Seu cliente te procura na internet. Ele te encontra?"
 *   - "Site, sistema e tráfego pago — com o dono à frente"
 *
 * Sub alternativa:
 *   - "Monto e integro site, sistema e anúncios pra você parar de depender do
 *      improviso — e de cinco fornecedores diferentes."
 *   - "Uma pessoa só cuidando da parte digital da sua empresa: da página que
 *      vende ao sistema que organiza os bastidores."
 */
const H1_LINES = ["Tiro sua empresa", "do improviso digital"];

const SUB =
  "Crio o site que traz cliente, o sistema que organiza a operação e as campanhas que fazem o telefone tocar — tudo integrado, com você falando direto comigo, não com um atendimento.";

export function HeroSection() {
  const reduced = useReducedMotion();
  const fade = (delay: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-var(--header-h))] items-center overflow-hidden pt-[var(--header-h)]"
      aria-labelledby="hero-title"
    >
      {/* Arco concêntrico ao fundo — --line, sem preenchimento */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[22vw] top-1/2 w-[78vw] -translate-y-1/2 md:-right-[14vw] md:w-[58vw] lg:-right-[10vw] lg:w-[52vw]"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduced ? { duration: 0.2 } : { duration: 1.6, ease: EASE }}
      >
        <Arc rings={7} className="h-auto w-full" />
      </motion.div>

      <div className="container-studio relative z-10 w-full py-16 md:py-24">
        <motion.p {...fade(0.05)} className="eyebrow max-w-[36ch] leading-relaxed sm:max-w-none">
          Estúdio de tecnologia e presença digital · Aracaju · Atendo todo o
          Brasil
        </motion.p>

        <h1
          id="hero-title"
          className="mt-7 font-display text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink sm:text-[44px] md:mt-8 md:text-[46px] lg:text-[62px] xl:text-[74px]"
        >
          <TextReveal lines={H1_LINES} delay={0.28} stagger={0.07} />
        </h1>

        <motion.p
          {...fade(0.75)}
          className="mt-7 max-w-[560px] text-[18px] leading-[1.55] text-ink-soft md:mt-9 md:text-[21px]"
        >
          {SUB}
        </motion.p>

        <motion.div
          {...fade(0.9)}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-11"
        >
          <StudioButton href={`#${CONTACT_ID}`} size="lg" arrow>
            {CTA_PRIMARY}
          </StudioButton>
          <StudioButton href="#trabalho" variant="secondary" size="lg">
            {CTA_WORK}
          </StudioButton>
        </motion.div>
      </div>

      {/* fio inferior */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
        initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
        animate={reduced ? { opacity: 1 } : { scaleX: 1 }}
        transition={reduced ? { duration: 0.2 } : { duration: 1.2, delay: 0.6, ease: EASE }}
      />
    </section>
  );
}
