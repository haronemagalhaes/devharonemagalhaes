"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, ThumbsUp } from "lucide-react";
import { ProjectModal } from "@/app/home/project-modal"; // ajuste o caminho se o modal estiver em outro lugar

type Project = {
  id: string;
  title: string;
  image: string;
  category: "Web" | "Automação" | "Dashboard";
  likes: number;
  views: number;
  description: string;
  technologies: string[];
  link?: string;
  aspectRatio: "16/9" | "4/3" | "1/1";
};

const projects: Project[] = [
  {
    id: "1",
    title: "Dashboard Analytics Pro",
    image:
      "https://images.unsplash.com/photo-1665470909939-959569b20021?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    category: "Dashboard",
    likes: 234,
    views: 1520,
    description:
      "Dashboard completo para análise de métricas e KPIs em tempo real. Interface moderna com gráficos interativos.",
    technologies: ["Next.js", "React", "Recharts", "Tailwind CSS", "shadcn-ui"],
    link: "https://example.com",
    aspectRatio: "16/9",
  },
  {
    id: "2",
    title: "E-commerce Platform",
    image:
      "https://images.unsplash.com/photo-1658297063569-162817482fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    category: "Web",
    likes: 456,
    views: 2840,
    description:
      "Plataforma de e-commerce completa com carrinho, checkout, admin e integrações de pagamento.",
    technologies: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
    link: "https://example.com",
    aspectRatio: "4/3",
  },
  {
    id: "3",
    title: "Mobile App Design System",
    image:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    category: "Web",
    likes: 189,
    views: 980,
    description:
      "Design system completo para app mobile, com componentes, guia de estilo e documentação.",
    technologies: ["React Native", "Expo", "Styled Components", "Storybook"],
    link: "https://example.com",
    aspectRatio: "1/1",
  },
  {
    id: "4",
    title: "Automation Hub",
    image:
      "https://images.unsplash.com/photo-1761195696590-3490ea770aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    category: "Automação",
    likes: 312,
    views: 1650,
    description:
      "Plataforma de automação e integrações. Redução de 70% no tempo de processos manuais.",
    technologies: ["n8n", "Node.js", "Redis", "PostgreSQL", "Docker"],
    link: "https://example.com",
    aspectRatio: "16/9",
  },
  {
    id: "5",
    title: "Business Intelligence Suite",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    category: "Dashboard",
    likes: 567,
    views: 3210,
    description:
      "Suite de BI com análise preditiva, relatórios customizáveis e múltiplas fontes de dados.",
    technologies: ["React", "D3.js", "Python", "FastAPI", "MongoDB"],
    link: "https://example.com",
    aspectRatio: "4/3",
  },
  {
    id: "6",
    title: "Landing Page Conversion",
    image:
      "https://images.unsplash.com/photo-1753715613373-90b1ea010731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    category: "Web",
    likes: 423,
    views: 2150,
    description:
      "Landing page de alta conversão com animações, SEO e integrações de marketing.",
    technologies: ["Next.js", "Framer Motion", "Analytics", "Vercel"],
    link: "https://example.com",
    aspectRatio: "1/1",
  },
];

const categories = ["Todos", "Web", "Automação", "Dashboard"] as const;
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
      <section id="trabalhos" className="py-24 relative">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4">Trabalhos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Projetos selecionados que demonstram qualidade e atenção aos detalhes
            </p>
          </motion.div>

          {/* Tabs Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category)}>
              <TabsList className="bg-white/5 backdrop-blur-sm border border-white/10">
                {categories.map((category) => (
                <TabsTrigger
  key={category}
  value={category}
  className="text-white data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 hover:text-cyan-300 transition-all duration-200"
>

                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Masonry-ish Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group cursor-pointer ${
                  index % 5 === 0 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: project.aspectRatio }}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3">
                        <p className="text-sm">Ver Projeto</p>
                      </div>
                    </div>
                  </div>

                  {/* Info bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg">{project.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{project.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{project.views}</span>
                        </div>
                      </div>
                    </div>
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
