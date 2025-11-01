"use client";

import { motion } from "framer-motion";
import { Mail, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Mail,
      href: "mailto:haronemagalhaesdev@gmail.com",
      label: "Email",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/haronemagalhaes?igsh=MTJ6c2cwbGx6ZnY3ZQ%3D%3D&utm_source=qr",
      label: "Instagram",
    },
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
      aria-labelledby="footer-title"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 id="footer-title" className="text-2xl mb-4 text-white">
              Harone Magalhães
            </h3>
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
            <h4 className="mb-4 text-white">Navegação</h4>
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
              {socialLinks.map(({ icon: Icon, href, label }) => {
                const isMailto = href.startsWith("mailto:");
                return (
                  <Button
                    key={label}
                    asChild
                    type="button"
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/5 text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-200 px-4 py-2"
                  >
                    <a
                      href={href}
                      target={isMailto ? undefined : "_blank"}
                      rel={isMailto ? undefined : "noopener noreferrer"}
                      aria-label={label}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </span>
                    </a>
                  </Button>
                );
              })}
            </div>

            <Button
              asChild
              className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl py-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200"
            >
              <a
                href="#whatsapp"
                onClick={(e) => {
                  e.preventDefault();
                  const hour = new Date().getHours();
                  let saudacao = "Olá";
                  if (hour >= 5 && hour < 12) saudacao = "Bom dia";
                  else if (hour >= 12 && hour < 18) saudacao = "Boa tarde";
                  else saudacao = "Boa noite";

                  const mensagem = `${saudacao}! Tudo bem? Tenho interesse em conversar sobre um projeto digital e gostaria de saber como funciona o seu processo de trabalho.`;
                  const link = `https://wa.me/5579981164388?text=${encodeURIComponent(
                    mensagem
                  )}`;
                  window.open(link, "_blank", "noopener,noreferrer");
                }}
                aria-label="Abrir conversa no WhatsApp"
              >
                Contato
              </a>
            </Button>

            <p className="text-sm text-white/80 mt-4" />
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
