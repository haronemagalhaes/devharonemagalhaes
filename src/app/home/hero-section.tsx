"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/assets/eu.jpeg";

/* Edite aqui a prova social (texto pequeno abaixo dos botões). */
const SOCIAL_PROOF = "• Atendimento online para todo o Brasil";

function getSaudacao(): string {
  const horaStr = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  const hour = parseInt(horaStr, 10);

  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

function abrirWhatsApp(mensagem: string) {
  const url = `https://wa.me/5579981164388?text=${encodeURIComponent(
    mensagem,
  )}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function scrollToTrabalhos() {
  const el = document.getElementById("trabalhos");
  if (!el) return;
  const header = document.getElementById("site-header");
  const offset = (header?.offsetHeight ?? 0) + 12;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/* Stagger de entrada dos elementos do hero. */
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* BLOCO: fundo */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1753715613373-90b1ea010731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/80 to-[#0a0a0f]" />
      </motion.div>

      {/* BLOCO: conteúdo principal */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-3xl px-6 py-20 lg:px-8"
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Foto + glow pulsante */}
          <motion.div
            variants={item}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="relative h-[140px] w-[140px] md:h-[170px] md:w-[170px]"
          >
            <motion.div
              aria-hidden
              animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-[42px] bg-gradient-to-br from-cyan-400/30 via-blue-500/15 to-purple-500/20 blur-md"
            />

            <div className="absolute inset-[6px] rounded-[38px] border border-cyan-400/20 bg-black/30 p-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#0f1117]">
                <Image
                  src={Logo}
                  alt="Foto de Harone Magalhães"
                  fill
                  priority
                  className="object-cover object-[center_30%]"
                  sizes="170px"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-white/5" />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
              </div>
            </div>
          </motion.div>

          {/* Nome (secundário) + cargo discreto + disponibilidade */}
          <motion.div variants={item} className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/55">
                Harone Magalhães
              </p>
              <p className="text-xs text-white/40">
                Desenvolvedor Web • Sistemas • Automação
              </p>
            </div>

            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 transition-colors duration-200">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Disponível agora (Freelance)
            </Badge>
          </motion.div>

          {/* H1: proposta de valor (destaque principal) */}
          <motion.h1
            variants={item}
            className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Você tem o que vender, mas seu cliente{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              sabe te encontrar?
            </span>
          </motion.h1>

          {/* Subtexto curto com palavras-chave dos serviços */}
          <motion.p
            variants={item}
            className="max-w-xl text-base text-white/70 md:text-lg"
          >
            Crio sites, landing pages e link na bio que transformam visitantes
            em clientes.
          </motion.p>

          {/* Botões */}
          <motion.div
            variants={item}
            className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:flex-row"
          >
            <Button
              onClick={() => {
                const saudacao = getSaudacao();
                const mensagem = `${saudacao}, Harone! Quero criar meu site com você.`;
                abrirWhatsApp(mensagem);
              }}
              className="group w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:from-cyan-600 hover:to-blue-600 hover:shadow-cyan-400/40 hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
            >
              <span className="inline-flex items-center gap-2">
                Quero meu site
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={scrollToTrabalhos}
              className="w-full rounded-xl border-white/20 bg-transparent px-6 py-2.5 font-medium text-white transition-all duration-200 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-200 hover:scale-[1.03] sm:w-auto"
            >
              Ver trabalhos
            </Button>
          </motion.div>

          {/* Prova social (editável em SOCIAL_PROOF) */}
          <motion.p
            variants={item}
            className="text-xs text-white/45 md:text-sm"
          >
            {SOCIAL_PROOF}
          </motion.p>
        </div>
      </motion.div>

      {/* BLOCO: fade inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </div>
  );
}
