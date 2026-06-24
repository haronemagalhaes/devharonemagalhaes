"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Link2,
  LayoutTemplate,
  Building2,
  Images,
  Bot,
  Boxes,
  PenTool,
  Clapperboard,
  Megaphone,
  Lock,
  AlertTriangle,
  FileDown,
  MessageCircle,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentMethods } from "@/components/payment-methods";

import { generateBudgetPdf } from "@/lib/budget-pdf";
import { buildWhatsappUrl } from "@/lib/budget-whatsapp";
import { SUPPORT_POLICY, type Quote } from "@/lib/budget-types";

/* ==========================================================================
 *  CONFIGURAÇÃO  —  edite valores/itens aqui.
 *  Apenas o VALOR BASE de cada serviço é usado no total visível.
 *  Os EXTRAS não têm preço: são só registrados para o PDF/WhatsApp.
 * ======================================================================== */

/** Seu número de WhatsApp (formato internacional, só dígitos). */
const MEU_WHATSAPP = "5579981164388";

/** Aviso fixo exibido sempre abaixo do valor (tela). */
const PRICE_NOTICE =
  "O valor final pode variar conforme os itens extras selecionados. Confirmamos o valor final na conversa.";

type ServiceExtra = {
  id: string;
  label: string;
  /**
   * Preço de referência APENAS para o seu controle interno no código.
   * NUNCA é somado ao total nem exibido na UI/PDF/WhatsApp.
   */
  price?: number;
  /** Texto informativo exibido abaixo do item (não soma valor). */
  info?: string;
  /** Link opcional exibido junto ao texto informativo. */
  link?: { label: string; href: string };
  /** Rótulo alternativo usado no PDF/WhatsApp quando marcado. */
  docLabel?: string;
};

/* ---- Planos mensais (por serviço). Os valores PODEM aparecer na UI. ---- */
type PlanOption = {
  id: string;
  /** Título no seletor (pode conter o valor). */
  title: string;
  /** Texto de apoio abaixo do título. */
  detail: string;
  /** Rótulo curto usado no PDF/WhatsApp (ex.: "Suporte Mensal (R$ 50/mês)"). */
  docLabel: string;
};

type PlanGroup = {
  /** Texto explicativo curto acima do seletor. */
  intro: string;
  options: PlanOption[];
};

/** Planos para serviços de SITE (Link na Bio, Landing, Institucional, Portfólio). */
const SITE_PLAN: PlanGroup = {
  intro:
    "Hospedagem e suporte são serviços recorrentes — pagos todo mês (ou todo ano), enquanto seu site estiver no ar. Não é cobrança única: é o que mantém seu site funcionando, seguro e atualizado. Quem assina o Suporte Mensal não paga a hospedagem separada, já vem inclusa.",
  options: [
    {
      id: "nenhum",
      title: "Nenhum por enquanto",
      detail:
        "Decido depois, na conversa. Todo site no ar precisa de hospedagem, então acertamos isso junto.",
      docLabel: "Nenhum por enquanto",
    },
    {
      id: "hospedagem",
      title:
        "Hospedagem — R$ 20/mês (ou R$ 180/ano — economize pagando à vista)",
      detail:
        "Mantém seu site no ar, com certificado de segurança (SSL) e suporte básico. Alterações cobradas à parte. Cobrança recorrente (mensal ou anual).",
      docLabel: "Hospedagem — R$ 20/mês ou R$ 180/ano (recorrente)",
    },
    {
      id: "suporte",
      title: "Suporte Mensal — R$ 50/mês",
      detail:
        "Tudo da hospedagem + pequenas alterações (trocar telefone, foto, texto) + prioridade no atendimento + monitoramento. Cobrança recorrente mensal.",
      docLabel: "Suporte Mensal — R$ 50/mês (recorrente)",
    },
  ],
};

/** Planos para AUTOMAÇÃO de tarefas (sem hospedagem de site). */
const AUTOMACAO_PLAN: PlanGroup = {
  intro:
    "Mantenha sua automação funcionando sem dor de cabeça. Escolha como cuidar dela depois da entrega.",
  options: [
    {
      id: "nenhum",
      title: "Nenhum por enquanto",
      detail: "Decido depois, na conversa.",
      docLabel: "Nenhum por enquanto",
    },
    {
      id: "suporte-automacao",
      title: "Suporte de Automação — R$ 100/mês",
      detail:
        "Se a automação parar de funcionar, conserto sem cobrar taxa avulsa. Cobrança recorrente mensal.",
      docLabel: "Suporte de Automação — R$ 100/mês (recorrente)",
    },
  ],
};

/* ---- Domínio (seletor para serviços de site). NUNCA soma valor. ---- */
type DomainOption = {
  id: string;
  title: string;
  detail: string;
  /** Rótulo exato usado no PDF/WhatsApp quando escolhido. */
  docLabel: string;
  /** Link opcional (ex.: registro.br) exibido quando esta opção é escolhida. */
  link?: { label: string; href: string };
  /** Mensagem de apoio exibida quando esta opção é escolhida. */
  note?: string;
};

const SITE_DOMAIN: DomainOption[] = [
  {
    id: "gratuito",
    title: "Domínio gratuito",
    detail:
      "Endereço genérico com o seu nome, empresa ou estabelecimento (ex: seunome.site), gerado sem custo. Menos formal que um .com.br, mas funcional.",
    docLabel: "Domínio: gratuito (endereço genérico)",
  },
  {
    id: "proprio",
    title: "Domínio próprio (.com.br)",
    detail:
      "Endereço profissional com o seu nome (ex: suaempresa.com.br). Passa mais credibilidade. Contratado direto por você no Registro.br, com valor conforme o período (1, 2 ou mais anos).",
    docLabel:
      "Domínio próprio .com.br (contratado pelo cliente no Registro.br)",
    link: { label: "Consultar no registro.br", href: "https://registro.br/" },
    note: "Se você tiver dificuldade para cadastrar o domínio, eu te ajudo no processo — é só me chamar.",
  },
];

type ServiceConfig = {
  id: string;
  name: string;
  icon: LucideIcon;
  /** Valor base ("a partir de"). null = sob consulta (não soma). */
  base: number | null;
  /** Sistema sob medida: sem valor base, só campo livre obrigatório. */
  custom?: boolean;
  blurb: string;
  included: string[];
  extras: ServiceExtra[];
  notice?: string;
  /** Quando true, o aviso (notice) também vai para o PDF e o WhatsApp. */
  noticeInDoc?: boolean;
  /** Seletor de plano mensal exibido dentro do serviço (opcional). */
  planGroup?: PlanGroup;
  /** Seletor de domínio (gratuito x próprio). Não soma valor. */
  domainOptions?: DomainOption[];
  freeLabel: string;
  freeRequired?: boolean;
};

/* ---- GRUPO 1: Desenvolvimento ---- */
const DEV_SERVICES: ServiceConfig[] = [
  {
    id: "link-bio",
    name: "Link na Bio",
    icon: Link2,
    base: 150,
    blurb:
      "Link único da bio do Instagram/TikTok que reúne WhatsApp, redes, catálogo e localização.",
    included: [
      "Layout personalizado",
      "Botões de redes sociais",
      "Botão de WhatsApp",
      "Foto/logo + bio",
      "Responsivo (celular)",
      "Mapa de localização",
    ],
    extras: [
      { id: "analytics", label: "Google Analytics", price: 90 },
      { id: "cliques", label: "Rastreamento de cliques", price: 60 },
      { id: "catalogo", label: "Mini catálogo" },
      { id: "animacoes", label: "Animações" },
    ],
    planGroup: SITE_PLAN,
    domainOptions: SITE_DOMAIN,
    freeLabel: "Quer algo que não está na lista? Escreva aqui:",
  },
  {
    id: "landing",
    name: "Landing Page",
    icon: LayoutTemplate,
    base: 600,
    blurb:
      "Página única feita para vender ou captar contatos, ideal para anúncios.",
    included: [
      "Design orientado a conversão",
      "Seção de apresentação + chamada para ação",
      "WhatsApp/formulário",
      "Responsivo",
      "Otimização de carregamento",
      "Mapa de localização",
    ],
    extras: [
      { id: "leads", label: "Captura de leads por e-mail" },
      { id: "analytics", label: "Google Analytics", price: 90 },
      { id: "seo", label: "SEO básico" },
      { id: "depoimentos", label: "Depoimentos/portfólio" },
      { id: "pixel", label: "Pixel Meta/Google", price: 120 },
      { id: "copy", label: "Copywriting de venda" },
    ],
    planGroup: SITE_PLAN,
    domainOptions: SITE_DOMAIN,
    freeLabel: "Quer algo que não está na lista? Escreva aqui:",
  },
  {
    id: "institucional",
    name: "Site Institucional",
    icon: Building2,
    base: 1000,
    blurb:
      "Cartão de visitas digital da empresa, passa credibilidade no Google. Até 5 páginas.",
    included: [
      "Até 5 páginas",
      "Design profissional",
      "Menu de navegação",
      "WhatsApp/formulário",
      "Responsivo",
      "Mapa de localização",
    ],
    extras: [
      { id: "pagina", label: "Página adicional" },
      { id: "blog", label: "Blog" },
      { id: "seo", label: "SEO básico" },
      { id: "analytics", label: "Google Analytics", price: 90 },
      { id: "galeria", label: "Galeria/portfólio" },
      { id: "catalogo", label: "Catálogo de produtos" },
      { id: "idiomas", label: "Múltiplos idiomas" },
    ],
    planGroup: SITE_PLAN,
    domainOptions: SITE_DOMAIN,
    freeLabel: "Quer algo que não está na lista? Escreva aqui:",
  },
  {
    id: "portfolio",
    name: "Portfólio",
    icon: Images,
    base: 700,
    blurb:
      "Vitrine de trabalhos para fotógrafos, designers, arquitetos, artistas etc.",
    included: [
      "Galeria organizada",
      'Página "Sobre"',
      "Contato + redes",
      "Responsivo",
      "Design da identidade",
      "Mapa de localização",
    ],
    extras: [
      { id: "filtros", label: "Filtros por categoria" },
      { id: "modal", label: "Modal de detalhe" },
      { id: "instagram", label: "Integração com Instagram" },
      { id: "seo", label: "SEO básico" },
      { id: "depoimentos", label: "Depoimentos" },
    ],
    planGroup: SITE_PLAN,
    domainOptions: SITE_DOMAIN,
    freeLabel: "Quer algo que não está na lista? Escreva aqui:",
  },
  {
    id: "automacao",
    name: "Automação de Tarefas",
    icon: Bot,
    base: null,
    custom: true,
    blurb:
      "Faz o computador executar tarefas repetitivas sozinho (mensagens, planilhas, relatórios). Orçado sob consulta.",
    included: [
      "Levantamento do processo",
      "1 fluxo de automação configurado",
      "Testes e ajustes",
    ],
    extras: [
      { id: "fluxo", label: "Fluxo adicional" },
      { id: "planilhas", label: "Integração com planilhas" },
      { id: "resposta", label: "Resposta automática WhatsApp/e-mail" },
      { id: "api", label: "Integração com API externa" },
      { id: "relatorios", label: "Relatórios automáticos" },
    ],
    notice:
      "A automação precisa de uma infraestrutura própria para rodar, paga pelo cliente.",
    planGroup: AUTOMACAO_PLAN,
    freeLabel: "Descreva o que você precisa automatizar:",
    freeRequired: true,
  },
  {
    id: "sistema",
    name: "Sistema para Empresas",
    icon: Boxes,
    base: null,
    custom: true,
    blurb:
      "Sistema sob medida (estoque, agendamento, cadastro, painel, login etc.). Orçado sob consulta.",
    included: [],
    extras: [],
    freeLabel: "Descreva o que você precisa:",
    freeRequired: true,
  },
];

/* ---- GRUPO 2: Outros serviços (sob consulta, só no orçamento) ---- */
const CONSULT_SERVICES: ServiceConfig[] = [
  {
    id: "design",
    name: "Design Gráfico",
    icon: PenTool,
    base: null,
    custom: true,
    blurb:
      "Criação de artes visuais — posts para redes, banners, criativos de anúncio, flyers, cardápios, logo e identidade visual. Deixa a marca profissional e consistente.",
    included: [],
    extras: [],
    freeLabel: "Descreva o que você precisa:",
    freeRequired: true,
  },
  {
    id: "video",
    name: "Edição de Vídeo & Motion",
    icon: Clapperboard,
    base: null,
    custom: true,
    blurb:
      "Criação e edição de vídeos para redes e anúncios — Reels, vídeos curtos, criativos de campanha, cortes, legendas, música e animações (logo animada, textos em movimento, efeitos). Vídeo é o que mais engaja e vende.",
    included: [],
    extras: [],
    freeLabel: "Descreva o que você precisa:",
    freeRequired: true,
  },
  {
    id: "trafego",
    name: "Tráfego Pago (Google Ads e Meta)",
    icon: Megaphone,
    base: null,
    custom: true,
    blurb:
      "Gestão de anúncios no Google e Instagram/Facebook para atrair mais clientes — criação, segmentação e otimização das campanhas.",
    included: [],
    extras: [],
    notice:
      "A verba investida nos anúncios (valor que vai para o Google/Meta) é paga separadamente, direto na plataforma, e NÃO está inclusa no valor da gestão.",
    noticeInDoc: true,
    freeLabel: "Descreva o que você precisa:",
    freeRequired: true,
  },
];

/** Todos os serviços (usado na lógica de total, seleção e geração). */
const SERVICES: ServiceConfig[] = [...DEV_SERVICES, ...CONSULT_SERVICES];

/** Grupos exibidos na UI, cada um com seu título/divisória. */
const GROUPS: { title: string; subtitle?: string; services: ServiceConfig[] }[] =
  [
    { title: "Desenvolvimento", services: DEV_SERVICES },
    {
      title: "Outros serviços — sob consulta",
      subtitle: "Orçados sob medida; entram no pedido sem valor na soma.",
      services: CONSULT_SERVICES,
    },
  ];

/* ==========================================================================
 *  HELPERS
 * ======================================================================== */

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(v);

const extraKey = (serviceId: string, extraId: string) =>
  `${serviceId}::${extraId}`;

/** Fisher-Yates — devolve uma nova lista embaralhada. */
function shuffle<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ==========================================================================
 *  COMPONENTE
 * ======================================================================== */

export function BudgetSection() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [checkedExtras, setCheckedExtras] = useState<Record<string, boolean>>(
    {}
  );
  const [freeText, setFreeText] = useState<Record<string, string>>({});
  /** Plano mensal escolhido por serviço (id da PlanOption). Default: "nenhum". */
  const [plans, setPlans] = useState<Record<string, string>>({});
  /** Domínio escolhido por serviço (id da DomainOption). Opcional. */
  const [domains, setDomains] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Ordem dos extras: começa igual à config (SSR == 1º render do client) e é
  // embaralhada depois da montagem, evitando erro de hidratação.
  const [extrasOrder, setExtrasOrder] = useState<
    Record<string, ServiceExtra[]>
  >(() => Object.fromEntries(SERVICES.map((s) => [s.id, s.extras])));

  useEffect(() => {
    setExtrasOrder(
      Object.fromEntries(SERVICES.map((s) => [s.id, shuffle(s.extras)]))
    );
  }, []);

  const selectedServices = useMemo(
    () => SERVICES.filter((s) => selected[s.id]),
    [selected]
  );

  /** Total VISÍVEL: soma apenas os valores base (extras nunca entram). */
  const totalBase = useMemo(
    () =>
      selectedServices.reduce((sum, s) => sum + (s.base != null ? s.base : 0), 0),
    [selectedServices]
  );

  const hasPriced = selectedServices.some((s) => s.base != null);
  const hasCustom = selectedServices.some((s) => s.custom);

  const totalLabel = useMemo(() => {
    if (hasPriced) return `A partir de ${brl(totalBase)}`;
    if (hasCustom) return "Sob consulta";
    return brl(0);
  }, [hasPriced, hasCustom, totalBase]);

  // ---- validação ----
  const nameOk = nome.trim().length > 0;
  const phoneOk = telefone.replace(/\D/g, "").length >= 8;
  const hasSelection = selectedServices.length > 0;
  const customMissing = selectedServices.some(
    (s) => s.freeRequired && !freeText[s.id]?.trim()
  );
  const canSubmit = nameOk && phoneOk && hasSelection && !customMissing;

  // ---- toggles ----
  const toggleService = (id: string) =>
    setSelected((p) => ({ ...p, [id]: !p[id] }));

  const toggleExtra = (serviceId: string, extraId: string) =>
    setCheckedExtras((p) => {
      const k = extraKey(serviceId, extraId);
      return { ...p, [k]: !p[k] };
    });

  // ---- monta o objeto Quote (sem preços de extras) ----
  const buildQuote = (): Quote => {
    const date = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    }).format(new Date());

    const services = selectedServices.map((s) => {
      const chosenPlanId = plans[s.id] ?? "nenhum";
      const planOption = s.planGroup?.options.find(
        (o) => o.id === chosenPlanId
      );
      const domainOption = s.domainOptions?.find(
        (o) => o.id === domains[s.id]
      );
      return {
        name: s.name,
        custom: !!s.custom,
        included: s.included,
        extras: s.extras
          .filter((e) => checkedExtras[extraKey(s.id, e.id)])
          .map((e) => e.docLabel ?? e.label),
        freeText: freeText[s.id]?.trim() ?? "",
        notice: s.noticeInDoc ? s.notice : undefined,
        plan: planOption ? planOption.docLabel : undefined,
        domain: domainOption ? domainOption.docLabel : undefined,
      };
    });

    return {
      name: nome.trim(),
      phone: telefone.trim(),
      date,
      services,
      totalLabel,
      hasPriced,
    };
  };

  // ---- ação principal: PDF + WhatsApp ----
  const handleGenerate = async () => {
    setSubmitted(true);
    if (!canSubmit || generating) return;

    const quote = buildQuote();

    // Abre o WhatsApp dentro do gesto do clique (evita bloqueio de pop-up).
    window.open(
      buildWhatsappUrl(quote, MEU_WHATSAPP),
      "_blank",
      "noopener,noreferrer"
    );

    try {
      setGenerating(true);
      await generateBudgetPdf(quote);
    } catch (err) {
      console.error("Falha ao gerar PDF:", err);
    } finally {
      setGenerating(false);
    }
  };

  const baseLabel = (s: ServiceConfig) =>
    s.base != null ? `A partir de ${brl(s.base)}` : "Sob consulta";

  const checkboxAccent =
    "border-white/25 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-white focus-visible:ring-cyan-400/40";

  const inputAccent =
    "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/30";

  return (
    <section id="orcamento" className="relative py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Cabeçalho da seção */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14 text-center"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">
            Monte seu orçamento
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-white/70 text-sm md:text-base leading-relaxed">
            Escolha os serviços e marque o que precisa. Você vê o valor base
            &ldquo;a partir de&rdquo; — o valor final é confirmado na conversa.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* ===================== COLUNA: SERVIÇOS ===================== */}
          <div className="order-2 lg:order-1 space-y-4">
            {GROUPS.map((group) => (
              <div key={group.title} className="space-y-4">
                {/* Título/divisória do grupo */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                    {group.title}
                  </h3>
                  {group.subtitle && (
                    <p className="mt-1 text-xs text-white/50">
                      {group.subtitle}
                    </p>
                  )}
                  <div className="mt-2 h-px w-full bg-gradient-to-r from-cyan-500/40 to-transparent" />
                </div>

                {group.services.map((service) => {
                  const isOpen = !!selected[service.id];
                  const Icon = service.icon;
                  const panelId = `servico-${service.id}`;

                  return (
                <div
                  key={service.id}
                  className={[
                    "overflow-hidden rounded-2xl border bg-white/[0.03] backdrop-blur-xl transition-colors",
                    isOpen
                      ? "border-cyan-500/40"
                      : "border-white/10 hover:border-white/20",
                  ].join(" ")}
                >
                  {/* Cabeçalho do card (botão de seleção/expansão) */}
                  <button
                    type="button"
                    onClick={() => toggleService(service.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-4 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                  >
                    <span
                      className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors",
                        isOpen
                          ? "bg-cyan-500/15 ring-cyan-400/30"
                          : "bg-black/30 ring-white/10",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-2">
                        <span className="text-base md:text-lg font-semibold text-white">
                          {service.name}
                        </span>
                        {service.custom && (
                          <span className="shrink-0 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] leading-none text-white/60">
                            sob consulta
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-white/60">
                        {service.blurb}
                      </span>
                    </span>

                    <span
                      className={[
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all",
                        isOpen
                          ? "rotate-180 border-cyan-400/40 text-cyan-300"
                          : "border-white/15 text-white/50",
                      ].join(" ")}
                      aria-hidden
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {/* Corpo expansível */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 border-t border-white/10 p-5">
                          {/* Valor base do serviço (âncora "a partir de") */}
                          <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
                            <span className="text-xs uppercase tracking-wide text-white/50">
                              Valor base
                            </span>
                            <span className="text-sm font-semibold text-cyan-300">
                              {baseLabel(service)}
                            </span>
                          </div>

                          {/* Inclusos (travados) */}
                          {service.included.length > 0 && (
                            <div>
                              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
                                <Lock className="h-3.5 w-3.5 text-cyan-300" />
                                Já incluso no pacote
                              </p>
                              <ul className="grid gap-2.5 sm:grid-cols-2">
                                {service.included.map((item, i) => {
                                  const id = `${service.id}-inc-${i}`;
                                  return (
                                    <li
                                      key={id}
                                      className="flex items-center gap-3"
                                    >
                                      <Checkbox
                                        id={id}
                                        checked
                                        disabled
                                        aria-readonly
                                        className="border-cyan-500/40 data-[state=checked]:bg-cyan-500/50 data-[state=checked]:border-cyan-500/50 data-[state=checked]:text-white"
                                      />
                                      <Label
                                        htmlFor={id}
                                        className="text-sm text-white/70"
                                      >
                                        {item}
                                      </Label>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}

                          {/* Extras (marcáveis, sem preço, ordem embaralhada) */}
                          {service.extras.length > 0 && (
                            <div>
                              <p className="mb-3 text-sm font-medium text-white/80">
                                Adicionar ao pacote (extras)
                              </p>
                              <ul className="grid gap-2.5 sm:grid-cols-2">
                                {(extrasOrder[service.id] ?? service.extras).map(
                                  (extra) => {
                                    const id = `${service.id}-${extra.id}`;
                                    const k = extraKey(service.id, extra.id);
                                    return (
                                      <li
                                        key={id}
                                        className={[
                                          "flex gap-3",
                                          extra.info
                                            ? "items-start sm:col-span-2"
                                            : "items-center",
                                        ].join(" ")}
                                      >
                                        <Checkbox
                                          id={id}
                                          checked={!!checkedExtras[k]}
                                          onCheckedChange={() =>
                                            toggleExtra(service.id, extra.id)
                                          }
                                          className={[
                                            checkboxAccent,
                                            extra.info ? "mt-0.5" : "",
                                          ].join(" ")}
                                        />
                                        <div className="min-w-0">
                                          <Label
                                            htmlFor={id}
                                            className="cursor-pointer text-sm text-white/85"
                                          >
                                            {extra.label}
                                          </Label>
                                          {extra.info && (
                                            <p className="mt-1 text-xs leading-relaxed text-white/50">
                                              {extra.info}
                                              {extra.link && (
                                                <>
                                                  {" "}
                                                  <a
                                                    href={extra.link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                                                  >
                                                    {extra.link.label}
                                                  </a>
                                                </>
                                              )}
                                            </p>
                                          )}
                                        </div>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Domínio (gratuito x próprio) — não soma valor */}
                          {service.domainOptions && (
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                              <p className="text-sm font-medium text-white/80">
                                Domínio (endereço do site)
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-white/55">
                                Escolha como vai ser o endereço do seu site. O
                                domínio não entra no valor do projeto.
                              </p>

                              <div
                                role="radiogroup"
                                aria-label={`Domínio para ${service.name}`}
                                className="mt-3 space-y-2"
                              >
                                {service.domainOptions.map((opt) => {
                                  const active = domains[service.id] === opt.id;
                                  return (
                                    <div key={opt.id}>
                                      <button
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        onClick={() =>
                                          setDomains((p) => ({
                                            ...p,
                                            [service.id]: opt.id,
                                          }))
                                        }
                                        className={[
                                          "w-full rounded-xl border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400/50",
                                          active
                                            ? "border-cyan-400/50 bg-cyan-500/10"
                                            : "border-white/10 bg-white/[0.02] hover:border-white/20",
                                        ].join(" ")}
                                      >
                                        <span className="flex items-center gap-2">
                                          <span
                                            className={[
                                              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                              active
                                                ? "border-cyan-400"
                                                : "border-white/30",
                                            ].join(" ")}
                                            aria-hidden
                                          >
                                            {active && (
                                              <span className="h-2 w-2 rounded-full bg-cyan-400" />
                                            )}
                                          </span>
                                          <span className="text-sm font-medium text-white">
                                            {opt.title}
                                          </span>
                                        </span>
                                        <span className="mt-1 block pl-6 text-xs leading-relaxed text-white/60">
                                          {opt.detail}
                                        </span>
                                      </button>

                                      {active && (opt.link || opt.note) && (
                                        <div className="mt-2 space-y-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                                          {opt.link && (
                                            <a
                                              href={opt.link.href}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-block text-xs font-medium text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                                            >
                                              {opt.link.label}
                                            </a>
                                          )}
                                          {opt.note && (
                                            <p className="text-xs leading-relaxed text-white/60">
                                              {opt.note}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Aviso (automação) */}
                          {service.notice && (
                            <p className="flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-200/80">
                              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                              {service.notice}
                            </p>
                          )}

                          {/* Campo livre */}
                          <div>
                            <Label
                              htmlFor={`free-${service.id}`}
                              className="mb-2 text-sm text-white/80"
                            >
                              {service.freeLabel}
                              {service.freeRequired && (
                                <span className="text-cyan-300">*</span>
                              )}
                            </Label>
                            <textarea
                              id={`free-${service.id}`}
                              rows={3}
                              value={freeText[service.id] ?? ""}
                              onChange={(e) =>
                                setFreeText((p) => ({
                                  ...p,
                                  [service.id]: e.target.value,
                                }))
                              }
                              placeholder="Opcional — descreva com suas palavras."
                              className={[
                                "w-full resize-y rounded-md border px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px]",
                                inputAccent,
                                submitted &&
                                service.freeRequired &&
                                !freeText[service.id]?.trim()
                                  ? "border-red-500/60"
                                  : "",
                              ].join(" ")}
                            />
                            {submitted &&
                              service.freeRequired &&
                              !freeText[service.id]?.trim() && (
                                <p className="mt-1 text-xs text-red-400">
                                  Descreva o que você precisa para seguirmos.
                                </p>
                              )}
                          </div>

                          {/* Plano mensal (por serviço) */}
                          {service.planGroup && (
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                              <p className="text-sm font-medium text-white/80">
                                Plano mensal (recorrente)
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-white/55">
                                {service.planGroup.intro}
                              </p>

                              <div
                                role="radiogroup"
                                aria-label={`Plano mensal para ${service.name}`}
                                className="mt-3 space-y-2"
                              >
                                {service.planGroup.options.map((opt) => {
                                  const active =
                                    (plans[service.id] ?? "nenhum") === opt.id;
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      role="radio"
                                      aria-checked={active}
                                      onClick={() =>
                                        setPlans((p) => ({
                                          ...p,
                                          [service.id]: opt.id,
                                        }))
                                      }
                                      className={[
                                        "w-full rounded-xl border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400/50",
                                        active
                                          ? "border-cyan-400/50 bg-cyan-500/10"
                                          : "border-white/10 bg-white/[0.02] hover:border-white/20",
                                      ].join(" ")}
                                    >
                                      <span className="flex items-center gap-2">
                                        <span
                                          className={[
                                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                            active
                                              ? "border-cyan-400"
                                              : "border-white/30",
                                          ].join(" ")}
                                          aria-hidden
                                        >
                                          {active && (
                                            <span className="h-2 w-2 rounded-full bg-cyan-400" />
                                          )}
                                        </span>
                                        <span className="text-sm font-medium text-white">
                                          {opt.title}
                                        </span>
                                      </span>
                                      <span className="mt-1 block pl-6 text-xs leading-relaxed text-white/60">
                                        {opt.detail}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                  );
                })}
              </div>
            ))}

            {/* Política de suporte */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white/80">
                Política de suporte
              </h3>
              <ul className="mt-3 space-y-2">
                {SUPPORT_POLICY.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-xs leading-relaxed text-white/55"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-cyan-400/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ===================== COLUNA: RESUMO ===================== */}
          <aside className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-lg shadow-cyan-500/10 backdrop-blur-2xl">
                <h3 className="text-lg font-semibold text-white">Seus dados</h3>

                <div className="mt-4 space-y-4">
                  <div>
                    <Label
                      htmlFor="orc-nome"
                      className="mb-1.5 text-sm text-white/80"
                    >
                      Nome <span className="text-cyan-300">*</span>
                    </Label>
                    <Input
                      id="orc-nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      aria-invalid={submitted && !nameOk}
                      className={[
                        inputAccent,
                        submitted && !nameOk ? "border-red-500/60" : "",
                      ].join(" ")}
                    />
                    {submitted && !nameOk && (
                      <p className="mt-1 text-xs text-red-400">
                        Informe seu nome.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="orc-tel"
                      className="mb-1.5 text-sm text-white/80"
                    >
                      Telefone <span className="text-cyan-300">*</span>
                    </Label>
                    <Input
                      id="orc-tel"
                      type="tel"
                      inputMode="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      aria-invalid={submitted && !phoneOk}
                      className={[
                        inputAccent,
                        submitted && !phoneOk ? "border-red-500/60" : "",
                      ].join(" ")}
                    />
                    {submitted && !phoneOk && (
                      <p className="mt-1 text-xs text-red-400">
                        Informe um telefone válido.
                      </p>
                    )}
                  </div>
                </div>

                <div className="my-5 h-px w-full bg-white/10" />

                {/* Total (apenas soma dos bases) */}
                <p className="text-sm text-white/60">Estimativa inicial</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {totalLabel}
                  </span>
                </p>
                {hasCustom && hasPriced && (
                  <p className="mt-1 text-xs text-white/50">
                    + Serviços sob consulta
                  </p>
                )}

                {/* Aviso fixo — sempre visível, mesmo sem extras */}
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  {PRICE_NOTICE}
                </p>

                {!hasSelection && submitted && (
                  <p className="mt-3 text-xs text-red-400">
                    Selecione ao menos um serviço.
                  </p>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!canSubmit || generating}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 font-semibold text-white transition-all hover:from-cyan-600 hover:to-blue-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    {generating ? "Gerando..." : "Gerar orçamento"}
                  </span>
                </Button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-white/45">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Baixa o PDF e abre o WhatsApp com tudo pronto.
                </p>

                {/* Formas de pagamento */}
                <div className="mt-5 border-t border-white/10 pt-4">
                  <PaymentMethods className="!flex-col" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Barra fixa de total no mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0a0f]/95 px-4 py-3 backdrop-blur-xl pb-safe lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-white/50">
              Estimativa inicial
            </p>
            <p className="truncate text-base font-bold text-white">
              {totalLabel}
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!canSubmit || generating}
            className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white disabled:opacity-50"
          >
            {generating ? "Gerando..." : "Gerar orçamento"}
          </Button>
        </div>
      </div>
    </section>
  );
}
