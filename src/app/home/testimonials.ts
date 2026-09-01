/**
 * Depoimentos reais (recebidos em 2026-09-01). Para acrescentar, é só
 * adicionar um item — a seção some sozinha se o array ficar vazio.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string; // papel + segmento, ex: "Dona de clínica odontológica"
  avatar?: string; // caminho do logo/foto, opcional (sem ele: iniciais)
  /** logo que não lê em P&B (ex.: dourado sobre azul) fica sempre colorido */
  keepColor?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Serviço muito bom, do site ao sistema interno da clínica. Trabalha com a gente até hoje.",
    name: "Centro Médico Vitalle",
    role: "Clínica médica",
    avatar: "/vitalle-logo.png",
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
    avatar: "/mendonca-logo.png",
    keepColor: true,
  },
  {
    quote: "Ficou impecável. Adoramos o resultado.",
    name: "Armarinho Unicortte",
    role: "Comércio",
    avatar: "/unicortte-logo.png",
  },
];
