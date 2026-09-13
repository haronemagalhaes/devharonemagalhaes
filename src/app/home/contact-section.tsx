"use client";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/site/eyebrow";
import { SocialLinks } from "@/components/site/social-links";
import { CONTACT_ID } from "@/lib/site";
import { ContactFormLoader } from "./contact-form-loader";

/**
 * Seção "Vamos conversar": título, texto e contatos renderizados no servidor;
 * o formulário em si (react-hook-form + zod) entra sob demanda.
 *
 * A coluna esquerda encerra nos três atalhos em ícone — as alternativas ao
 * formulário. Sem endereço por extenso e sem cidade: isso é fato de colofão e
 * vive no rodapé.
 *
 * `pb` menor que o `section-pad` padrão: com 140px embaixo + o topo do rodapé
 * sobrava um vão grande antes do fio.
 */
export function ContactSection() {
  return (
    <section
      id={CONTACT_ID}
      className="section-pad pb-16 md:pb-20 xl:pb-24"
      aria-labelledby="contato-title"
    >
      <div className="container-studio grid grid-cols-12 gap-x-6 gap-y-10">
        <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-5">
          <Eyebrow index="09">Contato</Eyebrow>
          <h2
            id="contato-title"
            className="font-display text-[30px] font-semibold leading-[1.2] tracking-[-0.015em] text-ink sm:text-[34px] md:text-[44px]"
          >
            Vamos conversar
          </h2>
          <p className="max-w-[420px] text-[17px] leading-relaxed text-ink-soft md:text-lg">
            Cinco perguntas rápidas. Com isso eu já chego na primeira conversa
            sabendo por onde começar.
          </p>
          <SocialLinks className="mt-1" />
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 lg:col-span-7">
          <ContactFormLoader />
        </Reveal>
      </div>
    </section>
  );
}
