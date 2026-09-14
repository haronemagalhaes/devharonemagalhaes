"use client";

import "./cases-section.css";
import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  m,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Pause, Play } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CornerMarks } from "@/components/site/corner-marks";
import { SectionHeading } from "@/components/site/section-heading";
import { DUR, EASE, VIEWPORT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/*
 * Resultados — um case por vez, como um dossiê. Card único em --surface,
 * corner marks por fora dos cantos, barra de arquivo no topo ("CASE 01 / 04"
 * · setor · frente) e grade de 12: métrica protagonista + print à esquerda
 * (5), título + linha do tempo à direita (7). Hierarquia por tamanho, peso
 * e espaço, nunca por cor:
 *   depois (Geist 700, grande) > o que mudou (Geist 500, ink) >
 *   antes (Geist 500, ink-soft, ~45%) > como estava / o que eu fiz (ink-soft).
 *
 * Conteúdo é dado, não invenção: só entra o que o cliente confirmou.
 * Trecho "[preencher: …]" é removido do texto renderizado; campo que fica
 * vazio some do card; métrica com placeholder tira o case do ar.
 * Case sem autorização pra citar o cliente vai pelo nome do projeto — sem
 * cliente, cidade ou estado. Case sem print: sem frame, a métrica fica
 * sozinha na coluna.
 *
 * Movimento (tudo em EASE/DUR de lib/motion):
 *   - troca com direção: o conteúdo sai 24px pro lado contrário e os textos
 *     entram do outro lado em stagger de 0,06s; o print entra num wipe de
 *     clip-path (direita → esquerda, 0,7s); a seta se redesenha e o "depois"
 *     sobe de dentro de uma máscara
 *   - linha do tempo preenchida em ink pelo scroll, etapa por etapa
 *   - print em P&B, ganha cor no hover ou quando o card cruza o meio da tela;
 *     parallax de ±8px (16px de curso) a partir de md
 *   - chips com autoplay de 7s; pausa com ponteiro em cima, foco de teclado,
 *     dedo na linha de chips, aba oculta, seção fora da tela ou o botão de
 *     pausar (WCAG 2.2.2)
 *   - mobile: os chips viram carrossel — sangram até a borda da tela, snap
 *     no centro de cada chip, fade nas pontas que têm mais chip — e o chip
 *     ativo desliza pro centro a cada troca (autoplay, setas, swipe, toque).
 *     Arrastar a linha só rola; quem troca de case é o toque no chip
 *   - reduced-motion: sem autoplay, sem parallax, sem wipe; só fade de 200ms
 *
 * Degradação: 0 cases → a seção não renderiza; 1 case → o card sozinho, sem
 * controles; 2+ → chips, setas, swipe e teclado (← →), com volta ao início.
 */

/* ===================================================================== */
/* Dados — é aqui que se edita                                            */
/* ===================================================================== */

/** Um lado da métrica: o valor grande e a legenda embaixo dele. */
export type MetricSide = {
  /** número ou palavra curta — exato, sem arredondar */
  valor: string;
  /** o que o valor conta: "sistemas separados" */
  legenda: string;
};

/** Antes → depois. Cada lado tem a sua legenda, pra dizer de quê. */
export type Metric = { antes: MetricSide; depois: MetricSide };

/** Número de apoio (secundário); só entra se for real. */
export type Stat = { valor: string; rotulo: string };

export type Shot = {
  src: string;
  /** dimensões reais do arquivo em /public — evitam corte e esticada */
  largura: number;
  altura: number;
  alt?: string;
};

export type Case = {
  id: string;
  /** nome do cliente — ou, sem autorização pra citar, o nome do projeto */
  empresa: string;
  /** "Saúde", "Manutenção" */
  segmento: string;
  /** frente entregue: "Sistema de gestão sob demanda" */
  servico: string;
  /** "2025", "3 meses" */
  periodo?: string;
  /** 1. Como estava — o que doía */
  comoEstava: string;
  /** 2. O que eu fiz — concreto */
  oQueEuFiz: string;
  /** 3. O que mudou — o desfecho, em uma frase */
  oQueMudou: string;
  /** antes → depois — maior peso visual da seção */
  metrica: Metric;
  /** números secundários; só entram se forem reais */
  apoio?: Stat[];
  /** print do produto, arquivo em /public */
  imagem?: Shot;
  /** logo do cliente, arquivo em /public — vai colorida sobre branco */
  logo?: string;
  /** só com as palavras do cliente; sem isso, não aparece */
  depoimento?: { texto: string; autor: string };
  publicado: boolean;
};

// nenhum case cita cliente, cidade ou estado — todos vão pelo nome do projeto
const CASES: Case[] = [
  {
    id: "sistema-clinico",
    empresa: "Sistema clínico",
    segmento: "Saúde",
    servico: "Sistema de gestão sob demanda",
    periodo: "2025",
    comoEstava:
      "A clínica rodava a operação em quatro sistemas separados, um pra cada coisa. Nada conversava entre si, a mesma coisa era digitada mais de uma vez e qualquer visão do todo só saía juntando informação na mão.",
    oQueEuFiz:
      "Desenvolvi um sistema único que absorveu as funções de todas elas, no mesmo lugar, com um painel só. A clínica parou de usar as ferramentas antigas.",
    /* mantido como estava: o ganho concreto ainda depende do número do cliente */
    oQueMudou:
      "[preencher: o ganho concreto, número exato, sem arredondar — horas por semana, custo de assinaturas cortado, tempo de uma rotina antes x depois]",
    metrica: {
      antes: { valor: "4", legenda: "sistemas separados" },
      depois: { valor: "1", legenda: "sistema só" },
    },
    apoio: [
      { valor: "[preencher: número exato, sem arredondar — R$ x/mês]", rotulo: "economizados em assinaturas" },
      { valor: "[preencher: número exato, sem arredondar — x h/semana]", rotulo: "devolvidas à equipe" },
    ],
    imagem: {
      src: "/sistema-gestao.png",
      largura: 1537,
      altura: 784,
      alt: "Tela de atendimento do sistema clínico",
    },
    depoimento: {
      texto: "[preencher: depoimento, nas palavras do cliente]",
      autor: "[preencher: nome e cargo de quem falou]",
    },
    publicado: true,
  },
  {
    id: "monitor-licitacoes",
    empresa: "Monitor de licitações",
    segmento: "Licitações",
    servico: "Sistema com inteligência artificial",
    periodo: "2026",
    comoEstava:
      "Todo dia, 74 prefeituras publicam diários oficiais, e é neles que saem as licitações. Acompanhar na mão era abrir dezenas de sites, baixar PDFs e ler cada um torcendo pra nada passar.",
    oQueEuFiz:
      "Um robô que varre os 74 diários todo dia, lê até documento escaneado e usa IA pra separar só os avisos do ramo, já com data de abertura, modalidade e objeto. Caso ambíguo vai pra “Verificar” e o cliente decide.",
    oQueMudou:
      "As licitações chegam prontas num painel, ordenadas por prazo. O sistema já recuperou pregões reais que tinham passado despercebidos.",
    metrica: {
      antes: { valor: "74", legenda: "diários oficiais abertos à mão" },
      depois: { valor: "1", legenda: "painel com o que interessa" },
    },
    imagem: {
      src: "/sistema-licitacoes.png",
      largura: 1568,
      altura: 690,
      alt: "Painel do monitor de licitações",
    },
    publicado: true,
  },
  {
    id: "relatorio-manutencao",
    empresa: "Relatório de manutenção",
    segmento: "Manutenção",
    servico: "Sistema de gestão e inspeção",
    periodo: "2026",
    comoEstava:
      "Todo mês, a equipe juntava fichas e dezenas de PDFs pra montar o relatório de cada contratante. Horas de trabalho, com risco de esquecer um equipamento justo na prestação de contas.",
    oQueEuFiz:
      "Um sistema pra cadastrar geradores e subestações, registrar a inspeção pelo celular no local e emitir o relatório. O mensal sai sozinho, um por contrato, e avisa qual equipamento ficou sem inspeção.",
    oQueMudou:
      "O relatório é gerado, revisado e emitido em minutos. A versão entregue fica arquivada e não muda depois.",
    metrica: {
      antes: { valor: "Dezenas", legenda: "de PDFs montados à mão" },
      depois: { valor: "1", legenda: "relatório por contrato" },
    },
    imagem: {
      src: "/cases/relatorio-manutencao.png",
      largura: 474,
      altura: 959,
      alt: "Lista de geradores no sistema de manutenção, aberto no celular",
    },
    publicado: true,
  },
  {
    id: "autorizacao-imagem",
    empresa: "Autorização de imagem",
    segmento: "Turismo",
    servico: "Sistema web com QR code",
    periodo: "2026",
    comoEstava:
      "Em todo passeio de barco, cada passageiro precisava autorizar o uso de imagem e voz, uma exigência da Marinha. Era no papel, na hora do embarque, sem controle de quem já tinha respondido.",
    oQueEuFiz:
      "Pra cada passeio o sistema gera um link e um QR code. O responsável do grupo repassa, e cada passageiro responde pelo celular, sem instalar nada.",
    oQueMudou:
      "As respostas aparecem no painel em tempo real, com filtro por contratante, embarcação e data, e exportação em PDF com o texto legal.",
    metrica: {
      antes: { valor: "Papel", legenda: "no embarque" },
      depois: { valor: "QR code", legenda: "resposta pelo celular" },
    },
    imagem: {
      src: "/cases/autorizacao-imagem.png",
      largura: 474,
      altura: 964,
      alt: "Lista de passeios com o total de respostas, aberta no celular",
    },
    publicado: true,
  },
];

/* ===================================================================== */
/* Placeholders                                                           */
/* ===================================================================== */

const PLACEHOLDER_PREFIX = "[preencher:";
const PLACEHOLDER_RE = /\s*\[preencher:[^\]]*\]/g;

function isPlaceholder(text: string | undefined): boolean {
  return !text || text.includes(PLACEHOLDER_PREFIX);
}

/** Remove os trechos "[preencher: …]" e devolve o que sobra (pode ser ""). */
function stripPlaceholders(text: string | undefined): string {
  return (text ?? "").replace(PLACEHOLDER_RE, "").replace(/\s{2,}/g, " ").trim();
}

/** Só o que pode ir pro ar: publicado e com os dois lados da métrica reais. */
function publishedCases(): Case[] {
  return CASES.filter((c) => {
    const { antes, depois } = c.metrica;
    return (
      c.publicado &&
      [antes.valor, antes.legenda, depois.valor, depois.legenda].every((s) => !isPlaceholder(s))
    );
  });
}

/* ===================================================================== */
/* Movimento                                                              */
/* ===================================================================== */

type Dir = 1 | -1;

const INTERVAL_MS = 7000;
const SWIPE_MIN = 48;
/** ±8px: 16px de curso no total, o teto pedido */
const PARALLAX_PX = 8;
const STAGGER = 0.06;
const WIPE_S = 0.7;
const FADE = { duration: 0.2 } as const;

type Rest = { x?: number; y?: string; scaleX?: number; pathLength?: number; clipPath?: string };

/**
 * reduced-motion: tudo vira fade de 200ms; o que era deslocamento, traço ou
 * recorte chega pronto (duração 0). A variante nunca pode sumir: o SSR
 * renderiza sem saber da preferência, e o estado "enter" ficaria preso.
 */
function reducedFade(rest: Rest = {}): Variants {
  const instant = Object.fromEntries(Object.keys(rest).map((k) => [k, { duration: 0 }]));
  return {
    enter: { opacity: 0, ...rest },
    show: { opacity: 1, ...rest, transition: { ...FADE, ...instant } },
  };
}

/** Direção da troca e reduced-motion, lidos por cada peça do card. */
const MotionCtx = createContext<{ dir: Dir; reduced: boolean }>({ dir: 1, reduced: false });

/** Casca do conteúdo: rege o stagger na entrada e sai inteira pro lado. */
const SHELL: Variants = {
  enter: { opacity: 1, x: 0 },
  show: { opacity: 1, x: 0, transition: { staggerChildren: STAGGER } },
  exit: (d: Dir) => ({
    opacity: 0,
    x: -24 * d,
    transition: { duration: DUR.fast, ease: EASE },
  }),
};

/* reduced: a casca só some; quem aparece (em fade) são as peças */
const SHELL_REDUCED: Variants = {
  enter: { opacity: 1, x: 0 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, transition: FADE },
};

/** Wipe do print: o recorte abre da direita pra esquerda. */
const WIPE: Variants = {
  enter: { clipPath: "inset(0% 0% 0% 100%)" },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: WIPE_S, ease: EASE, delay: 0.12 },
  },
};

/** Texto: x 24px do lado de onde o case vem + opacity, no stagger da casca. */
function useTextVariants(): Variants {
  const { dir, reduced } = useContext(MotionCtx);
  if (reduced) return reducedFade({ x: 0 });
  return {
    enter: { opacity: 0, x: 24 * dir },
    show: { opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE } },
  };
}

type TextTag = "div" | "p" | "span" | "h3";

function Text({
  as = "div",
  className,
  children,
}: {
  as?: TextTag;
  className?: string;
  children: ReactNode;
}) {
  const variants = useTextVariants();
  const Comp = m[as] as typeof m.div;
  return (
    <Comp variants={variants} className={className}>
      {children}
    </Comp>
  );
}

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/* ===================================================================== */
/* Métrica: antes → depois                                                */
/* ===================================================================== */

type Side = "antes" | "depois";

/**
 * A régua de sempre, pelo comprimento sem espaços: número curto vai enorme,
 * palavra ("Papel", "QR code") desce de faixa pra caber. Em cqi — a largura
 * do bloco da métrica —, porque a coluna vai de ~230px (mobile) a ~400px
 * (desktop, 5 de 12). Os valores são os do "depois" no lado a lado.
 */
function metricSize(valor: string) {
  const n = valor.replace(/\s/g, "").length;
  if (n <= 3) return { short: true, cqi: 40, floor: 72, max: 152, tracking: "tracking-[-0.04em]" };
  if (n <= 10) return { short: false, cqi: 11, floor: 26, max: 84, tracking: "tracking-[-0.03em]" };
  return { short: false, cqi: 7, floor: 18, max: 48, tracking: "tracking-[-0.02em]" };
}

/**
 * font-size de um lado nas duas disposições (vão pra variáveis CSS):
 *   - depois: a régua cheia
 *   - antes: número a 45% do cheio; palavra a 65%, o que cabe na coluna do
 *     antes (2 de 5 da largura)
 *   - empilhado (< md): cada lado tem a largura toda, então palavra dobra
 */
function sideSize(valor: string, side: Side) {
  const t = metricSize(valor);
  const k = side === "depois" ? 1 : t.short ? 0.45 : 0.65;
  const fs = (mult: number) =>
    `clamp(${Math.round(t.floor * k)}px, ${+(t.cqi * k * mult).toFixed(2)}cqi, ${Math.round(t.max * k)}px)`;
  return { row: fs(1), stack: fs(t.short ? 1 : 2), tracking: t.tracking };
}

/**
 * Sobe de dentro de uma máscara; o respiro embaixo guarda a descendente do
 * "p". overflow-clip, não hidden: hidden vira contêiner de rolagem e perde a
 * linha de base — e a métrica se alinha pela base.
 */
function Rise({ children, className, delay }: { children: ReactNode; className?: string; delay: number }) {
  const { reduced } = useContext(MotionCtx);
  const variants: Variants = reduced
    ? reducedFade({ y: "0%" })
    : {
        enter: { y: "110%" },
        show: { y: "0%", transition: { duration: DUR.slow, ease: EASE, delay } },
      };
  return (
    <span className={cn("block overflow-clip pb-[0.1em]", className)}>
      <m.span variants={variants} className="block">
        {children}
      </m.span>
    </span>
  );
}

/**
 * Traço de 1px que se desenha, e a ponta no fim. Pra direita no lado a lado
 * (na meia altura do "antes": 0,3em do tamanho dele), pra baixo no empilhado.
 */
function DrawnArrow({ className }: { className?: string }) {
  const { reduced } = useContext(MotionCtx);
  const draw = (delay: number, duration: number): Variants =>
    reduced
      ? reducedFade({ pathLength: 1 })
      : {
          enter: { pathLength: 0, opacity: 0 },
          show: {
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { duration, ease: EASE, delay },
              opacity: { duration: 0.01, delay },
            },
          },
        };
  const line = draw(0.2, 0.5);
  const head = draw(0.62, 0.25);
  const stroke = { stroke: "currentColor", strokeWidth: 1 } as const;

  return (
    <span className={cn("block text-ink", className)}>
      <svg viewBox="0 0 44 12" fill="none" className="hidden h-3 w-11 -translate-y-[0.3em] md:block">
        <m.path d="M0 6H43" variants={line} {...stroke} />
        <m.path d="M37.5 0.5L43 6L37.5 11.5" variants={head} {...stroke} />
      </svg>
      <svg viewBox="0 0 12 36" fill="none" className="my-4 ml-1 h-9 w-3 md:hidden">
        <m.path d="M6 0V35" variants={line} {...stroke} />
        <m.path d="M0.5 29.5L6 35L11.5 29.5" variants={head} {...stroke} />
      </svg>
    </span>
  );
}

/**
 * Antes → depois. ≥ md: duas colunas alinhadas pela base, seta entre elas.
 * < md: antes em cima, seta pra baixo, depois embaixo. Os tamanhos vão em
 * variáveis CSS no grid e cada peça pega a da sua disposição; o leitor de
 * tela ouve uma frase só.
 */
function MetricBlock({ metric }: { metric: Metric }) {
  const { reduced } = useContext(MotionCtx);
  const { antes, depois } = metric;
  const a = sideSize(antes.valor, "antes");
  const d = sideSize(depois.valor, "depois");
  const sizes = {
    "--fs-antes-row": a.row,
    "--fs-antes-stack": a.stack,
    "--fs-depois-row": d.row,
    "--fs-depois-stack": d.stack,
  } as CSSProperties;

  const fade = (delay: number, x = 0): Variants =>
    reduced
      ? reducedFade({ x: 0 })
      : {
          enter: { opacity: 0, x },
          show: { opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE, delay } },
        };

  /* tamanho ANTES do leading nos cn() abaixo: o tailwind-merge descarta um
     leading que venha antes de uma classe de font-size */
  return (
    <div className="@container">
      <p className="sr-only">
        Antes: {antes.valor}, {antes.legenda}. Depois: {depois.valor}, {depois.legenda}.
      </p>
      <div
        aria-hidden
        style={sizes}
        className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_auto_minmax(0,3fr)] md:items-baseline md:gap-x-5"
      >
        <m.span variants={fade(0)} className="eyebrow block md:col-start-1 md:row-start-1">
          Antes
        </m.span>
        <m.span
          variants={fade(0.04, 12)}
          className={cn(
            "text-[length:var(--fs-antes-stack)] md:text-[length:var(--fs-antes-row)]",
            a.tracking,
            "mt-2 block font-display font-medium leading-[0.95] text-ink-soft tabular-nums [text-wrap:balance] md:col-start-1 md:row-start-2",
          )}
        >
          {antes.valor}
        </m.span>
        <m.span
          variants={fade(0.85)}
          className="mt-2 block text-[14px] leading-snug text-ink-soft md:col-start-1 md:row-start-3 md:mt-3"
        >
          {antes.legenda}
        </m.span>

        <DrawnArrow className="md:col-start-2 md:row-start-2 md:text-[length:var(--fs-antes-row)]" />

        <m.span variants={fade(0.5)} className="eyebrow block md:col-start-3 md:row-start-1">
          Depois
        </m.span>
        <Rise
          delay={0.62}
          className={cn(
            "text-[length:var(--fs-depois-stack)] md:text-[length:var(--fs-depois-row)]",
            d.tracking,
            "mt-2 font-display font-bold leading-[0.95] text-ink tabular-nums [text-wrap:balance] md:col-start-3 md:row-start-2",
          )}
        >
          {depois.valor}
        </Rise>
        <m.span
          variants={fade(0.9)}
          className="mt-2 block text-[14px] leading-snug text-ink md:col-start-3 md:row-start-3 md:mt-3"
        >
          {depois.legenda}
        </m.span>
      </div>
    </div>
  );
}

function SupportMetrics({ items }: { items?: Stat[] }) {
  const real = (items ?? []).filter(
    (s) => !isPlaceholder(s.valor) && !isPlaceholder(s.rotulo),
  );
  if (real.length === 0) return null;
  return (
    <Text>
      <dl className="flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-6">
        {real.map((s) => (
          <div key={`${s.valor}-${s.rotulo}`} className="flex flex-col gap-1">
            <dd className="order-first font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums md:text-[30px]">
              {s.valor}
            </dd>
            <dt className="text-[13px] leading-snug text-ink-soft">{s.rotulo}</dt>
          </div>
        ))}
      </dl>
    </Text>
  );
}

/* ===================================================================== */
/* Print                                                                  */
/* ===================================================================== */

/** P&B em repouso; a cor volta no hover do card ou com o card ativo (data-active no grupo). */
const TONE = "img-duotone group-hover/case:filter-none group-data-[active=true]/case:filter-none";

/**
 * Print do produto. O frame sai da proporção do arquivo:
 *   - horizontal (ou quadrado) → navegador limpo: barra de 28px, três pontos
 *     em --line, raio 8
 *   - vertical → celular: raio 32, borda 1px --line, fundo --surface como
 *     moldura, sem notch falso; até ~440px de altura no mobile e ~520px a
 *     partir de md, centralizado na coluna
 * Os dois têm o mesmo tom, o mesmo wipe e o mesmo parallax — que mexe no
 * frame inteiro, não na imagem, então nada do print é cortado.
 */
function Screenshot({ shot, empresa, parallax }: { shot: Shot; empresa: string; parallax: boolean }) {
  const phone = shot.altura > shot.largura;
  const { reduced } = useContext(MotionCtx);
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useMotionValue(0);

  const place = useCallback(
    (p: number) => y.set(parallax ? PARALLAX_PX * (1 - 2 * p) : 0),
    [parallax, y],
  );
  useMotionValueEvent(scrollYProgress, "change", place);
  useEffect(() => place(scrollYProgress.get()), [place, scrollYProgress]);

  const variants = reduced ? reducedFade({ clipPath: "inset(0% 0% 0% 0%)" }) : WIPE;
  const alt = shot.alt ?? `Tela do sistema — ${empresa}`;

  return (
    <m.div ref={ref} style={{ y }}>
      {phone ? (
        /* moldura de 10px: sem ela o raio de 32 come os cantos do app. Altura
           total = imagem + 2 × (10 + 1): 418 + 22 ≈ 440, 498 + 22 ≈ 520 */
        <m.figure
          variants={variants}
          className="mx-auto w-fit max-w-full rounded-[32px] border border-line bg-surface p-2.5"
        >
          <Image
            src={shot.src}
            alt={alt}
            width={shot.largura}
            height={shot.altura}
            sizes="(min-width: 768px) 250px, 210px"
            className={`${TONE} block h-auto max-h-[418px] w-auto max-w-full rounded-[22px] md:max-h-[498px]`}
          />
        </m.figure>
      ) : (
        <m.figure
          variants={variants}
          className="overflow-hidden rounded-[8px] border border-line bg-surface"
        >
          <div aria-hidden className="flex h-7 items-center gap-1.5 border-b border-line px-3">
            <span className="size-2 rounded-full bg-line" />
            <span className="size-2 rounded-full bg-line" />
            <span className="size-2 rounded-full bg-line" />
          </div>
          <Image
            src={shot.src}
            alt={alt}
            width={shot.largura}
            height={shot.altura}
            sizes="(min-width: 1280px) 440px, (min-width: 1024px) 36vw, 90vw"
            className={`${TONE} block h-auto w-full`}
          />
        </m.figure>
      )}
    </m.div>
  );
}

/* ===================================================================== */
/* Cliente e linha do tempo                                               */
/* ===================================================================== */

/** Logo + nome + meta (período). Setor e frente já estão na barra do topo. */
function CaseHeader({ c }: { c: Case }) {
  const periodo = isPlaceholder(c.periodo) ? null : c.periodo;
  return (
    <div className="flex items-center gap-4">
      {c.logo && (
        /* fundo branco é a única exceção de cor do sistema: logo colorida
           precisa de base neutra pra não sujar no tema escuro */
        <Text as="span" className="relative block size-[52px] shrink-0 rounded-[6px] border border-line bg-white">
          <Image src={c.logo} alt="" aria-hidden fill sizes="52px" className="object-contain p-2" />
        </Text>
      )}
      <div className="flex min-w-0 flex-col gap-1.5">
        <Text
          as="h3"
          className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink md:text-[32px] lg:text-[34px]"
        >
          {c.empresa}
        </Text>
        {periodo && (
          <Text as="p" className="text-[14px] leading-snug text-ink-soft tabular-nums">
            {periodo}
          </Text>
        )}
      </div>
    </div>
  );
}

type StepData = { label: string; text: string; final: boolean };

/**
 * Uma etapa: ponto + o trecho do fio até a próxima. O trecho enche em ink
 * enquanto a própria etapa cruza a linha de 80% da viewport, então o fio
 * inteiro vai sendo preenchido de cima pra baixo conforme a seção sobe.
 */
function Step({ step, last }: { step: StepData; last: boolean }) {
  const { reduced } = useContext(MotionCtx);
  const variants = useTextVariants();
  const ref = useRef<HTMLLIElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 80%"] });
  const reached = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <m.li
      ref={ref}
      variants={variants}
      className={cn("relative pl-8 md:pl-10", !last && "pb-8 md:pb-10")}
    >
      {!last && (
        <span aria-hidden className="absolute -bottom-[10px] left-1 top-[10px] w-px bg-line">
          <m.span
            key={reduced ? "static" : "scroll"}
            className="absolute inset-0 block origin-top bg-ink"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />
        </span>
      )}
      <span
        aria-hidden
        className="absolute left-0 top-[5.5px] z-10 block size-[9px] rounded-full border border-line bg-surface"
      >
        <m.span
          key={reduced ? "static" : "scroll"}
          className="absolute -inset-px block rounded-full bg-ink"
          style={{ opacity: reduced ? 1 : reached }}
        />
      </span>
      <p className="eyebrow leading-[20px]">{step.label}</p>
      <p
        className={cn(
          "mt-2",
          step.final
            ? "font-display text-[19px] font-medium leading-[1.4] tracking-[-0.01em] text-ink md:text-[22px]"
            : "text-[16px] leading-relaxed text-ink-soft md:text-[17px]",
        )}
      >
        {step.text}
      </p>
    </m.li>
  );
}

/** Como estava / O que eu fiz / O que mudou. Placeholder → a etapa não aparece. */
function Timeline({ c }: { c: Case }) {
  const steps: StepData[] = [
    { label: "Como estava", text: stripPlaceholders(c.comoEstava), final: false },
    { label: "O que eu fiz", text: stripPlaceholders(c.oQueEuFiz), final: false },
    { label: "O que mudou", text: stripPlaceholders(c.oQueMudou), final: true },
  ].filter((s) => s.text.length > 0);

  if (steps.length === 0) return null;
  return (
    <ol>
      {steps.map((s, i) => (
        <Step key={s.label} step={s} last={i === steps.length - 1} />
      ))}
    </ol>
  );
}

function Quote({ texto, autor }: { texto: string; autor: string }) {
  return (
    <Text>
      <figure className="flex flex-col gap-3 border-l-2 border-ink pl-5">
        <blockquote className="font-display text-[20px] leading-[1.45] tracking-[-0.005em] text-ink md:text-[22px]">
          {texto}
        </blockquote>
        {autor.length > 0 && (
          <figcaption className="text-[13px] leading-snug text-ink-soft">{autor}</figcaption>
        )}
      </figure>
    </Text>
  );
}

/* ===================================================================== */
/* Conteúdo do card                                                       */
/* ===================================================================== */

const pad = (n: number) => String(n).padStart(2, "0");

function CaseContent({
  c,
  index,
  total,
  play,
  parallax,
}: {
  c: Case;
  index: number;
  total: number;
  /** false até a seção entrar na tela: segura a entrada do primeiro case */
  play: boolean;
  parallax: boolean;
}) {
  const { dir, reduced } = useContext(MotionCtx);
  const file = [c.segmento, c.servico].filter((s) => !isPlaceholder(s)).join(" · ");
  const quote = c.depoimento ? stripPlaceholders(c.depoimento.texto) : "";

  return (
    <m.div
      custom={dir}
      variants={reduced ? SHELL_REDUCED : SHELL}
      initial="enter"
      animate={play ? "show" : "enter"}
      exit="exit"
    >
      {/* barra de arquivo */}
      <div className="flex flex-col gap-1.5 border-b border-line px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-8 lg:px-12">
        <Text as="p" className="eyebrow shrink-0 tabular-nums">
          <span className="text-ink">Case {pad(index + 1)}</span> / {pad(total)}
        </Text>
        {file && (
          <Text as="p" className="eyebrow sm:text-right">
            {file}
          </Text>
        )}
      </div>

      {/* < lg: cliente → métrica → print → linha do tempo
          ≥ lg: métrica + print (5) | cliente + linha do tempo (7) */}
      <div className="grid grid-cols-1 gap-y-10 px-5 py-8 sm:px-7 md:p-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-10 lg:p-12">
        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <CaseHeader c={c} />
        </div>

        <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <MetricBlock metric={c.metrica} />
          <SupportMetrics items={c.apoio} />
          {c.imagem && <Screenshot shot={c.imagem} empresa={c.empresa} parallax={parallax} />}
        </div>

        <div className="flex flex-col gap-10 lg:col-span-7 lg:col-start-6 lg:row-start-2">
          <Timeline c={c} />
          {quote.length > 0 && c.depoimento && (
            <Quote texto={quote} autor={stripPlaceholders(c.depoimento.autor)} />
          )}
        </div>
      </div>
    </m.div>
  );
}

/* ===================================================================== */
/* Navegação                                                              */
/* ===================================================================== */

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-4">
      <g
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        transform={dir === "prev" ? "scale(-1,1) translate(-24,0)" : undefined}
      >
        <path d="M3 12h17" />
        <path d="M14 6l6 6-6 6" />
      </g>
    </svg>
  );
}

function RoundButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "flex size-11 items-center justify-center rounded-full border border-line text-ink",
        "transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:border-ink focus-visible:border-ink",
      )}
    >
      {children}
    </button>
  );
}

/* ===================================================================== */
/* Deck                                                                   */
/* ===================================================================== */

function CaseDeck({ cases }: { cases: Case[] }) {
  const total = cases.length;
  const multi = total > 1;
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const uid = useId();

  const [{ index, dir }, setPos] = useState<{ index: number; dir: Dir }>({ index: 0, dir: 1 });
  const [paused, setPaused] = useState(false); // botão pausar
  const [hovered, setHovered] = useState(false); // mouse em cima
  const [focused, setFocused] = useState(false); // foco de teclado dentro
  const [pageHidden, setPageHidden] = useState(false);
  const [dragging, setDragging] = useState(false); // dedo na linha de chips

  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const seen = useInView(rootRef, VIEWPORT);
  const onScreen = useInView(rootRef, { amount: 0.2 });
  /* o print ganha cor quando o card cruza a faixa do meio da tela */
  const active = useInView(cardRef, { margin: "-40% 0px -40% 0px" });

  /* `dragging` pausa: sem ele o autoplay podia trocar o case no meio do
     arrasto e o scrollTo abaixo brigaria com o dedo */
  const running =
    multi && !reduced && !paused && !hovered && !focused && !dragging && !pageHidden && onScreen;

  useEffect(() => {
    const sync = () => setPageHidden(document.visibilityState === "hidden");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  /* fade das pontas da linha de chips: só do lado em que ainda tem chip
     escondido. Atributo direto no DOM — a rolagem não passa pelo React.
     O ResizeObserver cobre giro de tela e a troca de fonte (chip muda de
     largura quando a Inter carrega). */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const sync = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      strip.toggleAttribute("data-fade-start", strip.scrollLeft > 1);
      strip.toggleAttribute("data-fade-end", strip.scrollLeft < max - 1);
    };
    sync();
    strip.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(strip);
    if (strip.firstElementChild) ro.observe(strip.firstElementChild);
    return () => {
      strip.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [multi]);

  /* mobile: a cada troca o chip ativo desliza pro centro da linha.
     scrollTo no próprio contêiner, pelo offsetLeft (a linha é `relative`,
     então é o offsetParent) — scrollIntoView rolaria a página na vertical
     junto. O clamp deixa o primeiro e o último chip nas pontas, que também
     são posições de snap. `behavior: "auto"` no reduced-motion: "smooth"
     explícito passaria por cima do scroll-behavior do CSS global. */
  useEffect(() => {
    const strip = stripRef.current;
    const tab = tabRefs.current[index];
    if (wide || !strip || !tab) return;
    const max = strip.scrollWidth - strip.clientWidth;
    if (max <= 0) return;
    const left = tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2;
    strip.scrollTo({
      left: Math.min(Math.max(left, 0), max),
      behavior: reduced ? "auto" : "smooth",
    });
  }, [index, wide, reduced]);

  const go = useCallback(
    (delta: number) => {
      setPos(({ index: i }) => ({
        index: (i + delta + total) % total,
        dir: delta < 0 ? -1 : 1,
      }));
    },
    [total],
  );

  const select = useCallback((next: number, focus = false) => {
    setPos((p) => (next === p.index ? p : { index: next, dir: next > p.index ? 1 : -1 }));
    if (focus) tabRefs.current[next]?.focus();
  }, []);

  /* ← → valem com o mouse sobre a seção; com foco dentro, o onKeyDown do
     wrapper já resolve — daí o contains() aqui. */
  useEffect(() => {
    if (!hovered || !multi) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const target = e.target as Node | null;
      if (target && rootRef.current?.contains(target)) return;
      e.preventDefault();
      go(e.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hovered, multi, go]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!multi) return;
    const onTab = (e.target as HTMLElement).getAttribute("role") === "tab";
    const map: Record<string, number | undefined> = {
      ArrowLeft: (index - 1 + total) % total,
      ArrowRight: (index + 1) % total,
      ...(onTab ? { Home: 0, End: total - 1 } : {}),
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    if (onTab) select(next, true);
    else go(e.key === "ArrowLeft" ? -1 : 1);
  };

  const c = cases[index];
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  return (
    <div
      ref={rootRef}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocusCapture={(e) => setFocused((e.target as HTMLElement).matches(":focus-visible"))}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      {multi && (
        <div className="flex flex-col gap-3 pb-6 md:flex-row md:items-center md:justify-between md:gap-8 md:pb-8">
          {/* chips: carrossel no mobile. Sangra até a borda da tela (-mx-6 =
              gutter do container-studio), snap no centro de cada chip,
              scroll-padding igual ao gutter e fade nas pontas (.case-chips,
              no CSS). O respiro das pontas mora no trilho (px-6), não no
              contêiner: padding do fim de um contêiner rolável nem sempre
              entra na área rolável, e aí o último chip colaria na borda.
              Do md pra cima fica como sempre foi: sem snap, sem fade. */}
          <div
            ref={stripRef}
            className={cn(
              "case-chips relative -mx-6 snap-x snap-mandatory scroll-px-6 overflow-x-auto pb-3 pt-1",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "md:mx-0 md:min-w-0 md:flex-1 md:snap-none md:scroll-px-0",
            )}
            onTouchStart={() => setDragging(true)}
            onTouchEnd={() => setDragging(false)}
            onTouchCancel={() => setDragging(false)}
          >
            <div role="tablist" aria-label="Cases" className="flex w-max flex-nowrap gap-2 px-6 md:px-1">
              {cases.map((item, i) => {
                const selected = i === index;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={tabId(i)}
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i)}
                    className={cn(
                      "relative shrink-0 snap-center whitespace-nowrap rounded-full border px-4 py-2 text-[14px] leading-5",
                      "transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      selected
                        ? "border-ink text-ink"
                        : "border-line text-ink-soft hover:border-ink-soft hover:text-ink",
                    )}
                  >
                    {item.empresa}
                    {selected && !reduced && (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 -bottom-[9px] block h-[2px] overflow-hidden rounded-full bg-line"
                      >
                        <span
                          className="case-progress block h-full w-full bg-ink"
                          style={{
                            animationDuration: `${INTERVAL_MS}ms`,
                            animationPlayState: running ? "running" : "paused",
                          }}
                          onAnimationEnd={() => go(1)}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-end md:self-auto">
            {!reduced && (
              <RoundButton
                label={paused ? "Retomar a troca automática" : "Pausar a troca automática"}
                pressed={paused}
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
              </RoundButton>
            )}
            <RoundButton label="Case anterior" onClick={() => go(-1)}>
              <Arrow dir="prev" />
            </RoundButton>
            <RoundButton label="Próximo case" onClick={() => go(1)}>
              <Arrow dir="next" />
            </RoundButton>
          </div>
        </div>
      )}

      {/* o card: moldura fixa, conteúdo trocando por dentro */}
      <div ref={cardRef} data-active={active} className="group/case relative">
        <CornerMarks
          size={12}
          inset={7}
          color="currentColor"
          className="text-line transition-colors duration-300 group-hover/case:text-ink"
        />
        <div
          id={panelId}
          role={multi ? "tabpanel" : undefined}
          aria-labelledby={multi ? tabId(index) : undefined}
          aria-label={multi ? undefined : `Resultado: ${c.empresa}`}
          /* anuncia a troca feita por quem navega; durante o autoplay fica
             "off", senão o leitor de tela lê o case inteiro a cada 7s */
          aria-live={multi ? (running ? "off" : "polite") : undefined}
          className="relative overflow-hidden rounded-[12px] border border-line bg-surface transition-colors duration-300 group-hover/case:border-ink"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touch.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touch.current;
            touch.current = null;
            if (!start || !multi) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy)) return;
            go(dx < 0 ? 1 : -1);
          }}
        >
          <MotionCtx.Provider value={{ dir, reduced }}>
            <AnimatePresence mode="wait" custom={dir}>
              <CaseContent
                key={c.id}
                c={c}
                index={index}
                total={total}
                play={seen}
                parallax={wide && !reduced}
              />
            </AnimatePresence>
          </MotionCtx.Provider>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== */

export function CasesSection() {
  const cases = publishedCases();
  if (cases.length === 0) return null;

  return (
    <section id="resultados" className="section-pad" aria-labelledby="resultados-title">
      <div className="container-studio">
        <SectionHeading
          index="02"
          eyebrow="Resultados"
          title="O que mudou pra quem contratou"
          sub="Como estava, o que eu fiz e o que mudou. Número real, sem arredondar."
          id="resultados-title"
        />

        <Reveal className="mt-14 md:mt-20">
          <CaseDeck cases={cases} />
        </Reveal>
      </div>
    </section>
  );
}
