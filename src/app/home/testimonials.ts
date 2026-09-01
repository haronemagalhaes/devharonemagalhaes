// TODO: trocar as frases pelos depoimentos reais antes do push.
// Os 4 clientes são reais; as citações abaixo são marcadores — nada aqui é
// atribuído a alguém como se tivesse sido dito. Harone manda 3–6 frases
// (citação curta + nome + papel/segmento) e é só preencher.
//
// Se o array ficar vazio, a seção "Depoimentos" some da página.

export type Testimonial = {
  quote: string;
  name: string;
  role: string; // papel + segmento, ex: "Dona de clínica odontológica"
  avatar?: string; // caminho do logo/foto, opcional (sem ele: iniciais)
};

const PLACEHOLDER = "[Depoimento a confirmar — uma frase curta sobre o resultado.]";

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: PLACEHOLDER,
    name: "Naiade Santana",
    role: "Psicóloga",
    avatar: "/naiade-foto.png",
  },
  {
    quote: PLACEHOLDER,
    name: "Centro Médico Vitalle",
    role: "Clínica médica",
    avatar: "/vitalle-logo.png",
  },
  {
    quote: PLACEHOLDER,
    name: "Armarinho Unicortte",
    role: "Comércio / cursos",
    avatar: "/unicortte-logo.png",
  },
  {
    quote: PLACEHOLDER,
    name: "Mendonça Advocacia",
    role: "Escritório de advocacia",
    avatar: "/mendonca-logo.png",
  },
];
