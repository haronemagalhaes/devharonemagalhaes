"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  PanelsTopLeft,
  Briefcase,
  MessageSquareText,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

type LinkItem = { label: string; id: string; icon: LucideIcon };

const LINKS: LinkItem[] = [
  { label: "Início", id: "inicio", icon: Home },
  { label: "Serviços", id: "servicos", icon: PanelsTopLeft },
  { label: "Trabalhos", id: "trabalhos", icon: Briefcase },
  { label: "Contato", id: "contato", icon: MessageSquareText },
];

function ensureInicioSentinel() {
  if (typeof document === "undefined") return;
  if (document.getElementById("inicio")) return;
  if (!document.getElementById("inicio-sentinel")) {
    const d = document.createElement("div");
    d.id = "inicio-sentinel";
    d.style.height = "1px";
    document.body.prepend(d);
  }
}

function headerOffset() {
  const h = document.getElementById("site-header");
  return (h?.offsetHeight ?? 0) + 8;
}

function scrollToId(id: string) {
  if (id === "inicio" || id === "inicio-sentinel") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function Header() {
  const [active, setActive] = useState<string>("inicio");
  const [open, setOpen] = useState(false);

  // progress bar
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.2,
  });

  useEffect(() => {
    ensureInicioSentinel();
  }, []);

  const rafLock = useRef(false);
  const recomputeAndPick = useCallback(() => {
    const observedIds = LINKS.map((l) => l.id);
    if (!document.getElementById("inicio") && document.getElementById("inicio-sentinel")) {
      observedIds[0] = "inicio-sentinel";
    }
    const els = observedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (!els.length) return;

    const headerH = headerOffset();
    const ACTIVATION_RATIO = 0.38;
    const HYSTERESIS = 24;
    const yLine = window.scrollY + headerH + window.innerHeight * ACTIVATION_RATIO;

    const sections = els.map((el) => ({
      id: el.id,
      top: Math.max(0, el.getBoundingClientRect().top + window.scrollY),
    }));

    if (yLine < sections[0].top + HYSTERESIS) {
      setActive(sections[0].id === "inicio-sentinel" ? "inicio" : sections[0].id);
      return;
    }

    const atBottom =
      Math.abs(window.innerHeight + window.scrollY - document.documentElement.scrollHeight) <= 2;
    if (atBottom) {
      const last = sections[sections.length - 1].id;
      setActive(last === "inicio-sentinel" ? "inicio" : last);
      return;
    }

    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].top <= yLine) idx = i;
      else break;
    }

    const next = sections[idx + 1];
    if (next) {
      const boundary = next.top - HYSTERESIS;
      if (yLine >= boundary) idx = idx + 1;
    }

    const current = sections[idx].id;
    setActive(current === "inicio-sentinel" ? "inicio" : current);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      if (rafLock.current) return;
      rafLock.current = true;
      requestAnimationFrame(() => {
        recomputeAndPick();
        rafLock.current = false;
      });
    };
    const onResizeOrLoad = () => {
      recomputeAndPick();
    };

    requestAnimationFrame(recomputeAndPick);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResizeOrLoad);
    window.addEventListener("load", onResizeOrLoad);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResizeOrLoad);
      window.removeEventListener("load", onResizeOrLoad);
    };
  }, [recomputeAndPick]);

  const onNav = useCallback((id: string) => {
    setOpen(false);
    scrollToId(id);
  }, []);

  return (
    <header id="site-header" className="fixed inset-x-0 top-0 z-50">
      {/* progress bar */}
      <motion.div
        style={{ scaleX: progressX }}
        className="origin-left h-0.5 w-full bg-linear-to-r from-cyan-400 via-sky-400 to-blue-500"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mt-2 mb-2 flex h-14 items-center justify-between rounded-2xl px-4 border border-white/10 bg-white/5 backdrop-blur-xl">
          {/* Logo / Home */}
          <button
            onClick={() => onNav("inicio")}
            className="select-none text-lg font-semibold tracking-tight text-white/90 hover:text-white"
            aria-label="Voltar ao início"
          >
            H
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegação">
            {LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => onNav(id)}
                className="group relative px-0.5 text-sm font-medium text-white/80 hover:text-white"
                aria-current={active === id ? "page" : undefined}
              >
                {label}
                <span
                  className={[
                    "absolute -bottom-1 left-0 h-0.5 w-full rounded bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-300",
                    active === id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
                    "origin-left group-hover:opacity-100 group-hover:scale-x-100",
                  ].join(" ")}
                  aria-hidden
                />
              </button>
            ))}
          </nav>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                const hour = new Date().getHours();
                let saudacao = "Olá";
                if (hour >= 5 && hour < 12) saudacao = "Bom dia";
                else if (hour >= 12 && hour < 18) saudacao = "Boa tarde";
                else saudacao = "Boa noite";
                const mensagem = `${saudacao}! Tudo bem? Tenho interesse em conversar sobre um projeto digital e gostaria de saber como funciona o seu processo de trabalho.`;
                const link = `https://wa.me/5579981164388?text=${encodeURIComponent(mensagem)}`;
                window.open(link, "_blank");
              }}
              className="rounded-lg border border-cyan-500/50 bg-transparent text-white hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-200"
            >
              Fale comigo
            </Button>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    aria-label="Abrir menu"
                    className="rounded-lg border border-white/10 bg-white/5"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="top"
                  className="
                    border-none bg-[#0a0a0f]/90 text-white backdrop-blur-2xl p-0
                    transition-all duration-300 ease-out
                    data-[state=open]:opacity-100 data-[state=closed]:opacity-0
                    [&>button.absolute.right-4.top-4]:hidden
                  "
                >
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-base font-semibold">Navegação</span>
                    {/* ÚNICO botão de fechar (o padrão do Sheet fica oculto pela regra acima) */}
                    <SheetClose asChild>
                      <button
                        aria-label="Fechar"
                        className="rounded-md border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </SheetClose>
                  </div>

                  <Separator className="bg-white/10" />

                  <ScrollArea className="h-[60vh] px-3 py-3">
                    <ul className="space-y-2">
                      {LINKS.map(({ label, id, icon: Icon }) => (
                        <li key={id}>
                          <SheetClose asChild>
                            <button
                              onClick={() => onNav(id)}
                              className={[
                                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                                "border border-white/10 bg-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/10",
                                active === id ? "text-cyan-300" : "text-white/90",
                              ].join(" ")}
                              aria-current={active === id ? "page" : undefined}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="text-base font-medium">{label}</span>
                            </button>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>

                    <Separator className="my-4 bg-white/10" />

                    <div className="px-2">
                      <Button
                        onClick={() => {
                          window.open("https://wa.me/5579981164388", "_blank");
                          setOpen(false);
                        }}
                        className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-600"
                      >
                        Iniciar proposta
                      </Button>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
