/**
 * Depoimentos reais (recebidos em 2026-09-01). Para acrescentar, é só
 * adicionar um item — a seção some sozinha se o array ficar vazio, e com
 * menos de 3 as abas perdem graça (avisar antes de cortar).
 *
 * `marca` = quem falou, no círculo à direita:
 *   - tipo "logo": PNG com fundo transparente → object-contain com respiro
 *   - tipo "tile": logo quadrada com fundo opaco próprio → preenche o
 *     círculo (os cantos cortados são só o fundo da própria arte)
 *   - tipo "tile" com `fundo`: pra arte que encosta nas bordas do quadrado
 *     (o cover cortaria o símbolo) — o círculo pinta essa cor e a logo
 *     entra inteira, em contain com 8% de respiro. `fundo` tem que ser a
 *     cor exata do fundo do PNG, senão aparece a emenda
 *   - tipo "foto": retrato → object-cover
 *   Sem `marca`, o círculo mostra as iniciais do cliente em Geist.
 * Logos ficam na cor natural de cada cliente; a interface em volta é
 * monocromática. Nada foi recortado de print nem baixado.
 */
export type Marca =
  | { src: string; tipo: "logo" | "foto"; alt?: string }
  | { src: string; tipo: "tile"; alt?: string; fundo?: string };

export type Testimonial = {
  id: string;
  /** quem falou: pessoa ou empresa */
  cliente: string;
  /** papel ou segmento, ex.: "Clínica médica" */
  empresa: string;
  citacao: string;
  /** avaliação em estrelas (1–5) */
  estrelas: 1 | 2 | 3 | 4 | 5;
  marca?: Marca;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "vitalle",
    cliente: "Centro Médico Vitalle",
    empresa: "Clínica médica",
    citacao:
      "Serviço muito bom, do site ao sistema interno da clínica. Trabalha com a gente até hoje.",
    estrelas: 5,
    marca: { src: "/vitalle-logo.png", tipo: "logo", alt: "Logomarca do Centro Médico Vitalle" },
  },
  {
    // TODO: logo da Naiade Santana — hoje o círculo usa a foto dela (public/naiade-foto.png),
    // a mesma do carrossel antigo. Se houver logomarca, trocar por { tipo: "logo" }.
    id: "naiade",
    cliente: "Naiade Santana",
    empresa: "Psicóloga",
    citacao: "Amei o resultado. O site ficou lindo e representa bem o meu trabalho.",
    estrelas: 5,
    marca: { src: "/naiade-foto.png", tipo: "foto", alt: "Foto de Naiade Santana" },
  },
  {
    id: "mendonca",
    cliente: "Mendonça Advocacia",
    empresa: "Escritório de advocacia",
    citacao: "Superou a expectativa. Gostamos do estilo do trabalho e do resultado.",
    estrelas: 5,
    // arte nova (2026-09-13): a balança já vem com margem — o ponto mais
    // longe do centro fica a 0,70 do raio —, então preenche o círculo sem
    // cortar e dispensa `fundo` (o azul dela nem é chapado, tem textura)
    marca: { src: "/mendonca-logo.png", tipo: "tile", alt: "Logomarca da Mendonça Advocacia" },
  },
  {
    id: "unicortte",
    cliente: "Armarinho Unicortte",
    empresa: "Comércio",
    citacao: "Ficou impecável. Adoramos o resultado.",
    estrelas: 5,
    marca: { src: "/unicortte-logo.png", tipo: "logo", alt: "Logomarca do Armarinho Unicortte" },
  },
];

/** Iniciais pro círculo sem marca: "Centro Médico Vitalle" → "CV". */
export function iniciais(nome: string): string {
  const p = nome.split(/\s+/).filter((w) => w.length > 2 || /^[A-Z]/.test(w));
  return ((p[0]?.[0] ?? "") + (p[p.length - 1]?.[0] ?? "")).toUpperCase();
}
