"use client";

import { Reveal } from "@/components/motion/reveal";
import { Rule } from "@/components/motion/rule";
import { StudioButton } from "@/components/site/studio-button";
import {
  CONTACT_ID,
  CTA_PRIMARY,
  CTA_SECONDARY_WHATSAPP,
  WHATSAPP_DEFAULT_MESSAGE,
  whatsappUrl,
} from "@/lib/site";

export function FinalCtaSection() {
  return (
    <section className="container-studio" aria-labelledby="cta-title">
      <Rule />
      <Reveal className="grid grid-cols-12 gap-x-6 gap-y-8 py-20 md:py-28">
        <div className="col-span-12 lg:col-span-8">
          <h2
            id="cta-title"
            className="max-w-[16ch] font-display text-[32px] font-semibold leading-[1.2] tracking-[-0.015em] text-ink sm:text-[40px] md:text-[52px]"
          >
            Sua parte digital resolvida com uma conversa
          </h2>
          <p className="mt-5 max-w-[480px] text-[18px] leading-relaxed text-ink-soft md:text-[20px]">
            Me conta o que está travando.
          </p>
        </div>
        <div className="col-span-12 flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:ml-auto lg:w-[280px] lg:flex-col lg:items-stretch lg:justify-end">
          <StudioButton href={`#${CONTACT_ID}`} size="lg" arrow>
            {CTA_PRIMARY}
          </StudioButton>
          <StudioButton
            href={whatsappUrl(WHATSAPP_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="lg"
          >
            {CTA_SECONDARY_WHATSAPP}
          </StudioButton>
        </div>
      </Reveal>
      <Rule />
    </section>
  );
}
