"use client";

import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/site/magnetic-button";
import {
  CTA_PRIMARY,
  CTA_PRIMARY_ARIA,
  WHATSAPP_BASE_URL,
  withGreeting,
} from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * CTA "Começar meu projeto" da capa 1 — pílula sólida, magnética, agora
 * abrindo o WhatsApp em vez de rolar pro formulário.
 *
 * Por que este arquivo existe: o hero (hero-aurora.tsx) é server component, e
 * função não atravessa a fronteira servidor → cliente. O `onClick` que monta
 * a saudação precisa nascer no cliente, então o botão inteiro vira um
 * componente cliente e o hero só o coloca no lugar.
 */
export function StartProjectCta({ className }: { className?: string }) {
  return (
    <MagneticButton
      href={WHATSAPP_BASE_URL}
      target="_blank"
      rel="noopener noreferrer"
      ariaLabel={CTA_PRIMARY_ARIA}
      onClick={withGreeting}
      className={cn(
        /* largura pelo conteúdo em qualquer tamanho. O `w-full sm:w-auto` que
         estava aqui só valia abaixo de 640px, e era o que fazia o CTA ir de
         borda a borda no telefone — pílula da largura da tela lê como barra
         de sistema, não como botão. O px-8 é o mesmo do desktop. */
      "inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-medium text-bg shadow-[0_12px_32px_-12px_color-mix(in_oklch,var(--ink)_45%,transparent)] transition-colors duration-300 hover:bg-ink/90",
        className,
      )}
    >
      {CTA_PRIMARY}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </MagneticButton>
  );
}
