"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/assets/Logomarca.png";

// Função: Saudação conforme horário de Brasília (America/Sao_Paulo)
function getSaudacao(): string {
  const horaStr = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo", // Horário de Brasília
  }).format(new Date());
  const hour = parseInt(horaStr, 10);

  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

// Abrir WhatsApp com mensagem formatada
function abrirWhatsApp(mensagem: string) {
  const url = `https://wa.me/5579981164388?text=${encodeURIComponent(mensagem)}`;
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
      {/* Fundo com efeito parallax */}
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

      {/* Conteúdo principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white/10 border-[3px] border-cyan-500/40 
                       flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden 
                       hover:shadow-cyan-500/50 transition-all duration-500"
          >
            <Image
              src={Logo}
              alt="Logomarca Harone"
              className="object-contain"
              width={144}
              height={144}
              priority
            />
          </motion.div>

          {/* Título e status */}
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

          {/* Subtítulo */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-2"
          >
            <p className="text-xl text-white">
              Desenvolvedor | Landing Page | Sites | Portfólio | Automação de Tarefas
            </p>
            <div className="flex items-center gap-2 justify-center text-white">
              {/* <Globe className="w-4 h-4 text-white" /> */}
              <span className="text-sm"></span>
            </div>
          </motion.div>

          {/* Botão de mensagem */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => {
                const saudacao = getSaudacao();
                const mensagem = `${saudacao}, Harone! Tenho interesse em criar um projeto com você. Podemos conversar sobre detalhes e possibilidades?`;
                abrirWhatsApp(mensagem);
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 rounded-full 
                         text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 
                         transition-all duration-200"
            >
              Mensagem
            </Button>
          </motion.div>

          {/* Card informativo */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12"
          >
            <Card
              className="mx-auto w-[580px] max-w-[92vw]
                         rounded-3xl border border-white/10
                         bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl
                         shadow-lg shadow-cyan-500/10
                         hover:border-cyan-400/40 hover:shadow-cyan-400/20
                         transition-all duration-500"
            >
              <CardContent className="px-6 py-5 text-center space-y-4">
                <h3 className="text-[15px] leading-6 text-white/90">
                  Desenvolvo soluções digitais{" "}
                  <span className="text-white font-medium">sob medida para o seu negócio!</span>{" "}
                  <span className="text-white font-medium">Landing pages,</span>{" "}
                  <span className="text-white font-medium">sites</span>,{" "}
                  <span className="text-white font-medium">portfólios</span> e{" "}
                  <span className="text-white font-medium">automações inteligentes</span>{" "}
                  que{" "}
                  <span className="text-cyan-400 font-semibold">destacam sua marca</span>,{" "}
                  otimizam processos e geram resultados reais.
                </h3>

                <div className="mx-auto h-px w-10/12 bg-white/10" />

                <div className="text-[13px] text-white/70 leading-6">
                  <span className="text-white/80">Freelance / Projeto</span>
                  <span className="mx-2 text-white/20">•</span>
                  Disponível: <span className="text-cyan-400 font-medium">Agora</span>
                </div>

                <Button
                  onClick={() => {
                    const saudacao = getSaudacao();
                    const mensagem = `${saudacao}, Harone! Quero iniciar um projeto com você.`;
                    abrirWhatsApp(mensagem);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-600"
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
