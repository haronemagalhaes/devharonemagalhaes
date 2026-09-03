"use client";

import "./testimonials-section.css";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { TESTIMONIALS, iniciais } from "./testimonials";

/*
 * Depoimentos em abas verticais — formato do VerticalTabs (21st.dev), sem
 * as dependências dele: `motion` → framer-motion (já no projeto), ícones do
 * hugeicons → lucide-react (já no projeto), clsx/tailwind-merge já
 * sustentam o `cn`. Zero instalação.
 *
 * Hierarquia invertida em relação ao original (que era pra serviços): a
 * CITAÇÃO é o protagonista da aba expandida (corpo grande, tinta); o nome
 * do cliente é o título pequeno; abaixo dele, as estrelas (tinta, nunca
 * dourado; container role="img" "5 de 5 estrelas" com os ícones
 * aria-hidden). À direita, um círculo com a marca de quem falou — logo em
 * object-contain com respiro, foto em cover, ou as iniciais em Geist.
 * Grid 8/4 (era 5/7): o print retangular saiu e a citação ganhou medida.
 *
 * Acessibilidade (o original não tinha):
 *   - semântica de abas completa: tablist vertical / tab com aria-selected,
 *     aria-controls, foco rodante (só a ativa no Tab) e setas ↑↓ ←→ Home End
 *   - autoplay com botão pausar/retomar visível e por teclado (WCAG 2.2.2);
 *     pausa também com ponteiro em cima e foco dentro; só roda com a seção
 *     na viewport (IntersectionObserver)
 *   - prefers-reduced-motion: sem autoplay, sem barra, troca instantânea
 *
 * Identidade: fios em --line, barra, estrelas e estados em tinta/cinza;
 * círculo em --surface com borda --line. Logos na cor natural do cliente.
 */
const INTERVAL_MS = 7000;

export function TestimonialsSection() {
  const items = TESTIMONIALS;
  const n = items.length;
  const reduced = useReducedMotion();
  const uid = useId();

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false); // controle do usuário
  const [held, setHeld] = useState(false); // ponteiro em cima / foco dentro
  const [inView, setInView] = useState(false);
  const [cycle, setCycle] = useState(0); // reinicia a barra e o timer

  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const running = n > 1 && inView && !paused && !held && !reduced;

  const go = useCallback(
    (i: number, focus = false) => {
      const next = ((i % n) + n) % n;
      setActive(next);
      setCycle((c) => c + 1);
      if (focus) tabRefs.current[next]?.focus();
    },
    [n],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => go(active + 1), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [running, active, cycle, go]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number | undefined> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: n - 1,
    };
    const target = map[e.key];
    if (target === undefined) return;
    e.preventDefault();
    go(target, true);
  };

  if (n === 0) return null;

  const current = items[active];
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;
  const dur = reduced ? 0 : 0.45;

  return (
    <section id="depoimentos" className="section-pad" aria-labelledby="depoimentos-title">
      <div className="container-studio">
        <SectionHeading index="07" eyebrow="Depoimentos" title="O que dizem os clientes" id="depoimentos-title" />

        <Reveal className="mt-10 md:mt-14">
          <div
            ref={rootRef}
            className="grid grid-cols-12 gap-x-6 gap-y-8"
            onPointerEnter={() => setHeld(true)}
            onPointerLeave={() => setHeld(false)}
            onFocusCapture={() => setHeld(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
            }}
          >
            {/* ---------- abas (esquerda) ---------- */}
            <div className="col-span-12 lg:col-span-8">
              <div role="tablist" aria-orientation="vertical" aria-label="Depoimentos" onKeyDown={onKeyDown}>
                {items.map((t, i) => {
                  const selected = i === active;
                  return (
                    <div key={t.id} className="relative border-t border-line last:border-b">
                      <button
                        ref={(el) => {
                          tabRefs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={tabId(i)}
                        aria-selected={selected}
                        aria-controls={panelId}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => go(i)}
                        className={cn(
                          "group flex w-full items-baseline gap-4 py-5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink md:gap-6",
                          selected ? "text-ink" : "text-ink/70 hover:text-ink",
                        )}
                      >
                        <span className="eyebrow w-9 shrink-0 tabular-nums">/{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="font-display text-[18px] font-semibold leading-tight tracking-[-0.01em] md:text-[20px]">
                            {t.cliente}
                          </span>
                          <span className="text-[13px] leading-snug text-ink-soft">{t.empresa}</span>
                        </span>
                      </button>

                      {/* citação: protagonista da aba aberta */}
                      <AnimatePresence initial={false}>
                        {selected && (
                          <m.div
                            key="quote"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: dur, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="pl-[calc(2.25rem+1rem)] md:pl-[calc(2.25rem+1.5rem)]">
                              {/* selo de confiança, discreto: 5 estrelas de tinta, uma imagem só pro leitor de tela */}
                              <div
                                role="img"
                                aria-label={`${t.estrelas} de 5 estrelas`}
                                className="mb-3 flex items-center gap-1 text-ink"
                              >
                                {Array.from({ length: 5 }, (_, k) => (
                                  <Star
                                    key={k}
                                    aria-hidden
                                    className={cn("h-3.5 w-3.5", k < t.estrelas ? "fill-ink" : "fill-transparent")}
                                    strokeWidth={1.5}
                                  />
                                ))}
                              </div>
                            </div>
                            <blockquote className="pb-6 pl-[calc(2.25rem+1rem)] md:pl-[calc(2.25rem+1.5rem)]">
                              <p className="text-balance text-[18px] leading-[1.45] text-ink md:text-[22px]">
                                “{t.citacao}”
                              </p>
                            </blockquote>
                          </m.div>
                        )}
                      </AnimatePresence>

                      {/* barra de progresso do autoplay */}
                      {selected && running && (
                        <span
                          key={`bar-${cycle}`}
                          aria-hidden
                          className="depo-progress absolute bottom-[-1px] left-0 h-[2px] w-full bg-ink"
                          style={{ ["--depo-ms" as string]: `${INTERVAL_MS}ms` }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* controles: anterior · pausar/retomar · próximo — visíveis, por teclado */}
              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(active - 1, true)}
                  aria-label="Depoimento anterior"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink text-ink transition-colors duration-300 hover:bg-ink hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-pressed={paused}
                  aria-label={paused ? "Retomar a troca automática" : "Pausar a troca automática"}
                  disabled={reduced || n < 2}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink text-ink transition-colors duration-300 hover:bg-ink hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
                >
                  {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1, true)}
                  aria-label="Próximo depoimento"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink text-ink transition-colors duration-300 hover:bg-ink hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
                <span className="ml-2 text-[13px] text-ink-soft" aria-live="polite">
                  {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* ---------- painel (direita): quem falou, num círculo ---------- */}
            <div
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId(active)}
              className="order-first col-span-12 flex justify-center lg:order-none lg:col-span-4 lg:self-center lg:justify-end"
            >
              <div className="relative h-32 w-32 overflow-hidden rounded-full border border-line bg-surface md:h-44 md:w-44 lg:h-52 lg:w-52">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={current.id}
                    initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
                    transition={{ duration: dur, ease: EASE }}
                    className="absolute inset-0"
                  >
                    {current.marca?.tipo === "logo" ? (
                      // logo horizontal em círculo: contain + respiro de 20%, nunca cover
                      <div className="flex h-full w-full items-center justify-center p-[20%]">
                        <Image
                          src={current.marca.src}
                          alt={current.marca.alt ?? `Logomarca de ${current.cliente}`}
                          fill
                          sizes="208px"
                          className="object-contain p-[20%]"
                        />
                      </div>
                    ) : current.marca ? (
                      // "tile" (logo quadrada com fundo próprio) ou "foto": preenche o círculo
                      <Image
                        src={current.marca.src}
                        alt={current.marca.alt ?? current.cliente}
                        fill
                        sizes="208px"
                        className="object-cover"
                      />
                    ) : (
                      // sem marca: iniciais em Geist sobre --surface
                      <div
                        className="flex h-full w-full items-center justify-center font-display text-[32px] font-semibold tracking-[-0.02em] text-ink md:text-[44px]"
                        aria-label={current.cliente}
                        role="img"
                      >
                        {iniciais(current.cliente)}
                      </div>
                    )}
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
