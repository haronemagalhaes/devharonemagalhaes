"use client";

import { m } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Pilha de cards com sticky (cards-stack, 21st.dev), reescrito na
 * identidade do projeto — o código original não veio, só a descrição.
 * Zero dependência nova: `motion/react` → framer-motion, que o projeto já
 * carrega via LazyMotion (por isso `m`, não `motion`).
 *
 * Mecânica: cada card é `position: sticky` com um `top` incremental
 * (`incrementY * index`), então o card N gruda um pouco abaixo do N−1 e o
 * seguinte sobe por cima, deixando à mostra a faixa do anterior. A altura
 * de rolagem vem do fluxo — o gap entre os cards — e não de um
 * `min-h-[400vh]` cravado: assim ela é proporcional ao número de cards.
 *
 * Decisões contra o demo:
 *   - sem `perspective`/`translateZ`: medido, não muda um pixel do render
 *     (ver comentário em `incrementZ`)
 *   - sem `layout="position"`: força medição a cada render e briga com o
 *     sticky; nada aqui muda de posição por animação
 *   - sem rotação por índice: com cards de texto longo fica desleixado
 *   - zero cor: cabe a quem usa passar as classes
 */

export function ContainerScroll({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("relative w-full", className)} style={style}>
      {children}
    </div>
  );
}

export function CardSticky({
  index,
  incrementY = 0,
  topBase = 0,
  children,
  className,
  style,
  ...rest
}: {
  /** posição na pilha, a partir de 0 */
  index: number;
  /** deslocamento vertical acumulado por índice, em px */
  incrementY?: number;
  /** distância do topo da viewport para o primeiro card, em px */
  topBase?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
} & React.ComponentProps<typeof m.div>) {
  return (
    <m.div
      className={cn("sticky", className)}
      style={{ top: topBase + incrementY * index, ...style }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
