"use client";

import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; 

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/5"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="text-xl tracking-tight">H</span>
          </motion.div>

          {/* Menu principal */}
          <nav className="hidden md:flex items-center gap-8">
            {["Serviços", "Trabalhos", "Sobre", "Contato"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
              className="text-white hover:text-cyan-400 transition-colors duration-200"

              >
                {item}
              </button>
            ))}
          </nav>

          {/* Botão principal */}
        <Button
  variant="ghost"
  onClick={() => scrollToSection("contato")}
  className="text-white border border-cyan-500/50 rounded-md
             bg-transparent hover:bg-cyan-500/10 hover:text-cyan-300
             focus-visible:ring-0 focus-visible:outline-none"
>
  Fale comigo
</Button>

        </div>
      </div>
    </motion.header>
  );
}
