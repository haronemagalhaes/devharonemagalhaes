"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Mail, href: "mailto:harone@example.com", label: "Email" },
  ];

  const quickLinks = [
    { label: "Serviços", href: "#servicos" },
    { label: "Trabalhos", href: "#trabalhos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <footer
      id="contato"
      className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl mb-4 text-white">Harone Magalhães</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Desenvolvedor especializado em criar experiências digitais modernas
              e funcionais.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="mb-4 text-white">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/80 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-4 text-white">Conecte-se</h4>

            <div className="flex flex-wrap gap-3 mb-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Button
                  key={label}
                  asChild
                  variant="outline"
                  className="rounded-xl border-white/10 bg-white/5 text-white
                             hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300
                             transition-all duration-200 flex items-center gap-2 px-4 py-2"
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </a>
                </Button>
              ))}
            </div>

            <Button
              asChild
               onClick={() =>
    window.open(
      "https://wa.me/5579981164388?text=Olá%20Harone!%20Tenho%20interesse%20em%20criar%20um%20projeto%20digital%20com%20você.%20Podemos%20conversar%20sobre%20detalhes%20e%20possibilidades%3F",
      "_blank"
    )
  }
              className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl py-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200"
            >
              <a href="">Contato</a>
            </Button>

            <p className="text-sm text-white/80 mt-4"></p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-white/10 text-center text-sm text-white/70"
        >
          <p>© {currentYear} Harone. Todos os direitos reservados.</p>
        </motion.div>
      </div>
    </footer>
  );
}
