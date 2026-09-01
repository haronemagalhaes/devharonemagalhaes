"use client";

import { useCallback, useEffect, useState } from "react";
import { m, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Lockup } from "@/components/site/lockup";
import { StudioButton } from "@/components/site/studio-button";
import { AnchorLink } from "@/components/site/anchor-link";
import { scrollToId } from "@/components/motion/smooth-scroll";
import {
  CONTACT_ID,
  CTA_PRIMARY,
  CTA_SECONDARY_WHATSAPP,
  NAV_LINKS,
  RESPONSE_TIME,
  WHATSAPP_DEFAULT_MESSAGE,
  whatsappUrl,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const SCROLL_THRESHOLD = 40;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.2,
  });

  /* Encolhe + ganha fio ao rolar > 40px */
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

  /* Seção ativa no menu */
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onNav = useCallback((id: string) => {
    setOpen(false);
    // deixa o sheet fechar antes de rolar
    window.setTimeout(() => scrollToId(id), 60);
  }, []);

  return (
    <header
      id="site-header"
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-bg/85 backdrop-blur-md transition-[border-color,background-color] duration-500",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      {/* Barra de progresso — fina, --ink, sem gradiente */}
      <m.div
        aria-hidden
        style={{ scaleX: reduced ? scrollYProgress : progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-ink"
      />

      <div
        className={cn(
          "container-studio flex items-center justify-between gap-6 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "h-[60px]" : "h-[76px]",
        )}
      >
        <AnchorLink href="#top" className="rounded-[4px]" title="Voltar ao início">
          <span className="hidden xl:inline-flex">
            <Lockup />
          </span>
          <span className="inline-flex xl:hidden">
            <Lockup compact />
          </span>
        </AnchorLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {NAV_LINKS.map(({ label, id }) => (
            <AnchorLink
              key={id}
              href={`#${id}`}
              className={cn(
                "link-line py-2 text-[14px] font-medium transition-colors duration-300",
                active === id ? "text-ink" : "text-ink-soft hover:text-ink",
              )}
              aria-current={active === id ? "true" : undefined}
            >
              {label}
            </AnchorLink>
          ))}
        </nav>

        {/* lado direito: só o CTA (outline, encolhe junto com a barra) + menu mobile.
            "Resposta em até 1 dia útil" saiu daqui — segue no menu mobile e no rodapé. */}
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex">
            <StudioButton
              href={`#${CONTACT_ID}`}
              variant="outline"
              size="sm"
              className={cn(
                "transition-[height,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                scrolled && "h-[34px]",
              )}
            >
              {CTA_PRIMARY}
            </StudioButton>
          </span>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label={open ? "Fechar menu" : "Abrir menu"}
                  aria-controls="mobile-menu"
                  className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-line bg-surface text-ink"
                >
                  <Menu className="h-5 w-5" aria-hidden />
                </button>
              </SheetTrigger>

              <SheetContent
                id="mobile-menu"
                side="top"
                showCloseButton={false}
                className="border-b border-line bg-bg p-0 text-ink"
              >
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>

                <div className="container-studio flex h-[76px] items-center justify-between">
                  <Lockup compact />
                  <SheetClose asChild>
                    <button
                      type="button"
                      aria-label="Fechar menu"
                      className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-line bg-surface text-ink"
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                  </SheetClose>
                </div>

                <nav className="container-studio pb-8" aria-label="Menu">
                  <ul className="divide-y divide-line border-y border-line">
                    {NAV_LINKS.map(({ label, id }) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => onNav(id)}
                          className="flex w-full items-center justify-between py-4 text-left font-display text-2xl font-semibold tracking-[-0.01em]"
                          aria-current={active === id ? "true" : undefined}
                        >
                          {label}
                          <span aria-hidden className="text-ink-soft">→</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-col gap-3">
                    <StudioButton
                      onClick={() => onNav(CONTACT_ID)}
                      size="lg"
                      className="w-full"
                    >
                      {CTA_PRIMARY}
                    </StudioButton>
                    <StudioButton
                      href={whatsappUrl(WHATSAPP_DEFAULT_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      size="lg"
                      className="w-full"
                    >
                      {CTA_SECONDARY_WHATSAPP}
                    </StudioButton>
                    <p className="mt-2 text-center text-[13px] text-ink-soft">
                      {RESPONSE_TIME}
                    </p>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
