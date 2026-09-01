/**
 * Constantes do site — um lugar só para contato, rótulos e navegação.
 */
export const SITE_URL = "https://haronedev.com.br";
export const SITE_NAME = "Harone Magalhães";
export const SITE_DESCRIPTOR = "Estúdio de tecnologia e presença digital";

export const WHATSAPP_NUMBER = "5579981164388";
export const EMAIL = "haronemagalhaesdev@gmail.com";
export const INSTAGRAM_HANDLE = "@haronedev_";
export const INSTAGRAM_URL = "https://www.instagram.com/haronedev_";

export const CITY = "Aracaju";
export const STATE = "SE";
export const RESPONSE_TIME = "Resposta em até 1 dia útil";

/**
 * CTA — regra global: um rótulo só no site.
 * Alternativas para testar:
 *   "Falar com o Harone"
 *   "Pedir meu diagnóstico"
 */
export const CTA_PRIMARY = "Começar meu projeto";
export const CTA_SECONDARY_WHATSAPP = "Chamar no WhatsApp";
export const CTA_WORK = "Ver o trabalho";

/** Âncora do formulário de contato. */
export const CONTACT_ID = "contato";

export const NAV_LINKS = [
  { label: "Capacidades", id: "capacidades" },
  { label: "Trabalho", id: "trabalho" },
  { label: "Planos", id: "planos" },
  { label: "Contato", id: CONTACT_ID },
] as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá, Harone! Vim pelo site e quero conversar sobre um projeto.";
