// Tipos compartilhados entre a seção de orçamento, o gerador de PDF e o WhatsApp.

export type QuoteServiceLine = {
  /** Nome do serviço (ex.: "Link na Bio"). */
  name: string;
  /** true para "Sistema para Empresas" (sob consulta, sem valor). */
  custom: boolean;
  /** Itens inclusos no pacote (travados). */
  included: string[];
  /** Extras escolhidos pelo cliente (apenas rótulos, sem preço). */
  extras: string[];
  /** Texto livre digitado pelo cliente (pode ser ""). */
  freeText: string;
  /** Aviso obrigatório do serviço que deve constar no PDF/WhatsApp (ex.: Tráfego Pago). */
  notice?: string;
  /** Plano mensal escolhido para ESTE serviço (ex.: "Suporte Mensal (R$ 50/mês)"). */
  plan?: string;
  /** Domínio escolhido para ESTE serviço (texto já formatado, sem preço). */
  domain?: string;
};

export type Quote = {
  name: string;
  phone: string;
  /** Data já formatada em pt-BR (dd/mm/aaaa). */
  date: string;
  services: QuoteServiceLine[];
  /** Total já formatado: "A partir de R$ X" ou "Sob consulta". */
  totalLabel: string;
  /** Indica se há ao menos um serviço com valor (controla o destaque do total). */
  hasPriced: boolean;
};

/** Política de suporte — exibida no rodapé da seção e incluída no PDF. */
export const SUPPORT_POLICY: string[] = [
  "Garantia inicial: 7 dias após a entrega, bugs corrigidos sem custo.",
  "Pequenas alterações (inclusas no Suporte Mensal): trocar telefone, ajustar data, nome, endereço ou pequenos textos.",
  "Alterações maiores (à parte, a partir de R$ 50): nova página, nova seção, mudança de layout, novas funções.",
  "Site/sistema/automação fora do ar: diagnóstico + correção a partir de R$ 90, exceto se houver hospedagem ou suporte ativos.",
];

export const SITE_URL = "haronedev.com.br";
