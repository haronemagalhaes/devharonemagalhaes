"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type ModalProject = {
  id: string;
  title: string;
  image: string;
  category: "Web" | "Automação" | "Dashboard" | "Site Institucional";
  description: string;
  link?: string;
};

interface ProjectModalProps {
  project: ModalProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  // 🔒 Evita "pulo" e bloqueia o scroll do fundo quando o modal abre
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      html.style.overflow = "hidden";
      html.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      html.style.overflow = "";
      html.style.paddingRight = "";
    }
    return () => {
      html.style.overflow = "";
      html.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0f]/95 backdrop-blur-xl border-white/10"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl mb-4 text-white">
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagem */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Categoria */}
          <div className="flex items-center gap-3">
            <Badge className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white">
              {project.category}
            </Badge>
          </div>

          {/* Descrição */}
          <div>
            <h3 className="text-xl mb-3 text-white">Sobre o Projeto</h3>
            <p className="text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Link funcional */}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 px-4 py-3 rounded-md font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Projeto
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
