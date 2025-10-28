"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Globe, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1753715613373-90b1ea010731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600')",
            filter: "grayscale(100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/80 to-[#0a0a0f]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
          >
            <Code className="w-7 h-7 text-white" />
          </motion.div>

          {/* Name & Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl tracking-tight">Harone</h1>

            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 transition-colors duration-200">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Disponível agora (Freelance)
            </Badge>
          </motion.div>

          {/* Role & Location */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-2"
          >
           <p className="text-xl text-white">Desenvolvedor</p>
<div className="flex items-center gap-2 text-white justify-center">
  <Globe className="w-4 h-4 text-white" />
  <span className="text-sm text-white">Aracaju-SE, Brasil</span>
</div>

          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200"
            >
              Mensagem
            </Button>
          </motion.div>

          {/* Hire Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12"
          >
         <Card className="w-[260px] mx-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center shadow-lg shadow-black/20 hover:border-cyan-500/30 hover:shadow-cyan-500/10 transition-all duration-300">
  <CardContent className="space-y-4">
    <h3 className="text-lg font-semibold text-white">Contratar Harone</h3>

    <div className="space-y-1 text-sm text-white/80">
      <p>Freelance / Projeto</p>
      <p>
        Disponível:{" "}
        <span className="text-cyan-400 font-medium">Agora</span>
      </p>
    </div>

    <Button
      variant="outline"
      className="w-full mt-3 rounded-full border border-cyan-500/40 text-white 
                 bg-transparent hover:bg-transparent hover:border-cyan-400 
                 hover:text-cyan-400 focus-visible:ring-0 
                 transition-all duration-300 font-medium shadow-none"
    >
      Iniciar proposta
    </Button>
  </CardContent>
</Card>

          </motion.div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />
    </div>
  );
}
