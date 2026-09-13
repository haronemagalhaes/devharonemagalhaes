import { Instagram, Mail, MessageCircle } from "lucide-react";
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const WHATSAPP_LABEL = "+55 79 98116-4388";

/**
 * Botões de contato em ícone — 40px, contorno que preenche no hover.
 * Só o que existe de verdade: e-mail, WhatsApp e Instagram.
 *
 * O ícone é `aria-hidden`; o nome acessível vem do `aria-label`, que carrega
 * o endereço/número por extenso — quem usa leitor de tela ouve "Instagram
 * @haronedev_", não "instagram".
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <SocialLink
        icon={Mail}
        href={`mailto:${EMAIL}`}
        label={`E-mail ${EMAIL}`}
        external={false}
      />
      <SocialLink
        icon={MessageCircle}
        href={whatsappUrl()}
        label={`WhatsApp ${WHATSAPP_LABEL}`}
      />
      <SocialLink
        icon={Instagram}
        href={INSTAGRAM_URL}
        label={`Instagram ${INSTAGRAM_HANDLE}`}
      />
    </div>
  );
}

function SocialLink({
  icon: Icon,
  href,
  label,
  external = true,
}: {
  icon: typeof Mail;
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/50 text-ink transition-colors duration-300 hover:bg-ink hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <Icon aria-hidden className="h-[18px] w-[18px]" />
    </a>
  );
}
