/*
 * Seção Produto (SI-Agenda) — etapas guiadas pelo scroll + notebook com o
 * print do sistema na tela.
 *
 * Imagens em /public/produto/:
 *   notebook.png — mockup do notebook, PNG com fundo E tela transparentes
 *                  (gerado do arquivo original, que vinha com xadrez pintado
 *                  e tela branca opaca; 343×254, proporção 1,350)
 *   sistema.png  — print do sistema (1372×892, proporção 1,538), em cor,
 *                  sem tratamento: é o produto real
 *
 * A tela, medida no notebook.png por análise de alfa (bbox da área
 * transparente interna): top 2,76% · left 11,08% · width 78,13% ·
 * height 66,54% → proporção 1,586. O print entra ali em object-contain
 * sobre fundo branco; a diferença de proporção (3%) vira uma barra fina
 * em cima e embaixo, que parece parte da tela.
 */

export const NOTEBOOK = {
  src: "/produto/notebook.png",
  width: 343,
  height: 254,
  /** área da tela, em % do PNG */
  screen: { top: 2.76, left: 11.08, width: 78.13, height: 66.54 },
} as const;

export const SYSTEM_SHOT = { src: "/produto/sistema.png", width: 1372, height: 892 } as const;

/**
 * Altura do spacer em vh. O palco (100svh) fica preso enquanto o spacer
 * rola; o scroll útil é SPACER_VH − 100. Com 4 etapas, 300vh dá 50vh de
 * rolagem por etapa (~450px a 900 de altura, ~330px num celular de 667):
 * o suficiente pra ler título + uma linha sem a próxima entrar no meio.
 * 250vh dava 37vh por etapa e a última passava rápido demais; 350vh
 * alongava sem ganho de leitura.
 */
export const SPACER_VH = 300;

export type Step = {
  n: string;
  title: string;
  desc: string;
  icon: "search" | "pen" | "rocket" | "activity";
};

/** As quatro etapas, na ordem. Não inventar etapa nova sem combinar. */
export const STEPS: Step[] = [
  { n: "01", title: "Entender a operação", desc: "Sento com quem faz o trabalho e mapeio onde a rotina trava.", icon: "search" },
  { n: "02", title: "Desenhar o sistema", desc: "Telas e regras no papel primeiro, aprovadas antes de uma linha de código.", icon: "pen" },
  { n: "03", title: "Colocar no ar", desc: "Sistema publicado, equipe treinada e as planilhas antigas aposentadas.", icon: "rocket" },
  { n: "04", title: "Acompanhar e ajustar", desc: "O uso real mostra o que falta; ajusto no plano mensal, sem sumir.", icon: "activity" },
];
