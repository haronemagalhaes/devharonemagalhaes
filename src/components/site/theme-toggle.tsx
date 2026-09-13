"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * O tema atual lido do DOM (a classe que o next-themes carimba no <html>),
 * não do estado do React.
 *
 * `useSyncExternalStore` porque ele tem uma passada de servidor SEPARADA:
 * `false` no HTML gerado e no primeiro render do cliente — iguais, logo sem
 * divergência de hidratação —, e a leitura real do DOM logo depois. É o
 * mesmo resultado de um `useState` + `useEffect` de montagem, sem chamar
 * setState dentro de efeito (que o compilador do React reprova, com razão:
 * é um render a mais por montagem).
 *
 * O MutationObserver mantém o `aria-checked` certo mesmo quando quem muda o
 * tema não é este botão — por exemplo, a troca feita em outra aba.
 */
function subscribeToTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

const isDarkNow = () => document.documentElement.classList.contains("dark");
/* passada do servidor e primeiro render do cliente: sempre o mesmo valor */
const isDarkOnServer = () => false;

/**
 * Alternador claro/escuro em formato de INTERRUPTOR — trilho arredondado,
 * pino que desliza, sol de um lado e lua do outro.
 *
 * Mora no rodapé (saiu do header em 2026-09-04): é preferência de leitura,
 * não navegação, e no header ele competia com o CTA, que é a ação mais
 * importante da página.
 *
 * RÓTULO. Texto fixo "Tema" ao lado, e não "Tema escuro"/"Tema claro"
 * alternando. Duas razões: (1) rótulo que troca de texto muda de largura e
 * empurra o que está do lado a cada clique; (2) rótulo que muda é ambíguo —
 * o leitor não sabe se está lendo o estado atual ou a ação que o botão faz.
 * Aqui o estado mora no próprio interruptor (pino sobre o sol ou sobre a
 * lua), que é o que a forma de switch já promete, e "Tema" só diz do que se
 * trata. No header o ícone sozinho passava porque não havia mais nada em
 * volta; no rodapé, entre links e endereço, interruptor solto vira charada.
 *
 * ESTADO SEM PISCAR. O que se VÊ (posição do pino, qual ícone está aceso)
 * é decidido pela variante `dark:` do CSS, que depende da classe carimbada
 * no <html> pelo script bloqueante do next-themes antes da primeira pintura
 * — servidor e cliente geram a mesma marcação, então não há divergência de
 * hidratação nem lampejo de tema errado. Só o `aria-checked`, que é
 * atributo e não CSS, precisa de JS: ver `subscribeToTheme` abaixo. Leitor
 * de tela lê o DOM já hidratado, então ouve o valor certo.
 *
 * A preferência persiste entre visitas — localStorage ("hm-theme"), pelo
 * next-themes. Sem escolha salva, o site abre no claro: o tema do sistema
 * não conta (ver components/theme-provider.tsx).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const isDark = useSyncExternalStore(subscribeToTheme, isDarkNow, isDarkOnServer);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="text-ink-soft">Tema</span>

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        /* contém a palavra visível "Tema" — WCAG 2.5.3 (Label in Name) */
        aria-label="Tema escuro"
        onClick={() =>
          setTheme(
            document.documentElement.classList.contains("dark") ? "light" : "dark",
          )
        }
        className={cn(
          "relative inline-flex h-[28px] w-[52px] shrink-0 items-center rounded-full",
          "border border-ink/20 bg-surface-2",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        )}
      >
        {/* pino — desliza 24px (50px de caixa interna − 2 de folga × 2 − 22 de
            pino). A transição mora no CSS (.theme-switch-knob, em
            globals.css) e não numa classe do Tailwind: o
            `disableTransitionOnChange` do provider derruba `transition` com
            `!important` na hora da troca, e o pino é a única coisa da página
            que precisa escapar disso — senão ele salta em vez de deslizar. */}
        <span
          aria-hidden
          className={cn(
            "theme-switch-knob",
            "absolute left-[2px] top-[2px] h-[22px] w-[22px] rounded-full bg-ink",
            "translate-x-0 dark:translate-x-[24px]",
          )}
        />

        {/* os dois estados, por cima do pino: o ativo fica em cor de papel
            sobre a tinta do pino, o inativo em tinta a 55% sobre o trilho
            (3,9:1 no claro, 5,3:1 no escuro — passa o 3:1 de componente) */}
        <span
          aria-hidden
          className="pointer-events-none relative z-10 flex w-full items-center justify-between px-[7px]"
        >
          <Sun className="h-[13px] w-[13px] text-bg dark:text-ink/55" />
          <Moon className="h-[13px] w-[13px] text-ink/55 dark:text-bg" />
        </span>
      </button>
    </div>
  );
}
