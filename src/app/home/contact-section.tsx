"use client";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/site/eyebrow";
import { CONTACT_ID, EMAIL, RESPONSE_TIME, whatsappUrl } from "@/lib/site";
import { ContactFormLoader } from "./contact-form-loader";

/**
 * Seção "Vamos conversar": título, texto e contatos renderizados no servidor;
 * o formulário em si (react-hook-form + zod) entra sob demanda.
 */
export function ContactSection() {
  return (
    <section id={CONTACT_ID} className="section-pad" aria-labelledby="contato-title">
      <div className="container-studio grid grid-cols-12 gap-x-6 gap-y-12">
        <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-5">
          <Eyebrow index="09">Contato</Eyebrow>
          <h2
            id="contato-title"
            className="font-display text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[34px] md:text-[44px]"
          >
            Vamos conversar
          </h2>
          <p className="max-w-[420px] text-[17px] leading-relaxed text-ink-soft md:text-lg">
            Cinco perguntas rápidas. Com isso eu já chego na primeira conversa
            sabendo por onde começar.
          </p>
          <dl className="mt-4 flex flex-col gap-3 text-[15px]">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-soft">E-mail</dt>
              <dd>
                <a href={`mailto:${EMAIL}`} className="link-line text-ink">
                  {EMAIL}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-soft">WhatsApp</dt>
              <dd>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-ink"
                >
                  +55 79 98116-4388
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-soft">Prazo</dt>
              <dd className="text-ink">{RESPONSE_TIME}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 lg:col-span-7">
          <ContactFormLoader />
        </Reveal>
      </div>
    </section>
  );
}
