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
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
