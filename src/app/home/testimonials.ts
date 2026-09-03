/**
 * Depoimentos reais (recebidos em 2026-09-01). Para acrescentar, é só
 * adicionar um item — a seção some sozinha se o array ficar vazio, e com
 * menos de 3 as abas perdem graça (avisar antes de cortar).
 *
 * `imagem` = print do projeto entregue pra aquele cliente, o mesmo do
 * índice de trabalho em /public. Nada de stock; sem print, deixe "" e o
 * painel mostra um fundo neutro da paleta.
 */
export type Testimonial = {
  id: string;
  /** quem falou: pessoa ou empresa */
  cliente: string;
  /** papel ou segmento, ex.: "Clínica médica" */
  empresa: string;
  citacao: string;
  /** caminho em /public; "" = fundo neutro */
  imagem: string;
  alt?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "vitalle",
    cliente: "Centro Médico Vitalle",
    empresa: "Clínica médica",
    citacao:
      "Serviço muito bom, do site ao sistema interno da clínica. Trabalha com a gente até hoje.",
    imagem: "/Vitalle.png",
    alt: "Página de presença digital do Centro Médico Vitalle",
  },
  {
    id: "naiade",
    cliente: "Naiade Santana",
    empresa: "Psicóloga",
    citacao: "Amei o resultado. O site ficou lindo e representa bem o meu trabalho.",
    imagem: "/psinaiade.png",
    alt: "Site da psicóloga Naiade Santana",
  },
  {
    id: "mendonca",
    cliente: "Mendonça Advocacia",
    empresa: "Escritório de advocacia",
    citacao: "Superou a expectativa. Gostamos do estilo do trabalho e do resultado.",
    imagem: "/mendonca.png",
    alt: "Site do escritório Mendonça Advocacia",
  },
  {
    id: "unicortte",
    cliente: "Armarinho Unicortte",
    empresa: "Comércio",
    citacao: "Ficou impecável. Adoramos o resultado.",
    imagem: "/unicortte.jpeg",
    alt: "Site do Armarinho Unicortte",
  },
];
