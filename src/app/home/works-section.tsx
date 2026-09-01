"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  m,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Rule } from "@/components/motion/rule";
import { SectionHeading } from "@/components/site/section-heading";
import { CornerMarks } from "@/components/site/corner-marks";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PROJECTS, type Project } from "./projects";
import dynamic from "next/dynamic";

const ProjectModal = dynamic(
  () => import("./project-modal").then((mod) => mod.ProjectModal),
  { ssr: false },
);

const THUMB_W = 240;
const THUMB_H = 160;

export function WorksSection() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  /* Miniatura flutuante que segue o cursor (desktop) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left + 24);
    my.set(e.clientY - r.top - THUMB_H / 2);
  };

  const hoveredProject = PROJECTS.find((p) => p.id === hovered) ?? null;

  return (
    <>
      <section
        id="trabalho"
        className="section-pad"
        aria-labelledby="trabalho-title"
      >
        <div className="container-studio">
          <SectionHeading
            index="04"
            eyebrow="Trabalho"
            title="Trabalho selecionado"
            sub="Setores diferentes, mesma régua."
            id="trabalho-title"
          />

          <div className="relative mt-14 md:mt-20">
            <CornerMarks inset={16} className="hidden md:block" />

            {/* cabeçalho das colunas */}
            <div className="hidden grid-cols-12 gap-x-6 pb-3 md:grid">
              <span className="eyebrow col-span-4">Projeto</span>
              <span className="eyebrow col-span-2">Setor</span>
              <span className="eyebrow col-span-5">O que foi feito</span>
              <span className="eyebrow col-span-1 text-right">Ano</span>
            </div>
            <Rule />

            <div
              ref={listRef}
              className="relative"
              onMouseMove={onMove}
              onMouseLeave={() => setHovered(null)}
            >
              <ul>
                {PROJECTS.map((p, i) => {
                  const dim = hovered !== null && hovered !== p.id;
                  const active = hovered === p.id;
                  return (
                    <li key={p.id}>
                      <Reveal delay={Math.min(i * 0.04, 0.3)}>
                        <button
                          type="button"
                          onClick={() => setSelected(p)}
                          onMouseEnter={() => setHovered(p.id)}
                          onFocus={() => setHovered(p.id)}
                          onBlur={() => setHovered(null)}
                          className={cn(
                            "grid w-full grid-cols-12 items-center gap-x-4 gap-y-1 py-5 text-left transition-colors duration-500 md:gap-x-6 md:py-6",
                            dim ? "text-ink-soft" : "text-ink",
                          )}
                          aria-label={`${p.title} — ${p.work}. Abrir detalhes`}
                        >
                          {/* miniatura só no mobile */}
                          <span className="relative col-span-3 aspect-[4/3] overflow-hidden rounded-[6px] border border-line bg-surface-2 md:hidden">
                            <Image
                              src={p.image}
                              alt=""
                              fill
                              sizes="120px"
                              className="img-duotone object-cover object-top"
                            />
                          </span>

                          <span className="col-span-9 flex flex-col gap-1 md:col-span-4 md:flex-row md:items-center md:gap-3">
                            <span
                              className={cn(
                                "font-display text-[18px] leading-tight tracking-[-0.02em] transition-[font-weight] duration-300 md:text-[20px]",
                                active ? "font-bold" : "font-medium",
                              )}
                            >
                              {p.title}
                            </span>
                            <span
                              aria-hidden
                              className={cn(
                                "hidden items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:inline-flex",
                                active
                                  ? "translate-x-0 opacity-100"
                                  : "-translate-x-2 opacity-0",
                              )}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                            <span className="text-[13px] text-ink-soft md:hidden">
                              {p.sector} · {p.work} · {p.year}
                            </span>
                          </span>

                          <span className="hidden text-[15px] md:col-span-2 md:block">
                            {p.sector}
                          </span>
                          <span className="hidden text-[15px] md:col-span-5 md:block">
                            {p.work}
                          </span>
                          <span className="hidden text-[15px] tabular-nums md:col-span-1 md:block md:text-right">
                            {p.year}
                          </span>
                        </button>
                      </Reveal>
                      <Rule delay={Math.min(i * 0.04, 0.3)} />
                    </li>
                  );
                })}
              </ul>
              {/* thumbnail flutuante (desktop, ponteiro fino) */}
              {!reduced && (
                <div className="pointer-events-none absolute inset-0 hidden overflow-visible [@media(pointer:fine)]:md:block">
                  <AnimatePresence>
                    {hoveredProject && (
                      <m.div
                        key={hoveredProject.id}
                        className="absolute left-0 top-0 z-10 overflow-hidden rounded-[8px] border border-line bg-surface shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
                        style={{
                          x: sx,
                          y: sy,
                          width: THUMB_W,
                          height: THUMB_H,
                        }}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <m.div
                          className="relative h-full w-full"
                          initial={{ filter: "grayscale(1)", scale: 1 }}
                          animate={{ filter: "grayscale(0)", scale: 1.03 }}
                          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                        >
                          <Image
                            src={hoveredProject.image}
                            alt=""
                            fill
                            sizes={`${THUMB_W}px`}
                            className="object-cover object-top"
                          />
                        </m.div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProjectModal
        project={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
