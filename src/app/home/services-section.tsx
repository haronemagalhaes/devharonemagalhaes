"use client";

import { motion } from "framer-motion";
import { Globe, Briefcase, LayoutTemplate } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    icon: Globe,
    title: "Desenvolvimento de Sites",
    description:
      "Sites profissionais e responsivos, desenvolvidos com as tecnologias mais modernas do mercado.",
    tags: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    icon: Briefcase,
    title: "Portfolio",
    description:
      "Portfólios personalizados para destacar seus projetos e conquistas de forma elegante.",
    tags: ["Design", "UX/UI", "Responsivo"],
  },
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    description:
      "Páginas de alta conversão, otimizadas para transformar visitantes em clientes.",
    tags: ["SEO", "Performance", "Conversão"],
  },
];

export function ServicesSection() {
  return (
    <section id="servicos" className="py-24 relative">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">Categorias de Serviços</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para transformar suas ideias em realidade digital
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                 <h3 className="text-xl text-white">{service.title}</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-white/5 text-cyan-400 border-white/10 hover:bg-white/10 transition-colors duration-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
