"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes com `attribute="class"` — casa com o `@custom-variant dark`
 * do globals.css e com o bloco `.dark { … }` dos tokens.
 *
 * O provider injeta um script bloqueante no <head> que carimba a classe
 * antes da primeira pintura: é ele que evita o flash de tema errado.
 * `disableTransitionOnChange` corta as transições de cor durante a troca —
 * sem isso a página inteira faz um fade de 300ms feio.
 *
 * O tema oficial é o CLARO. O escuro só entra quando a pessoa escolhe no
 * interruptor do rodapé — o tema do sistema/celular é ignorado de propósito
 * (`enableSystem={false}`), e quem nunca escolheu nada vê o claro.
 *
 * `storageKey="hm-theme"`: a chave antiga ("theme", padrão do next-themes)
 * guardava "system" para todo mundo que entrou antes, e às vezes "dark".
 * Trocar de chave zera essas escolhas herdadas: todo mundo volta ao claro, e
 * só a escolha feita daqui pra frente fica salva.
 *
 * `enableColorScheme={false}`: o `color-scheme` do <html> mora só no CSS
 * (globals.css, `html` / `html.dark`), sem estilo inline do script por cima.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme={false}
      storageKey="hm-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
