"use client";

import { motion } from "framer-motion";
import { Globe, Briefcase, Bot, Link2 } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Sites & Landing Pages",
    bg: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1600&q=80",
  },
  {
    icon: Link2,
    title: "Link na Bio Personalizado",
    bg: "https://images.unsplash.com/photo-1618338279186-faccabd0411b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    icon: Briefcase,
    title: "Portfólio",
    bg: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    icon: Bot,
    title: "Automação de Tarefas",
    bg: "https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29ya2Zsb3clMjBhdXRvbWF0aW9ufGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",
  },
];

export function ServicesSection() {
  return (
    <section
      id="servicos"
      className="relative pt-2 pb-14 md:pt-0 md:pb-16 lg:pt-6 lg:pb-20 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-20 text-center"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">
            Categorias de Serviços
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-white/70 text-sm md:text-base leading-relaxed">
            Soluções completas para transformar suas ideias em realidade digital
          </p>
        </motion.div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.55), rgba(10,10,15,.92)), url("${service.bg}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/12 via-transparent to-blue-600/12" />

                <div className="relative flex min-h-[180px] items-end p-8 md:p-9">
                  <div className="absolute left-8 top-8 md:left-9 md:top-9 flex h-11 w-11 items-center justify-center rounded-2xl bg-black/35 ring-1 ring-white/10 backdrop-blur-md">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight line-clamp-2">
                    {service.title}
                  </h3>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
