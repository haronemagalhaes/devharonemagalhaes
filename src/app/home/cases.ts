/**
 * Resultados — prova social em três tempos: como estava → o que eu fiz →
 * o que mudou. O sub da seção promete "número real, sem arredondar": NENHUMA
 * métrica estimada ou arredondada entra aqui.
 *
 * Como preencher:
 *   - Texto entre "[preencher: …]" é placeholder e NUNCA vai pro ar: na
 *     renderização o trecho é removido do texto. Escreva o placeholder como
 *     frase à parte (no fim do campo) pra sobrar uma frase inteira sem ele.
 *     Se o campo ficar vazio sem o placeholder, o bloco daquele campo some.
 *     Se a MÉTRICA tiver placeholder, o case inteiro some. Métrica de apoio
 *     com placeholder some sozinha.
 *   - `publicado: false` segura o case no arquivo sem renderizar.
 *   - `metrica.valor` aceita número ("75") ou texto curto ("4 → 1"). O
 *     tamanho na tela se ajusta pelo comprimento sem contar espaços.
 *   - Um case com `destaque: true` ocupa o bloco grande. Se nenhum tiver, o
 *     primeiro publicado assume. Com um só case publicado, só o bloco grande
 *     aparece — sem grade vazia. Com dois ou mais: destaque + grade.
 *
 * FacilitGestão não entra como cliente: é o nome antigo do SI-Agenda, meu
 * produto (commit 21887bb, 2026-09-01).
 */
export type Metric = {
  /** o que vai grande: número ou texto curto — exato, sem arredondar */
  valor: string;
  /** rótulo abaixo do valor, em minúsculas: "sistemas em um só" */
  rotulo: string;
};

export type Case = {
  id: string;
  empresa: string;
  /** "Clínica", "Indústria" */
  segmento: string;
  /** frente entregue: "Sistema de gestão sob demanda" */
  servico: string;
  /** "2025", "3 meses" */
  periodo?: string;
  /** 1. Como estava — o que doía */
  comoEstava: string;
  /** 2. O que eu fiz — concreto */
  oQueEuFiz: string;
  /** 3. O que mudou — a transformação em uma frase, segundo maior peso visual */
  oQueMudou: string;
  /** o número em destaque — maior peso visual da seção */
  metrica: Metric;
  /** números secundários: horas devolvidas, assinaturas cortadas */
  apoio?: Metric[];
  destaque?: boolean;
  publicado: boolean;
};

export const PLACEHOLDER_PREFIX = "[preencher:";
const PLACEHOLDER_RE = /\s*\[preencher:[^\]]*\]/g;

export function isPlaceholder(text: string | undefined): boolean {
  return !text || text.includes(PLACEHOLDER_PREFIX);
}

/** Remove os trechos "[preencher: …]" e devolve o que sobra (pode ser ""). */
export function stripPlaceholders(text: string | undefined): string {
  return (text ?? "").replace(PLACEHOLDER_RE, "").replace(/\s{2,}/g, " ").trim();
}

export const CASES: Case[] = [
  {
    /*
     * PENDÊNCIA — o Harone confirma o número exato de sistemas ("uns 4").
     * Ao confirmar, ajustar "quatro" em `comoEstava` e o "4" em `metrica`.
     * Os placeholders no fim de cada campo somem sozinhos na tela.
     */
    id: "vitalle-sistema",
    empresa: "Centro Médico Vitalle",
    segmento: "Clínica",
    servico: "Sistema de gestão sob demanda",
    periodo: "[preencher: ano ou duração]",
    comoEstava:
      "A clínica rodava a operação em quatro sistemas separados, um pra cada coisa. Nada conversava entre si, a mesma coisa era digitada mais de uma vez e qualquer visão do todo só saía juntando informação na mão. [preencher: confirmar número exato de sistemas] [preencher: quais eram]",
    oQueEuFiz:
      "Desenvolvi um sistema único que absorveu as funções de todas elas, no mesmo lugar, com um painel só. A clínica parou de usar as ferramentas antigas. [preencher: módulos que ficaram no mesmo lugar]",
    oQueMudou:
      "[preencher: o ganho concreto, número exato, sem arredondar — horas por semana, custo de assinaturas cortado, tempo de uma rotina antes x depois]",
    metrica: { valor: "4 → 1", rotulo: "sistemas em um só" },
    apoio: [
      { valor: "[preencher: número exato, sem arredondar — R$ x/mês]", rotulo: "economizados em assinaturas" },
      { valor: "[preencher: número exato, sem arredondar — x h/semana]", rotulo: "devolvidas à equipe" },
    ],
    destaque: true,
    publicado: true,
  },
  {
    id: "avaliacao-pre-anestesica",
    empresa: "Avaliação Pré-Anestésica",
    segmento: "Saúde",
    servico: "[preencher: frente entregue — site, sistema, tráfego, automação]",
    periodo: "[preencher: ano ou duração]",
    comoEstava: "[preencher: como estava, o que doía]",
    oQueEuFiz: "[preencher: o que eu fiz, concreto]",
    oQueMudou: "[preencher: o que mudou, em uma frase, com número exato, sem arredondar]",
    metrica: {
      valor: "[preencher: número exato, sem arredondar]",
      rotulo: "[preencher: rótulo da métrica]",
    },
    apoio: [],
    publicado: false,
  },
  {
    id: "psi-naiade",
    empresa: "Naiade Santana",
    segmento: "Psicologia",
    servico: "Site com foco em agendamento",
    periodo: "2026",
    comoEstava: "[preencher: como os pacientes chegavam e agendavam antes do site]",
    oQueEuFiz: "[preencher: o que o site resolveu — agendamento, locais de atendimento, apresentação do trabalho]",
    oQueMudou: "[preencher: o que mudou, em uma frase, com número exato, sem arredondar]",
    metrica: {
      valor: "[preencher: número exato, sem arredondar — ex.: agendamentos por mês]",
      rotulo: "[preencher: rótulo da métrica]",
    },
    apoio: [],
    publicado: false,
  },
];

/** Só o que pode ir pro ar: publicado e com métrica real. */
export function publishedCases(): Case[] {
  return CASES.filter(
    (c) => c.publicado && !isPlaceholder(c.metrica.valor) && !isPlaceholder(c.metrica.rotulo),
  );
}
