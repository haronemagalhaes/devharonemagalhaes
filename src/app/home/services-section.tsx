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

  },
  {
    icon: Briefcase,
    title: "Portfólio",
    description:
      "Portfólios personalizados para destacar seus projetos e conquistas de forma elegante.",
  
  },
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    description:
      "Páginas de alta conversão, otimizadas para transformar visitantes em clientes.",
 
  },
];

export function ServicesSection() {
  return (
    <section id="servicos" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl md:text-5xl text-white">Categorias de Serviços</h2>
          <p className="mx-auto max-w-2xl text-white/70">
            Soluções completas para transformar suas ideias em realidade digital
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <Card
                  className="
                    group h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
                    transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40
                    hover:shadow-lg hover:shadow-cyan-500/10
                  "
                >
                  <CardHeader>
                    <div
                      className="
                        mb-4 flex h-12 w-12 items-center justify-center rounded-xl
                        bg-gradient-to-br from-cyan-500/20 to-blue-600/20
                        transition-colors duration-300
                        group-hover:from-cyan-500/30 group-hover:to-blue-600/30
                      "
                    >
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl text-white">{service.title}</h3>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="leading-relaxed text-white/80">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                  
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
