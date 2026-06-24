import type { Quote } from "./budget-types";

/** Separador visual entre blocos da mensagem. */
const DIVIDER = "------------------------------";

/**
 * Monta a mensagem de texto do WhatsApp (sem emojis, sem preços unitários).
 * Cada item fica em sua própria linha; as quebras (\n) viram %0A no encode
 * feito por buildWhatsappUrl. Uma linha em branco = %0A%0A.
 */
export function buildWhatsappMessage(quote: Quote): string {
  const linhas: string[] = [];

  // Saudação neutra (sem horário fixo, sem emoji)
  linhas.push("Olá! Segue meu orçamento:");
  linhas.push("");

  // Dados do cliente
  linhas.push(`*Cliente:* ${quote.name}`);
  linhas.push(`*Telefone:* ${quote.phone}`);
  linhas.push("");
  linhas.push(DIVIDER);

  // Um bloco por serviço escolhido
  quote.services.forEach((s) => {
    linhas.push("");
    linhas.push(`*${s.name}*${s.custom ? " (sob consulta)" : ""}`);

    if (s.included.length) {
      linhas.push("");
      linhas.push("*Inclusos no pacote:*");
      s.included.forEach((item) => linhas.push(`- ${item}`));
    }

    if (s.extras.length) {
      linhas.push("");
      linhas.push("*Extras escolhidos:*");
      s.extras.forEach((item) => linhas.push(`- ${item}`));
    }

    if (s.domain) {
      linhas.push("");
      linhas.push(`*${s.domain}*`);
    }

    linhas.push("");
    linhas.push(`*Observações:* ${s.freeText ? s.freeText : "Nenhuma"}`);

    if (s.notice) {
      linhas.push("");
      linhas.push(`*Importante:* ${s.notice}`);
    }

    if (s.plan) {
      linhas.push("");
      linhas.push(`*Plano mensal:* ${s.plan}`);
    }

    linhas.push("");
    linhas.push(DIVIDER);
  });

  // Fechamento
  linhas.push("");
  linhas.push(`*Estimativa inicial:* ${quote.totalLabel}`);
  linhas.push("");
  linhas.push(
    "O valor final pode variar conforme os itens extras selecionados. Confirmamos na conversa."
  );
  linhas.push("");
  linhas.push("Gostaria de finalizar este orçamento.");

  return linhas.join("\n");
}

/** Gera a URL wa.me já com o texto URL-encodado. */
export function buildWhatsappUrl(quote: Quote, phoneNumber: string): string {
  const texto = buildWhatsappMessage(quote);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(texto)}`;
}
