"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectModal } from "@/app/home/project-modal";

type Project = {
  id: string;
  title: string;
  image: string;
  category: "Web" | "Automação" | "Dashboard";
  description: string;
  technologies: string[];
  link?: string;
  aspectRatio: "16/9" | "4/3" | "1/1";
};

const projects: Project[] = [
  {
    id: "vitalle",
    title: "Centro Médico Vitalle",
    image: "/image.png",
    category: "Web",
    description:
      "Projeto desenvolvido para o Centro Médico Vitalle, com foco em presença digital, performance e acessibilidade. O site oferece navegação fluida e responsiva, permitindo que pacientes acessem serviços, especialidades e canais de contato de forma rápida e intuitiva em qualquer dispositivo.",
    technologies: [""],
    link: "https://centromedicovitalle.blog.br/",
    aspectRatio: "4/3",
  },
  {
    id: "albuquerque-va",
    title: "Albuquerque V.A — Moda Feminina",
    image: "/loja.png",
    category: "Web",
    description:
      "Projeto para a loja Albuquerque V.A, desenvolvido com foco em identidade visual, desempenho e experiência do usuário, conectando clientes aos canais de atendimento e redes sociais por meio de uma navegação fluida e responsiva.",
    technologies: [""],
    link: "https://abmoda.com.br",
    aspectRatio: "4/3",
  },
  {
    id: "angelica-cruz",
    title: "Angelica Cruz - Nutricionista",
    image: "/angelicacruz.jpeg",
    category: "Web",
    description:
      "Microsite estilo Linktree com design moderno, links rápidos e foco em agendamento.",
    technologies: [""],
    link: "https://www.angelicacruznutricionista.com.br",
    aspectRatio: "4/3",
  },
  {
    id: "unicortte",
    title: "Armarinho Unicortte",
    image: "/unicortte.jpeg",
    category: "Web",
    description:
      "Pagina desenvolvida para Armarinho Unicortte, apresentando botões de contato, cursos, plataforma online e informações da loja. Design leve, responsivo e alinhado à identidade da marca com mais de 30 anos de tradição.",
    technologies: [""],
    link: "https://armarinhounicortte.vercel.app/",
    aspectRatio: "4/3",
  },
];

const categories = ["Todos"] as const;
type Category = (typeof categories)[number];

export function WorksSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    selectedCategory === "Todos"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <>
      <section id="trabalhos" className="relative py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-3xl md:text-5xl text-white tracking-tight">
              Trabalhos
            </h2>
            <p className="mt-2 text-white/80 max-w-2xl mx-auto text-sm md:text-base">
              Projetos selecionados que demonstram qualidade e atenção aos
              detalhes.
            </p>
          </motion.div>

          <div className="flex justify-center mb-6 md:mb-8">
            <Tabs
              value={selectedCategory}
              onValueChange={(v) => setSelectedCategory(v as Category)}
            >
              <TabsList className="bg-white/5 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="px-4 py-2 text-white rounded-lg 
                    data-[state=active]:bg-cyan-500/20 
                    data-[state=active]:text-cyan-400 
                    hover:text-cyan-300 transition-all duration-200"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: project.aspectRatio }}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-2.5 text-sm text-white
                                   active:scale-[0.98] active:brightness-110 transition-all duration-200"
                      >
                        Ver Projeto
                      </button>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <h3 className="text-base md:text-lg text-white leading-snug">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
