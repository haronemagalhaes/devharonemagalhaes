/**
 * Constantes do site — um lugar só para contato, rótulos e navegação.
 */
import type { MouseEvent } from "react";

export const SITE_URL = "https://haronedev.com.br";
export const SITE_NAME = "Harone Magalhães";
export const SITE_DESCRIPTOR = "Estúdio de tecnologia e presença digital";

export const WHATSAPP_NUMBER = "5579981164388";
export const EMAIL = "haronemagalhaesdev@gmail.com";
export const INSTAGRAM_HANDLE = "@haronedev_";
export const INSTAGRAM_URL = "https://www.instagram.com/haronedev_";

export const CITY = "";
export const STATE = "";
/** Sinal de alcance — eyebrow do hero. A cidade fica fora do destaque. */
export const REACH = "Atendo todo o Brasil";
/** Origem, não limite — rodapé e contato. */
export const BASE_LINE = `${CITY}${STATE}Atende todo o Brasil`;

/**
 * CTA — regra global: um rótulo só no site.
 * Alternativas para testar:
 *   "Falar com o Harone"
 *   "Pedir meu diagnóstico"
 */
export const CTA_PRIMARY = "Começar meu projeto";
/**
 * Nome acessível do CTA primário. O botão deixou de ser âncora interna e
 * virou link externo: quem usa leitor de tela precisa ouvir que sai do site
 * pro WhatsApp e que abre em outra aba, coisas que "Começar meu projeto"
 * sozinho não diz.
 */
export const CTA_PRIMARY_ARIA = `${CTA_PRIMARY} — abre uma conversa no WhatsApp em nova aba`;
export const CTA_SECONDARY_WHATSAPP = "Chamar no WhatsApp";
export const CTA_WORK = "Ver o trabalho";

/** Âncora do formulário de contato. */
export const CONTACT_ID = "contato";

export const NAV_LINKS = [
  { label: "Capacidades", id: "capacidades" },
  { label: "Resultados", id: "resultados" },
  { label: "Trabalho", id: "trabalho" },
  { label: "Planos", id: "planos" },
  { label: "Contato", id: CONTACT_ID },
] as const;

/** wa.me sem texto. Constante, e não montada no render — ver `withGreeting`. */
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function whatsappUrl(message?: string) {
  if (!message) return WHATSAPP_BASE_URL;
  /* uma codificação só. encodeURIComponent no texto e mais nada em cima:
     codificar duas vezes faz o WhatsApp exibir "%20" e "%C3%A1" como texto. */
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá, Harone! Vim pelo site e quero conversar sobre um projeto.";

/**
 * Saudação pelo relógio de QUEM ACESSA (Date local do navegador).
 *   05:00–11:59 Bom dia · 12:00–17:59 Boa tarde · 18:00–04:59 Boa noite
 *
 * NUNCA chamar durante o render: o servidor renderiza com o relógio DELE
 * (UTC, na Vercel) e o cliente com o do visitante, então às 18h de Aracaju
 * o HTML do servidor viria "Boa noite" e o cliente diria "Boa noite" às 21h
 * UTC — texto diferente entre as duas passadas = erro de hidratação do
 * Next no console. Por isso a saudação só é calculada no `onClick`, o que
 * de quebra sempre usa a hora do momento do clique e não a do carregamento
 * (importante em aba aberta desde a tarde).
 */
export function greeting(now: Date = new Date()) {
  const h = now.getHours();
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

/** Mensagem dos CTAs "Começar meu projeto". */
export function startProjectMessage(now?: Date) {
  return `${greeting(now)}! Vim pelo site e quero começar um projeto.`;
}

/**
 * Handler de clique dos CTAs "Começar meu projeto".
 *
 * Reescreve o href do próprio <a> e DEIXA o navegador seguir o link (sem
 * preventDefault, sem window.open). O clique roda antes da ação padrão, e é
 * no href do momento da ação que o navegador navega — então o link sai com
 * a saudação certa. Fazendo assim, ctrl+clique, botão do meio, "abrir em
 * nova aba" pelo menu de contexto e o Enter do teclado continuam todos
 * funcionando, o que window.open quebraria; e nada de bloqueador de pop-up.
 *
 * O href estático (`WHATSAPP_BASE_URL`) é o piso: se o JS não rodar, o
 * botão ainda abre a conversa — só sem a saudação.
 */
export function withGreeting(e: MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.href = whatsappUrl(startProjectMessage());
}

/** Faixa de prova — números reais (atualizar à mão quando mudarem). */
export const PROJECTS_DELIVERED = 40;
export const CLIENTS_ACTIVE = 9;
/**
 * PENDÊNCIA — Harone confirma: 6 = Saúde, Moda, Jurídico, Comércio,
 * Serviços, Engenharia. O índice de trabalho (projects.ts) hoje lista 8
 * setores distintos (+ Indústria, Lazer).
 */
export const SECTORS_SERVED = 6;
