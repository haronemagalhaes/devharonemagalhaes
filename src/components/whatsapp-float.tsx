"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { CONTACT_ID, WHATSAPP_DEFAULT_MESSAGE, whatsappUrl } from "@/lib/site";

/* Aparece só depois de rolar além do hero. */
const SCROLL_THRESHOLD = 400;

function isFormField(el: EventTarget | Element | null): boolean {
  const node = el as HTMLElement | null;
  if (!node || !node.tagName) return false;
  const tag = node.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || node.isContentEditable === true;
}

/** Atalho flutuante pro WhatsApp — secundário, monocromático. */
export function WhatsappFloat() {
  const [scrolled, setScrolled] = useState(false);
  const [typing, setTyping] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (isFormField(e.target)) setTyping(true);
    };
    const onFocusOut = () => {
      window.setTimeout(() => setTyping(isFormField(document.activeElement)), 0);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById(CONTACT_ID);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldShow = scrolled && !typing && !contactVisible;

  return (
    <AnimatePresence>
      {shouldShow && (
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          /* + --scroll-lock-gap: com o menu mobile aberto a barra de rolagem
             some e a viewport cresce; o header devolve essa largura (ver a
             trava em header.tsx) e o botão acompanha, pra não andar pro lado */
          className="group fixed bottom-5 right-[calc(1.25rem+var(--scroll-lock-gap,0px))] z-40 md:bottom-6 md:right-[calc(1.5rem+var(--scroll-lock-gap,0px))]"
        >
          <a
            href={whatsappUrl(WHATSAPP_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chamar no WhatsApp"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.3)] dark:border-ink/25 dark:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] transition-colors duration-300 hover:bg-ink hover:text-bg"
          >
            <WhatsappIcon className="h-5 w-5" />
          </a>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5L9.1 6.9c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 12 .2C5.5.2.2 5.5.2 12c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7a11.8 11.8 0 0 0 5.7 1.5c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.4-8.4z" />
    </svg>
  );
}
