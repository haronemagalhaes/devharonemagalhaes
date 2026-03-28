"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/assets/eu.jpeg";

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
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col items-center space-y-6 text-center md:space-y-8">
          {/* BLOCO: foto principal ajustada */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="relative h-[156px] w-[156px] md:h-[190px] md:w-[190px]"
          >
            {/* aura fixa, sem girar */}
            <div className="absolute inset-0 rounded-[42px] bg-gradient-to-br from-cyan-400/25 via-blue-500/15 to-purple-500/20 blur-md" />

            <div className="absolute inset-[6px] rounded-[38px] border border-cyan-400/20 bg-black/30 p-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#0f1117]">
                <Image
                  src={Logo}
                  alt="Foto de Harone Magalhães"
                  fill
                  priority
                  className="object-cover object-[center_30%]"
                  sizes="190px"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-white/5" />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
              </div>
            </div>
          </motion.div>

          {/* BLOCO: título e badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl tracking-tight text-white font-semibold">
                Harone Magalhães
              </h1>

              <p className="text-[16px] md:text-[18px] text-white/70">
                Desenvolvedor Web • Sistemas • Automação de Processos
              </p>

              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 transition-colors duration-200">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                Disponível agora (Freelance)
              </Badge>
            </div>
          </motion.div>

          {/* BLOCO: card CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 md:mt-12"
          >
            <Card className="mx-auto w-[580px] max-w-[92vw] rounded-3xl border border-white/10 bg-black/40 shadow-lg shadow-cyan-500/10 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-400/40 hover:shadow-cyan-400/20">
              <CardContent className="space-y-4 px-6 py-5 text-center">
                <h3 className="text-[20px] md:text-[22px] leading-relaxed text-white/90 max-w-[520px] mx-auto">
                  Você tem o que vender, mas seu cliente{" "}
                  <span className="text-cyan-400 font-semibold">
                    sabe te encontrar?
                  </span>
                </h3>

                <p className="text-[16px] md:text-[18px] text-white/70 max-w-[500px] mx-auto">
                  Eu construo a estrutura digital perfeita para transformar
                  visitantes em clientes.
                </p>

                <div className="mx-auto h-px w-10/12 bg-white/10" />

                <Button
                  onClick={() => {
                    const saudacao = getSaudacao();
                    const mensagem = `${saudacao}, Harone! Quero iniciar um projeto com você.`;
                    abrirWhatsApp(mensagem);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition-all duration-200 hover:from-cyan-600 hover:to-blue-600 active:scale-[0.98] active:brightness-110"
                >
                  Iniciar proposta
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* BLOCO: fade inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </div>
  );
}
