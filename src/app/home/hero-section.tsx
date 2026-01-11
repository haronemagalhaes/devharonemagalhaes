"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/assets/Logomarca.png";

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
    mensagem
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            whileHover={{ y: -2, rotateX: 6, rotateY: -6 }}
            whileTap={{ scale: 0.98 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative h-[128px] w-[128px] md:h-[144px] md:w-[144px]"
          >
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
              className="absolute inset-0 rounded-[42px] bg-[conic-gradient(from_90deg,rgba(34,211,238,.0),rgba(34,211,238,.65),rgba(59,130,246,.55),rgba(168,85,247,.40),rgba(34,211,238,.0))] p-[2px]"
            >
              <div className="h-full w-full rounded-[40px] bg-transparent md:bg-[#0a0a0f]/70" />
            </motion.div>
            <div
              className="pointer-events-none absolute inset-0 opacity-0 md:opacity-[0.22]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(255,255,255,.10), transparent 45%), radial-gradient(circle at 80% 30%, rgba(34,211,238,.12), transparent 55%), radial-gradient(circle at 50% 90%, rgba(59,130,246,.10), transparent 55%)",
              }}
            />
            <motion.div
              aria-hidden
              animate={{ x: [-24, 160], y: [110, -20] }}
              transition={{
                duration: 4.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="pointer-events-none absolute hidden md:block h-10 w-10 rounded-full bg-cyan-400/25 blur-xl"
            />

            <div className="relative flex h-full w-full items-center justify-center p-4">
              <div className="relative flex h-full w-full items-center justify-center rounded-[30px] bg-transparent md:bg-black/25 ring-0 md:ring-1 md:ring-white/10 overflow-hidden">
                <div className="relative flex items-center justify-center h-full w-full rounded-[28px] overflow-hidden bg-white/95 ring-1 ring-black/5 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
                  <Image
                    src={Logo}
                    alt="Logomarca Harone"
                    width={118}
                    height={118}
                    priority
                    className="object-contain scale-[1.12]"
                  />
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]" />
                </div>
                <div className="pointer-events-none absolute hidden md:block -left-10 -top-10 h-28 w-44 rotate-[-18deg] bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl tracking-tight text-white font-semibold">
              Harone Magalhães
            </h1>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 transition-colors duration-200">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Disponível agora (Freelance)
            </Badge>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 md:mt-12"
          >
            <Card
              className="mx-auto w-[580px] max-w-[92vw]
                         rounded-3xl border border-white/10
                         bg-black/40 backdrop-blur-2xl
                         shadow-lg shadow-cyan-500/10
                         hover:border-cyan-400/40 hover:shadow-cyan-400/20
                         transition-all duration-500"
            >
              <CardContent className="px-6 py-5 text-center space-y-4">
                <h3 className="text-[22px] leading-6 text-white/90">
                  Desenvolvo soluções digitais que{" "}
                  <span className="text-cyan-400 font-semibold">
                    destacam sua marca
                  </span>
                  , otimizam processos e geram resultados
                </h3>

                <div className="mx-auto h-px w-10/12 bg-white/10" />

                <Button
                  onClick={() => {
                    const saudacao = getSaudacao();
                    const mensagem = `${saudacao}, Harone! Quero iniciar um projeto com você.`;
                    abrirWhatsApp(mensagem);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white
                             hover:from-cyan-600 hover:to-blue-600
                             active:scale-[0.98] active:brightness-110
                             transition-all duration-200"
                >
                  Iniciar proposta
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />
    </div>
  );
}
