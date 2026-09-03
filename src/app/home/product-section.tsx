"use client";

import "./product-section.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Activity, PenTool, Rocket, Search } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { StudioButton } from "@/components/site/studio-button";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { CONTACT_ID } from "@/lib/site";
import { NOTEBOOK, SPACER_VH, STEPS, SYSTEM_SHOT } from "./product-steps";

/*
 * Seção Produto — FrameSequenceHero (21st.dev) reduzido ao que a seção usa:
 * progresso do scroll relativo à seção, etapa ativa e barra de progresso.
 * A peça central é um notebook (PNG transparente) com o print do sistema
 * na tela, estático. Ver product-steps.ts.
 *
 *   - o spacer tem SPACER_VH; dentro dele o palco (100svh) é sticky.
 *     Progresso = -rect.top / (altura do spacer − viewport), lido do
 *     getBoundingClientRect DO SPACER (a seção está no meio da página;
 *     window.scrollY não serve)
 *   - scroll lido num requestAnimationFrame; o valor contínuo vai pra CSS
 *     var (--fsh-progress, barra); setState só quando a ETAPA muda
 *   - prefers-reduced-motion: sem sticky, sem spacer, quatro etapas
 *     visíveis de uma vez
 *   - a11y: notebook e print decorativos (aria-hidden, alt=""); as etapas
 *     ficam sempre no DOM — no mobile as inativas só pra leitor de tela —
 *     e a ativa leva aria-current="step"
 */
const ICONS = { search: Search, pen: PenTool, rocket: Rocket, activity: Activity } as const;

export function ProductSection() {
  const reduced = useReducedMotion();
  const pinned = !reduced;
  const rootRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!pinned) return;
    const tick = () => {
      rafRef.current = 0;
      const sp = spacerRef.current;
      if (!sp) return;
      const rect = sp.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      rootRef.current?.style.setProperty("--fsh-progress", p.toFixed(4));
      const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      setActive((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [pinned]);

  return (
    <section
      ref={rootRef}
      id="si-agenda"
      className="fsh-root bg-ink text-bg"
      aria-labelledby="produto-title"
      data-pinned={pinned}
      style={{ ["--fsh-spacer" as string]: SPACER_VH }}
    >
      <div ref={spacerRef} className="fsh-spacer">
        <div className="fsh-stage">
          <div className="container-studio grid w-full min-w-0 grid-cols-12 items-center gap-x-6 gap-y-5 py-6 md:gap-y-8 md:py-10">
            {/* copy */}
            <div className="fsh-copy col-span-12 flex min-w-0 flex-col gap-4 md:col-span-5 md:gap-5">
              <Eyebrow index="06" className="!text-bg/70">
                Produto
              </Eyebrow>
              <h2 id="produto-title" className="fsh-title">
                SI-Agenda — minha plataforma de gestão
              </h2>
              <p className="fsh-sub hidden md:block">
                Agenda, financeiro, estoque, orçamentos, ponto da equipe e tarefas num sistema só,
                multiempresa. Nasceu numa clínica; hoje se adapta a qualquer negócio de serviço.
              </p>

              {/* notebook no mobile: abaixo do título, largura toda */}
              <div className="md:hidden">
                <Notebook />
              </div>

              <ol className="fsh-cards" aria-label="Como o sistema é feito">
                {STEPS.map((s, i) => {
                  const Icon = ICONS[s.icon];
                  const on = pinned ? i === active : true;
                  return (
                    <li key={s.n} className="fsh-card" data-active={on} aria-current={pinned && i === active ? "step" : undefined}>
                      <span aria-hidden className="fsh-card-glow" />
                      <div className="fsh-card-inner">
                        <div className="fsh-card-head">
                          <span className="fsh-card-num">
                            {s.n} / {String(STEPS.length).padStart(2, "0")}
                          </span>
                          <Icon aria-hidden className="fsh-card-icon" strokeWidth={1.5} />
                          <h3 className="fsh-card-title">{s.title}</h3>
                        </div>
                        <p className="fsh-card-desc">{s.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="fsh-card-foot">
                <div className="fsh-ticks" aria-hidden>
                  {STEPS.map((s, i) => (
                    <span key={s.n} className="fsh-tick" data-on={pinned ? i <= active : true} />
                  ))}
                </div>
                <span className="fsh-card-label" aria-live="polite">
                  {pinned ? `Etapa ${STEPS[active].n} de ${String(STEPS.length).padStart(2, "0")}` : "4 etapas"}
                </span>
              </div>

              <div className="mt-1 hidden sm:block">
                <StudioButton href={`#${CONTACT_ID}`} variant="secondary" className="!border-bg !text-bg hover:!bg-bg hover:!text-ink" arrow>
                  Conhecer o SI-Agenda
                </StudioButton>
              </div>
            </div>

            {/* notebook no desktop: ao lado, dentro das 7 colunas */}
            <div className="col-span-12 hidden min-w-0 md:col-span-7 md:block">
              <Notebook />
            </div>
          </div>

          {pinned && (
            <div className="fsh-progress" aria-hidden>
              <div className="fsh-progress-fill" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Notebook + print. Camadas: o print (z 1) fica no retângulo da tela,
 * medido em % do PNG; o PNG do notebook (z 2) vai por cima e a tela
 * transparente dele deixa o print aparecer. Decorativo: aria-hidden.
 */
function Notebook() {
  const s = NOTEBOOK.screen;
  return (
    <div className="fsh-device" aria-hidden>
      <div
        className="fsh-screen"
        style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.width}%`, height: `${s.height}%` }}
      >
        <Image src={SYSTEM_SHOT.src} alt="" fill sizes="(min-width: 768px) 44vw, 80vw" className="object-contain" />
      </div>
      <Image
        src={NOTEBOOK.src}
        alt=""
        width={NOTEBOOK.width}
        height={NOTEBOOK.height}
        sizes="(min-width: 768px) 56vw, 100vw"
        className="fsh-shell h-full w-full"
      />
    </div>
  );
}
