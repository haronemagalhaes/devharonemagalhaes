"use client";

import Image from "next/image";
import { ExternalLink, Eye, ThumbsUp } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
  project: {
    id: string;
    title: string;
    image: string;
    category: string;
    likes: number;
    views: number;
    description: string;
    technologies: string[];
    link?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0f]/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-3xl mb-4">{project.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
       
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

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span>{project.likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{project.views}</span>
            </div>
            <Badge variant="secondary" className="bg-white/5 border-white/10">
              {project.category}
            </Badge>
          </div>


          <div>
            <h3 className="text-xl mb-3">Sobre o Projeto</h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <h3 className="text-xl mb-3">Tecnologias Utilizadas</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {project.link && (
            <Button
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
              onClick={() => window.open(project.link!, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Projeto
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
