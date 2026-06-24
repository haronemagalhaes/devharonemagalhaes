"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

/* Número e mensagem padrão (edite aqui). */
const MEU_WHATSAPP = "5579981164388";
const MENSAGEM = "Olá! Vim pelo site e gostaria de mais informações.";

/* Aparece só depois de rolar além do hero. */
const SCROLL_THRESHOLD = 300;

function isFormField(el: EventTarget | Element | null): boolean {
  const node = el as HTMLElement | null;
  if (!node || !node.tagName) return false;
  const tag = node.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    node.isContentEditable === true
  );
}

export function WhatsappFloat() {
  const [scrolled, setScrolled] = useState(false);
  const [typing, setTyping] = useState(false);
  const [orcamentoVisible, setOrcamentoVisible] = useState(false);

  // Mostrar após rolar um pouco.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esconder enquanto o usuário preenche um campo (teclado aberto no mobile).
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (isFormField(e.target)) setTyping(true);
    };
    const onFocusOut = () => {
      // Após o blur, confere se o foco foi para outro campo.
      window.setTimeout(() => setTyping(isFormField(document.activeElement)), 0);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Recolher (reduzir opacidade) quando a seção de Orçamento está na viewport.
  useEffect(() => {
    const el = document.getElementById("orcamento");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOrcamentoVisible(entry.isIntersecting),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldShow = scrolled && !typing;

  const href = `https://wa.me/${MEU_WHATSAPP}?text=${encodeURIComponent(
    MENSAGEM
  )}`;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: orcamentoVisible ? 0.45 : 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          /* z-40: acima do conteúdo, abaixo de modais/menu (z-50).
             Margem inferior maior no mobile p/ não cobrir chevrons / "Gerar orçamento". */
          className="group fixed bottom-36 right-4 z-40 sm:bottom-28 lg:bottom-6 lg:right-6"
        >
          {/* Tooltip (somente desktop, no hover) */}
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#0a0a0f]/95 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 md:block"
          >
            Fale comigo no WhatsApp
          </span>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 outline-none transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 focus-visible:ring-4 focus-visible:ring-[#25D366]/50 active:scale-95 lg:h-14 lg:w-14"
          >
            <FaWhatsapp className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
