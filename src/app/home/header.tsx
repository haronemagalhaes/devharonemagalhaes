"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useScroll, useSpring, type Transition, type Variants } from "framer-motion";
import { Lockup } from "@/components/site/lockup";
import { StudioButton } from "@/components/site/studio-button";
import { AnchorLink } from "@/components/site/anchor-link";
import { getLenis, scrollToId } from "@/components/motion/smooth-scroll";
import {
  CTA_PRIMARY,
  CTA_PRIMARY_ARIA,
  NAV_LINKS,
  WHATSAPP_BASE_URL,
  withGreeting,
} from "@/lib/site";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * Em quantos pixels de rolagem o header ganha fundo, fio e altura menor.
 * Valor medido, não escolhido no olho — ver o comentário do <header>.
 */
const SCROLL_THRESHOLD = 48;

/* ===================================================================== */
/* Menu mobile — movimento                                                */
/* ===================================================================== */

/*
 * Abrir: fundo em 0,3s; painel desce 12px revelando de cima pra baixo
 * (clip-path) em 0,45s; links em stagger de 0,05s depois do painel, o CTA
 * por último. Fechar: o inverso em 0,25s, tudo junto. Reduced-motion: só
 * fade de 200ms, sem deslocamento nem stagger.
 */
const CLOSE: Transition = { duration: DUR.fast, ease: EASE };
const FADE_ONLY: Variants = {
  closed: { opacity: 0, transition: { duration: 0.2 } },
  open: { opacity: 1, transition: { duration: 0.2 } },
};
const BACKDROP: Variants = {
  closed: { opacity: 0, transition: CLOSE },
  open: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
};
const PANEL: Variants = {
  closed: { opacity: 0, y: -12, clipPath: "inset(0% 0% 100% 0%)", transition: CLOSE },
  open: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.45, ease: EASE, delayChildren: 0.2, staggerChildren: 0.05 },
  },
};
const ITEM: Variants = {
  closed: { opacity: 0, y: 8, transition: CLOSE },
  open: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

/** Três linhas que viram X: as de fora vão ao centro e giram ±45°, a do meio some. */
function MenuIcon({ open, reduced }: { open: boolean; reduced: boolean }) {
  const t: Transition = reduced ? { duration: 0 } : { duration: 0.3, ease: EASE };
  const line = "absolute left-0 top-1/2 -mt-[0.75px] block h-[1.5px] w-full rounded-full bg-current";
  return (
    <span aria-hidden className="relative block h-3.5 w-5">
      <m.span
        className={line}
        initial={false}
        animate={open ? { y: 0, rotate: 45 } : { y: -6, rotate: 0 }}
        transition={t}
      />
      <m.span
        className={line}
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
        transition={t}
      />
      <m.span
        className={line}
        initial={false}
        animate={open ? { y: 0, rotate: -45 } : { y: 6, rotate: 0 }}
        transition={t}
      />
    </span>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const headerRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  /* seção pedida no menu: a rolagem só sai depois que o menu terminou de fechar */
  const pendingId = useRef<string | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.2,
  });

  /* Encolhe, ganha fundo e ganha fio ao passar de SCROLL_THRESHOLD */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Seção ativa no menu */
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Menu aberto e a tela cresce até o desktop: o botão some, o menu fecha junto */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /*
   * Menu aberto = página parada e fora de alcance.
   *
   * TRAVA SEM PULO. A trava é `overflow: hidden` no <body> (não no <html>:
   * o body tem `overflow-y: scroll` e ganharia uma barra própria) mais o
   * Lenis parado. Com barra de rolagem clássica, travar faz a barra sumir
   * e a viewport crescer — medido: 15px, e o `scrollbar-gutter: stable` do
   * <html> não segurou (o Lenis parado põe overflow no próprio <html>).
   * Então se mede quanto a viewport cresceu e devolve essa largura:
   * padding no <body> (conteúdo) e `--scroll-lock-gap` pros fixos (header
   * e botão do WhatsApp). Barra sobreposta (macOS, celular) cresce 0 e
   * nada muda. No iOS o overflow não segura o arrasto: touchmove fora do
   * painel é cancelado.
   *
   * FOCO. O resto da página fica `inert` (fora do Tab e do leitor de
   * tela); no header sobram a marca, o botão (agora X) e o menu. Esc fecha
   * e devolve o foco ao botão.
   */
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    const body = document.body;
    const lenis = getLenis();

    const root = document.documentElement;
    const prev = { overflow: body.style.overflow, bodyPad: body.style.paddingRight };
    const widthBefore = root.clientWidth;
    body.style.overflow = "hidden";
    lenis?.stop();
    const gap = root.clientWidth - widthBefore;
    if (gap > 0) {
      body.style.paddingRight = `${gap}px`;
      root.style.setProperty("--scroll-lock-gap", `${gap}px`);
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) e.preventDefault();
    };
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    const inerted: HTMLElement[] = [];
    for (const el of Array.from(body.children)) {
      if (!(el instanceof HTMLElement) || el.inert || (header && el.contains(header))) continue;
      el.inert = true;
      inerted.push(el);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.bodyPad;
      root.style.removeProperty("--scroll-lock-gap");
      lenis?.start();
      document.removeEventListener("touchmove", onTouchMove);
      inerted.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* Clique no menu: fecha primeiro; a rolagem (Lenis, descontando o header)
     sai no onExitComplete, com a página já destravada. */
  const onNav = useCallback((id: string) => {
    pendingId.current = id;
    setOpen(false);
  }, []);

  const onMenuClosed = useCallback(() => {
    const id = pendingId.current;
    pendingId.current = null;
    if (id) scrollToId(id);
  }, []);

  /* com o menu aberto o header fica sólido, como rolado: a barra e o painel
     viram uma folha só, em vez de o painel sair de baixo de uma faixa
     transparente sobre o hero */
  const solid = scrolled || open;

  return (
    <header
      ref={headerRef}
      id="site-header"
      className={cn(
        /* pr: devolve a largura da barra de rolagem com o menu aberto */
        "fixed inset-x-0 top-0 z-50 border-b pr-[var(--scroll-lock-gap,0px)] transition-[border-color] duration-500 motion-reduce:transition-none",
        solid ? "border-line" : "border-transparent",
      )}
    >
      {/*
        FUNDO EM CAMADA PRÓPRIA (2026-09-03).

        Era `bg-bg/85 backdrop-blur-md` direto no <header>, ligado desde o
        carregamento. Parado no topo isso desenhava um RETÂNGULO sobre o
        hero: 85% de papel opaco abafa a textura (pontos, realce, aurora,
        grão) só naquela faixa, e o olho lê a diferença como uma emenda
        horizontal atravessando a dobra. O `transition-[background-color]`
        que estava lá mostra que a intenção sempre foi o fundo entrar ao
        rolar — ele só nunca nasceu desligado.

        Por que uma camada e não `bg-transparent` ↔ `bg-bg/85` no próprio
        header: o `backdrop-blur` tem que sair junto (blur sobre o grão do
        hero cria uma faixa lisa, que é a mesma emenda por outro caminho), e
        `backdrop-filter` não dá pra ligar e desligar por classe sem
        estalo — na volta pro topo a classe some de uma vez enquanto o
        fundo ainda está visível. Numa camada, quem transiciona é a
        OPACIDADE: o backdrop-filter de um elemento em opacity 0 não
        pinta nada, e nos valores do meio o resultado borrado é composto
        por cima do original, o que dá exatamente o cruzamento suave entre
        borrado e limpo. Um valor animando, os dois estados corretos.
      */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-bg/85 backdrop-blur-md transition-opacity duration-500 motion-reduce:transition-none",
          solid ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Barra de progresso — fina, --ink, sem gradiente */}
      <m.div
        aria-hidden
        style={{ scaleX: reduced ? scrollYProgress : progress }}
        className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left bg-ink"
      />

      <div
        className={cn(
          /* `relative`: sem isso a camada de fundo (absoluta) pintaria por
             cima do logo, da nav e do CTA */
          "container-studio relative flex items-center justify-between gap-6 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          scrolled ? "h-[60px]" : "h-[76px]",
        )}
      >
        <AnchorLink href="#top" className="rounded-[4px]" title="Voltar ao início">
          <span className="hidden xl:inline-flex">
            {/* descritor em tinta a 70% no lugar de --ink-soft — ver a nota
                de contraste no <nav> logo abaixo */}
            <Lockup descriptorClassName="!text-ink/70" />
          </span>
          <span className="inline-flex xl:hidden">
            <Lockup compact />
          </span>
        </AnchorLink>

        {/*
          CONTRASTE (2026-09-03) — os links inativos eram `text-ink-soft`.
          Sem o fundo opaco do header, o texto passou a cair direto sobre o
          grão do hero, e o PIOR pixel da caixa (que é quem manda, não a
          média) foi pra 3,85–4,22 no claro e 3,97–4,28 no escuro: reprova
          o AA de texto pequeno, que pede 4,5. Já era apertado ANTES —
          4,55–4,60 no claro —, o fundo só escondia o problema.

          A correção não é devolver o fundo, é peso: tinta a 70%, que é a
          mesma decisão já tomada no sub do hero (`text-ink/75`, pelo mesmo
          motivo). Medido depois, sempre no PIOR pixel: 5,90–6,15 no claro
          e 5,96–6,30 no escuro. O cinza fica quase igual e a hierarquia
          contra o logo em tinta cheia se mantém.

          Como medir de novo: esconder o conteúdo do header, fotografar o
          hero por baixo e ler pixel a pixel. A cor do texto NÃO pode ser
          lida por regex — `text-ink/70` sai como `oklab(… / .7)` e os
          componentes viram lixo se tratados como RGB. Pintar o fundo num
          canvas 1×1, pintar a cor por cima e ler o pixel composto.
        */}
        {/* Nav e CTA a partir de lg (2026-09-13). Com Resultados, marca +
            cinco links + CTA não cabem abaixo de 1024px: a 768 a marca
            encostava em "Capacidades" e o CTA saía da tela (medido). De 768
            a 1023 vale o menu. */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {NAV_LINKS.map(({ label, id }) => (
            <AnchorLink
              key={id}
              href={`#${id}`}
              className={cn(
                "link-line py-2 text-[14px] font-medium transition-colors duration-300",
                active === id ? "text-ink" : "text-ink/70 hover:text-ink",
              )}
              aria-current={active === id ? "true" : undefined}
            >
              {label}
            </AnchorLink>
          ))}
        </nav>

        {/*
          Lado direito: só o CTA (outline, encolhe junto com a barra) + menu
          mobile. O alternador de tema SAIU daqui (2026-09-04) — competia com
          o CTA, que é a ação nº 1 da página, e não conversava com nada em
          volta. O header voltou a ser marca → navegação → CTA. O `gap-4`
          continua valendo: com um filho só ele não tem efeito no desktop, e
          no mobile é o respiro entre o CTA (escondido) e o botão de menu.

          O CTA deixou de rolar pro formulário e virou LINK EXTERNO pro
          WhatsApp: href estático (sem texto) na marcação, saudação montada
          no clique — ver `withGreeting` em lib/site.ts.
        */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline-flex">
            <StudioButton
              href={WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={CTA_PRIMARY_ARIA}
              onClick={withGreeting}
              variant="outline"
              size="sm"
              className={cn(
                "transition-[height,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                scrolled && "h-[34px]",
              )}
            >
              {CTA_PRIMARY}
            </StudioButton>
          </span>

          <button
            ref={triggerRef}
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-line bg-surface text-ink lg:hidden"
          >
            <MenuIcon open={open} reduced={reduced} />
          </button>
        </div>
      </div>

      {/*
        Menu mobile. Fundo e painel moram DENTRO do header, abaixo da barra
        (top-full): o botão continua no lugar e vira o X, e o painel é
        absoluto pra não entrar na altura do header — é ela que o
        scrollToId desconta.
      */}
      <AnimatePresence onExitComplete={onMenuClosed}>
        {open && (
          <m.div
            key="backdrop"
            aria-hidden
            variants={reduced ? FADE_ONLY : BACKDROP}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setOpen(false)}
            className="absolute inset-x-0 top-full h-[100dvh] bg-ink/20 lg:hidden"
          />
        )}
        {open && (
          <m.div
            key="panel"
            ref={panelRef}
            id="mobile-menu"
            variants={reduced ? FADE_ONLY : PANEL}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-76px)] overflow-y-auto overscroll-contain border-b border-line bg-bg text-ink lg:hidden"
          >
            <nav className="container-studio pb-8" aria-label="Menu">
              <ul className="divide-y divide-line border-b border-line">
                {NAV_LINKS.map(({ label, id }) => (
                  <m.li key={id} variants={reduced ? undefined : ITEM}>
                    <button
                      type="button"
                      onClick={() => onNav(id)}
                      className="flex w-full items-center justify-between py-4 text-left font-display text-2xl font-semibold tracking-[-0.01em]"
                      aria-current={active === id ? "true" : undefined}
                    >
                      {label}
                      <span aria-hidden className="text-ink-soft">→</span>
                    </button>
                  </m.li>
                ))}
              </ul>

              {/*
                Um CTA só. O primário aqui É o CTA do header no mobile,
                então ele foi pro WhatsApp junto com o do desktop — mesmo
                rótulo tem que fazer a mesma coisa. Com isso o secundário
                "Chamar no WhatsApp", que já existia logo abaixo, virou o
                mesmo botão duas vezes seguidas e saiu. O formulário
                continua a um toque: é o item "Contato" da lista acima.
                Entra por último no stagger.
              */}
              <m.div variants={reduced ? undefined : ITEM} className="mt-8 flex flex-col gap-3">
                <StudioButton
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={CTA_PRIMARY_ARIA}
                  onClick={(e) => {
                    withGreeting(e);
                    setOpen(false);
                  }}
                  size="lg"
                  className="w-full"
                >
                  {CTA_PRIMARY}
                </StudioButton>
              </m.div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
