export type Project = {
  id: string;
  title: string;
  sector: string;
  work: string;
  year: string;
  image: string;
  description: string;
  technologies: string[];
  link?: string;
  /** alt da captura no modal; sem ele cai em "Captura do projeto {title}" */
  alt?: string;
};

/**
 * Índice de trabalho selecionado. Ano estimado pelo histórico do repositório —
 * PENDÊNCIA: Harone confirma.
 */
export const PROJECTS: Project[] = [
  {
    id: "vitalle",
    title: "Centro Médico Vitalle",
    sector: "Saúde",
    work: "Link na bio e presença digital",
    year: "2025",
    image: "/Vitalle.png",
    description:
      "Página de presença digital do centro médico: especialidades, serviços e canais de contato a um toque, em qualquer dispositivo.",
    technologies: [],
    link: "https://link-bio.centromedicovitalle.com.br/",
  },
  {
    id: "albuquerque-va",
    title: "Albuquerque V.A",
    sector: "Moda",
    work: "Site institucional",
    year: "2025",
    image: "/loja.png",
    description:
      "Site da loja de moda feminina, ligando a vitrine aos canais de atendimento e redes sociais com identidade própria.",
    technologies: [],
    link: "https://abmoda.com.br",
  },
  {
    id: "angelica-cruz",
    title: "Angelica Cruz",
    sector: "Saúde",
    work: "Link na bio com foco em agendamento",
    year: "2025",
    image: "/angelicacruz.jpeg",
    description:
      "Microsite da nutricionista com links rápidos e caminho direto pro agendamento.",
    technologies: [],
    link: "https://www.angelicacruznutricionista.com.br",
  },
  {
    id: "unicortte",
    title: "Armarinho Unicortte",
    sector: "Comércio",
    work: "Site institucional e cursos",
    year: "2025",
    image: "/unicortte.jpeg",
    description:
      "Site institucional do armarinho com apresentação da loja, cursos e presença digital alinhada à marca.",
    technologies: [],
    link: "https://armarinhounicortte.vercel.app/",
  },
  {
    id: "mendonca",
    title: "Mendonça Advocacia",
    sector: "Jurídico",
    work: "Site institucional",
    year: "2026",
    image: "/mendonca.png",
    description:
      "Site do escritório focado em autoridade e credibilidade, com navegação clara e caminho de contato direto.",
    technologies: [],
    link: "https://www.mendonca-advocaciaa.com.br/",
  },
  {
    id: "tathi-rocha",
    title: "Tathi Rocha",
    sector: "Serviços",
    work: "Link na bio",
    year: "2026",
    image: "/tathi.png",
    description:
      "Página link-in-bio que centraliza redes, serviços e contato, otimizada pra celular.",
    technologies: [],
    link: "https://tathi-rocha-website.vercel.app/",
  },
  {
    id: "unicortte-penedo",
    title: "Armarinho Unicortte — Penedo",
    sector: "Comércio",
    work: "Site da unidade",
    year: "2026",
    image: "/unicortte2.png",
    description:
      "Site da unidade de Penedo: produtos, cursos e presença digital, simples e feito pra converter.",
    technologies: [],
    link: "https://armarinhounicortte-penedo.vercel.app/",
  },
  {
    id: "via-reta-engenharia",
    title: "Via Reta Engenharia",
    sector: "Engenharia",
    work: "Site institucional",
    year: "2026",
    image: "/ViaReta.png",
    description:
      "Site institucional da empresa de iluminação pública e sistemas elétricos: SPDA, subestações, compliance e projetos pro setor público.",
    technologies: [],
    link: "https://www.viaretaluz.com.br/",
  },
  {
    id: "yangled-luminarias",
    title: "YangLed Luminárias",
    sector: "Indústria",
    work: "Site institucional",
    year: "2026",
    image: "/YangLed.png",
    description:
      "Site da fabricante de luminárias públicas LED, com especificações técnicas em destaque pra prefeituras, concessionárias e integradores.",
    technologies: [],
    link: "https://www.yangledbr.com.br/",
  },
  {
    id: "marina-pier-mosqueiro",
    title: "Marina Pier Mosqueiro",
    sector: "Lazer",
    work: "Site institucional",
    year: "2026",
    image: "/Marina.png",
    description:
      "Site da marina de jet skis em Aracaju: vagas secas, segurança 24h e espaço gourmet, com foco em converter visita em contato.",
    technologies: [],
    link: "https://www.marinapiermosqueiro.com.br/",
  },
  {
    id: "psi-naiade",
    title: "Naiade Santana · Psicóloga",
    sector: "Saúde",
    work: "Site institucional com foco em agendamento",
    year: "2026",
    image: "/psinaiade.png",
    alt: "Site da psicóloga Naiade Santana",
    description:
      "Site para a psicóloga Naiade Santana, especialista em ABA. Foco em agendamento, locais de atendimento e apresentação do trabalho — layout leve, acolhedor e responsivo.",
    technologies: [],
    link: "https://psinaiade.vercel.app/",
  },
];
