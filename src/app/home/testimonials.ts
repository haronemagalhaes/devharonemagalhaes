/**
 * Depoimentos reais (recebidos em 2026-09-01). Para acrescentar, é só
 * adicionar um item — a seção some sozinha se o array ficar vazio.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string; // papel + segmento, ex: "Dona de clínica odontológica"
  /** foto do cliente → círculo 40px, object-cover, cor natural */
  avatar?: string;
  /** logo do cliente, cor natural: "inline" (sem moldura, 24px de altura,
   *  PNG recortado ao bbox) ou "tile" (fundo opaco → quadrado 32px, radius 8) */
  logo?: { src: string; style: "inline" | "tile" };
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Serviço muito bom, do site ao sistema interno da clínica. Trabalha com a gente até hoje.",
    name: "Centro Médico Vitalle",
    role: "Clínica médica",
    logo: { src: "/vitalle-logo.png", style: "inline" },
  },
  {
    quote: "Amei o resultado. O site ficou lindo e representa bem o meu trabalho.",
    name: "Naiade Santana",
    role: "Psicóloga",
    avatar: "/naiade-foto.png",
  },
  {
    quote: "Superou a expectativa. Gostamos do estilo do trabalho e do resultado.",
    name: "Mendonça Advocacia",
    role: "Escritório de advocacia",
    logo: { src: "/mendonca-logo.png", style: "tile" },
  },
  {
    quote: "Ficou impecável. Adoramos o resultado.",
    name: "Armarinho Unicortte",
    role: "Comércio",
    logo: { src: "/unicortte-logo.png", style: "inline" },
  },
];
