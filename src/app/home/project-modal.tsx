"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLenis } from "@/components/motion/smooth-scroll";
import type { Project } from "./projects";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  /* Trava o scroll (lenis + fallback) enquanto o modal está aberto */
  useEffect(() => {
    const html = document.documentElement;
    const lenis = getLenis();
    if (isOpen) {
      lenis?.stop();
      html.classList.add("modal-open");
    } else {
      lenis?.start();
      html.classList.remove("modal-open");
    }
    return () => {
      lenis?.start();
      html.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!project) return null;

  const tech = project.technologies.filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-lenis-prevent
        className="max-h-[90vh] overflow-y-auto rounded-[8px] border-line bg-surface p-0 sm:max-w-3xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-surface-2">
          <Image
            src={project.image}
            alt={project.alt ?? `Captura do projeto ${project.title}`}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover object-top"
          />
        </div>

        <div className="p-6 md:p-8">
          <DialogHeader className="text-left">
            <p className="eyebrow">
              {project.sector} · {project.year}
            </p>
            <DialogTitle className="mt-2 font-display text-[26px] font-semibold leading-[1.2] tracking-[-0.015em] text-ink md:text-[30px]">
              {project.title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-[15px] text-ink-soft">
              {project.work}
            </DialogDescription>
          </DialogHeader>

          <p className="mt-5 text-[16px] leading-relaxed text-ink md:text-[17px]">
            {project.description}
          </p>

          {tech.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tecnologias">
              {tech.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line px-3 py-1 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-soft"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-[8px] bg-ink px-[22px] py-[14px] text-[15px] font-medium text-bg transition-colors hover:bg-black"
            >
              Ver projeto
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
