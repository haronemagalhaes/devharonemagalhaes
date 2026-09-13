import "./hero-aurora.css";
import type { CSSProperties } from "react";
import Image from "next/image";
import Monograma from "@/assets/monograma-Photoroom.png";
import { StartProjectCta } from "@/components/site/start-project-cta";
import { StudioButton } from "@/components/site/studio-button";
import { SITE_DESCRIPTOR } from "@/lib/site";

/*
 * Hero empilhado (branch hero-aurora). Alterna com o hero atual em page.tsx
 * (const HERO).
 *
 * Duas capas, CSS puro (sem gsap/ScrollTrigger/framer-motion):
 *   capa 1 — a pergunta: `sticky top-0` em TODOS os tamanhos, mín. 100svh.
 *            Papel, grid + aurora + textura e o leque (Hero10) abaixo do
 *            CTA. Pra grudar direito a capa tem que caber na viewport, e o
 *            leque é o primeiro a ceder: 16svh ≥ md; abaixo de md sobra um
 *            cartão só, e em tela de menos de 701px de altura ele nem
 *            entra — as regras moram todas em `.hero-fan`, no CSS.
 *            Diagnóstico de 2026-09-03: overflow-x do body e Lenis NÃO
 *            afetam o sticky (testado com clip e com o Lenis destruído);
 *            o que quebrava era a capa em `relative` abaixo de md,
 *            decisão anterior desfeita aqui.
 *
 *            Medido no build de produção (Chromium 149) — a capa 1 cabe em
 *            100svh e o documento não passa da largura da tela em
 *            320×568, 360×740, 375×667, 390×844, 430×932, 768×1024,
 *            1024×768, 1280×900 e 1440×900. Antes desta revisão ela
 *            estourava em 375×667 (728px) e em 320×568 (593px).
 *
 *            Ritmo do mobile: padding do container a 0/8px (era 32/24, e
 *            depois 8/16) e margens 16/16/24/20 no lugar de 24/24/32/24.
 *            A rodada de 2026-09-04 apertou de novo — 36px no total — pra
 *            comprar a altura do leque de três cartões, e essa é a ORDEM
 *            que vale: espaçamento cede antes do leque, o CTA não sai da
 *            dobra e o H1 não diminui.
 *            Como a capa é `items-center`, esse padding só entra em jogo
 *            quando o conteúdo é MAIOR que a viewport — cortar dele não
 *            tira respiro de tela nenhuma e é o que comprou a altura do
 *            cartão. O piso do H1 caiu de 2.25rem pra 2rem, que é o que
 *            faz 320px caber.
 *   capa 2 — a resposta: `relative z-10`, fundo de tinta 100% opaco. Sobe
 *            por cima da capa 1 conforme o usuário rola. Limpa: sem grid,
 *            sem aurora — é a diferenciação entre as duas. Headline grande
 *            de sistemas (h2) + apoio; "Construo o caminho até você." (h3)
 *            pequeno, junto do CTA.
 *   O wrapper `relative` limita o sticky: quando ele termina, a capa 1 sai
 *   de cena junto (sticky não escapa do pai), então nada fica preso.
 *
 * Altura da capa 2: pelo conteúdo (mín. 72svh no desktop) em vez de 100svh
 * — o terço inferior ficava vazio. O empilhamento continua funcionando com
 * a capa 2 mais baixa: a capa 1 vai sendo coberta de baixo pra cima e some
 * quando o wrapper acaba.
 *
 * Headings: um único <h1> (capa 1). A capa 2 usa <h2> (sistemas) e <h3>.
 *
 * Textura (capa 1) — revisão de 2026-09-03. O fundo estava com cinco
 * camadas todas quase invisíveis: cada uma tinha sido abaixada pra
 * proteger o AA (grid a 2,5%), e o somatório dava um hero com cara de
 * template. A correção não foi somar uma sexta camada tímida, foi refazer
 * as três que importam:
 *   - grid de PONTOS (26px, 9%) no lugar do grid de linhas a 3,5%. Ponto
 *     lê como estúdio técnico; linha lê como dashboard.
 *   - aurora com deriva lenta de 16s (32s ida e volta). A 9s dava pra
 *     perceber o movimento, e fundo que se percebe mexendo lê como banner.
 *   - grão no mesmo nível das artes do Instagram (.45/.6, baseFrequency
 *     .8, tile 240px, soft-light), pra site e social terem a mesma
 *     matéria.
 *
 * REGRA que substitui "abaixar tudo": contraste se resolve com MÁSCARA,
 * não com opacidade global. O grid de pontos usa duas máscaras com
 * `intersect` — uma radial que abre um vazio no miolo (onde moram eyebrow,
 * H1, sub e CTA) e uma linear que apaga topo e base. Só sobra ponto no
 * perímetro, que é onde ele pode ser forte. Foi assim que a camada subiu
 * de 3,5% pra 9% sem mexer em um único valor de AA. Antes de enfraquecer
 * qualquer camada por causa de contraste, tentar máscara primeiro.
 *
 * A animação de entrada é a CSS do site (.hero-fade, escalonada por --d;
 * some com prefers-reduced-motion) — não precisou de framer-motion.
 *
 * Contraste — capa 1: a aurora fica centrada no H1 e some antes do sub; o
 * grid tem um vazio atrás do bloco de texto. O sub NÃO usa --ink-soft: o
 * cinza médio sobre o papel mede 4,63:1 nominal e, com o grain do site,
 * o pior pixel fica em 4,46–4,59 — no limite do AA. Aqui o sub é tinta a
 * 75% (≈ 7:1). A 2ª linha do H1 é tinta CHEIA (16,9:1 no claro, 16,0:1 no
 * escuro) — antes o gradiente deixava a base dos glifos em 72% de tinta,
 * ≈ 10:1, que passava mas com menos folga. Capa 2: papel sobre
 * tinta (16:1); eyebrow e numerais a 70% de papel (≈ 8:1 no claro, ≈ 6:1
 * no escuro — a 60% o escuro dava 4,49).
 *
 * H1 — line-height 1.15 (era 1.08): a 1.08 as três linhas do mobile
 * colidiam em 91 colunas (folga 0 entre o "q" de "que" e a linha
 * seguinte); no desktop, com duas linhas, havia 24px e não aparecia.
 *
 * H1 — DOIS TONS (2026-09-04). A 2ª linha usava `.hero-text-glow`
 * (gradiente de --foreground até 72% de tinta): somado ao cinza da 1ª
 * linha dava TRÊS tonalidades na mesma headline. A classe saiu e a linha
 * virou tinta chapada. Regra que fica valendo no site: headline com no
 * máximo dois tons, a ênfase vem de contraste chapado ENTRE linhas e
 * nunca de gradiente dentro de uma; e nada de `background-clip: text` em
 * texto com descendente. A classe não é usada em mais lugar nenhum e foi
 * apagada do hero-aurora.css.
 *
 * H1 — medido no Chrome (Geist 600, -0.025em): mobile 3 linhas,
 * (100vw − 48px) / 11 teto 46px → 30px a 375px; desktop 2 linhas,
 * min(64px, (100vw − 80px) / 14.8).
 */
const SUB =
  "Construo a estrutura digital que faz o cliente achar, confiar e comprar: sistemas sob medida para sua empresa, automação de tarefas, sites e tráfego pago. Quem fecha o escopo com você é quem executa.";

/*
 * SUB CURTO PRO MOBILE (2026-09-04).
 *
 * O sub completo cai em CINCO linhas a 390px de largura e come sozinho ~120
 * dos ~770px úteis da dobra. Era ele, e não o leque, que estava apertando a
 * capa: o leque só era o que aparecia espremido no fim da conta.
 *
 * O texto longo diz três coisas — o que eu construo, a lista de serviços e
 * quem executa. Numa tela de telefone cabe UMA ideia por vez, e as duas que
 * sobrevivem são a lista (diz o que é) e a última frase (diz por que comigo).
 * O "achar, confiar e comprar" é o que sai: é a parte que o H1 logo acima já
 * encena em forma de pergunta.
 *
 * Os dois textos ficam em <span> irmãos com `display` responsivo, nunca os
 * dois ao mesmo tempo: `display: none` também tira do leitor de tela, então
 * cada viewport expõe exatamente uma versão — nada de conteúdo duplicado.
 */
const SUB_MOBILE =
  "Sites, sistemas, automação e tráfego pago. Quem fecha o escopo com você é quem executa.";

/*
 * Capa 2 — hierarquia invertida (2026-09-03): a chamada de sistemas e
 * automação é o elemento GRANDE (h2, largura toda); "Construo o caminho
 * até você." virou apoio (h3 pequeno, ao lado do CTA). Sistemas é a
 * prioridade nº 1 de serviço e a capa 1 fala só da frente.
 *
 * Headline (2026-09-03) — trocada de "O que sua equipe faz em 3 horas, o
 * sistema faz sozinho." para o par problema → solução abaixo. Motivo: o
 * "3 horas" não tinha contexto DENTRO da headline (o exemplo só aparece no
 * apoio), então o número, que devia dar peso, ficava solto. A nova nomeia
 * o problema ("tarefas repetitivas") e fecha em primeira pessoa, que é a
 * voz da marca. Descartadas: "Tem alguém na sua empresa fazendo na mão o
 * que um sistema faz sozinho." (mais longa, mesma ideia), "Três horas por
 * dia numa tarefa que ninguém questiona." (mantém o número mas não fecha
 * com a solução) e "Sua equipe não devia estar fazendo isso na mão."
 * ("isso" depende do apoio pra fazer sentido).
 *
 * Duas cores por linha, NÃO por gradiente: a linha do problema em papel a
 * 60% e a da solução em papel cheio, cada uma no seu <span>. Encena o
 * antes/depois — problema apagado, solução firme — e é o mesmo recurso do
 * H1 da capa 1. Gradiente com background-clip:text está proibido aqui: a
 * caixa do gradiente é calculada pela line-height e comeria o descendente
 * do "q" de "equipe" e do "p" de "perde"/"repetitivas". A 60% de papel
 * sobre tinta dá ≈ 4,5:1 — passa AA de texto grande (mín. 3:1) com folga.
 *
 * line-height 1.15: medido em pixel na headline anterior, com 1.05 os
 * descendentes ficavam a 12px da linha de baixo e no pior caso (gqpjy
 * sobre ÁÉÍbdfhkl) colidiam em 45 colunas; 1.10 ainda colidia em 49. 1.15
 * é o primeiro sem colisão. Regra da marca: Geist 600–700, tracking entre
 * 0 e -0.03em, line-height ≥ 1.05 e nunca abaixo de 1.15 quando há duas
 * linhas com descendente.
 *
 * TODO — RE-MEDIR O CORPO. Os divisores abaixo (10.7 e 15.9) e os tetos
 * (48px / 68px) foram calculados para a headline ANTIGA, cujas linhas
 * mediam 15.62em e 10.51em. A nova é bem mais longa na L1 e bem mais
 * curta na L2, por isso ela quebra em 3 linhas no desktop em vez de 2.
 * Medir no Chrome, em Geist 600 / -0.025em:
 *   1. largura em em de "Sua equipe perde horas em tarefas repetitivas."
 *      e de "Eu resolvo isso."
 *   2. decidir se o alvo no desktop é 2 ou 3 linhas — 3 linhas está
 *      legível e equilibrado, então é uma escolha, não um defeito
 *   3. recalcular divisor pelo bloco que manda (a L1) e o teto
 *   4. reconferir em 320/360/375/390/430 e no desktop, e confirmar que
 *      nenhuma palavra quebra no meio
 */
const SYSTEMS = {
  eyebrow: "Sistemas sob medida e automação de tarefas",
  line1: "Sua equipe perde horas em tarefas repetitivas.",
  line2: "Eu resolvo isso.",
  // três casos reais, sem contar a história; ordem: licitação → financeiro → relatório
  // TODO: confirmar o que foi entregue no caso do financeiro — "vive num painel" é provisório
  apoio:
    "Buscar licitação em 75 sites, todo dia. Controlar o financeiro na planilha. Montar relatório fotográfico no Word. Três tarefas que eu tirei da mão de alguém: a lista chega pronta, o financeiro vive num painel e o relatório sai do sistema.",
};

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HeroAurora() {
  return (
    <div className="relative">
      {/* ---------- capa 1 — a pergunta ---------- */}
      <section
        id="top"
        /* `items-stretch` (o padrão) e não `items-center`: quem centraliza
           é o container, por dentro — ver a nota de equilíbrio vertical
           logo abaixo. */
        className="hero-paper sticky top-0 z-0 flex min-h-[100svh] overflow-hidden pt-[var(--header-h)]"
        aria-labelledby="hero-title"
      >
        {/* O fundo da capa 1 tem CINCO camadas e nenhuma a mais — as duas
            primeiras (cor chapada e gradiente linear) e a última (o fio de
            base) moram na própria <section>, via `.hero-paper`. Aqui ficam
            só as duas do meio, nesta ordem: monograma → grão. Nenhuma
            radial em lugar nenhum; ver a nota no topo do hero-aurora.css. */}
        {/*
          MONOGRAMA HM — marca d'água, como no primeiro hero do rebrand.

          Só o símbolo: o nome já está no header, repetir seria eco. Sangra
          pela borda direita e fica ANCORADO NA FAIXA DE BAIXO da capa, na
          altura do sub e do CTA, não na do H1 — abaixo da headline o
          conteúdo é bem mais estreito (sub em 40rem, CTA em ~250px), e é
          essa diferença que abre a lateral onde ele cabe sem encostar em
          nada. Na altura do H1 não caberia: a headline chega perto da
          largura do container.

          `hero-wm-hide` some abaixo de 900px — mesma régua do hero
          original. No telefone o texto ocupa a largura toda e não existe
          lateral; enfiar o monograma ali devolveria a variação de tom que
          a limpeza deste fundo veio tirar.
        */}
        <div aria-hidden className="hero-wm pointer-events-none absolute select-none">
          <Image
            src={Monograma}
            alt=""
            width={340}
            height={220}
            sizes="(min-width: 900px) 34vw, 0px"
            className="h-auto w-full opacity-[0.055] dark:opacity-[0.07] dark:invert"
          />
        </div>

        <div aria-hidden className="hero-grain pointer-events-none absolute inset-0" />

        {/* `hero-recede`: o conteúdo da capa 1 encolhe e desbota conforme a
            capa 2 sobe — ver a nota "PROFUNDIDADE" no CSS. O papel e a
            textura NÃO recuam: quem fica pra trás é o conteúdo, o chão é
            chão. */}
        {/*
          EQUILÍBRIO VERTICAL. O bloco é centrado pelo container, não pela
          seção — mas a seção tem `pt-[var(--header-h)]` e não tem o
          equivalente embaixo, então "centro do container" fica 38px ABAIXO
          do centro da tela (medido: bloco em y 281–696 numa viewport de
          900, centro em 488 contra 450). Com o leque fora, essa diferença
          deixou de ser disfarçada por peso na base e o conteúdo passou a
          ler como se estivesse afundado.

          `pb-[8svh]` compensa. A conta é direta: padding embaixo sobe o
          bloco pela METADE do que se acrescenta, então pra anular os 76px
          do header são precisos ~76px de assimetria — 8svh dá 72px em 900
          e leva o centro do bloco de 488 pra 452, contra os 450 da tela.
          Proporcional e não fixo em 76px de propósito: em tela curta um
          padding fixo empurraria a capa pra fora dos 100svh, enquanto 8svh
          encolhe junto (45px em 568).

          O `max-h` saiu junto com o leque: ele existia só pra forçar a
          janela dos cartões a entrar em `flex-shrink`. Sem nada que encolha,
          ele viraria uma tesoura em cima do texto em tela curta.
        */}
        <div className="hero-recede container-studio relative z-10 flex w-full flex-col items-center justify-center pb-[8svh] pt-0 text-center md:pb-[calc(2.5rem+8svh)] md:pt-10">
          <p
            className="hero-fade eyebrow max-w-full !text-[11px] !tracking-[0.12em] leading-relaxed md:!text-[12px] md:!tracking-[0.14em]"
            style={delay(0.05)}
          >
            {/* só a prateleira: o alcance ("Atendo todo o Brasil") fica na faixa de prova, logo abaixo */}
            {SITE_DESCRIPTOR}
          </p>

          <h1
            id="hero-title"
            className="hero-fade mt-6 max-w-full font-display text-[length:clamp(2rem,calc((100vw-48px)/8.5),3.5rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:mt-8 lg:text-[length:min(64px,calc((100vw-80px)/14.8))]"
            style={delay(0.2)}
          >
            {/* DOIS TONS, nunca três: cinza na pergunta de cima, tinta CHEIA e
                chapada na de baixo. A 2ª linha tinha `.hero-text-glow`, um
                gradiente de tinta cheia até 72% de tinta — uma cor virava
                duas e a headline ficava com três tonalidades. A ênfase da
                virada vem do contraste entre as linhas, não de gradiente
                dentro de uma delas. Some junto o `background-clip: text`, que
                era o que comia descendente sempre que o texto mudasse. */}
            <span className="block text-balance text-ink-soft">Você tem o que vender.</span>
            <span className="block text-balance">Seu cliente sabe te encontrar?</span>
          </h1>

          <p
            className="hero-sub hero-fade mt-6 max-w-[34rem] text-[16px] leading-[1.5] text-ink/75 [text-wrap:pretty] md:mt-8 md:max-w-[40rem] md:text-[19px] md:leading-[1.55]"
            style={delay(0.45)}
          >
            <span className="md:hidden">{SUB_MOBILE}</span>
            <span className="hidden md:inline">{SUB}</span>
          </p>

          {/* CTA sólido: é a ação mais importante da página e precisa ganhar do
              fundo — o vidro sumia no papel. Abre o WhatsApp (link externo),
              não rola mais pro formulário; ver start-project-cta.tsx. */}
          <div className="hero-cta hero-fade mt-8 md:mt-10 [perspective:600px]" style={delay(0.6)}>
            <StartProjectCta />
          </div>

        </div>
      </section>

      {/* ---------- capa 2 — a resposta ---------- */}
      <section
        id="resposta"
        className="hero-capa2 relative z-10 flex items-center bg-ink text-bg md:min-h-[72svh]"
        aria-labelledby="resposta-title"
      >
        {/* pt maior no mobile: o header fixo (60px rolado) cobriria o eyebrow quando a capa 2 chega ao topo */}
        <div className="container-studio w-full pb-16 pt-24 md:py-24">
          <p className="eyebrow !text-bg/70">{SYSTEMS.eyebrow}</p>

          <h2
            id="resposta-title"
            className="mt-5 max-w-full font-display text-[length:clamp(1.5rem,calc((100vw-48px)/10.7),3rem)] font-semibold leading-[1.15] tracking-[-0.025em] md:mt-7 lg:text-[length:min(68px,calc((100vw-80px)/15.9))]"
          >
            {/* duas cores por <span>, nunca por gradiente: background-clip:text comeria
                o descendente do "q" de "equipe" e do "p" de "perde"/"repetitivas" */}
            <span className="block text-balance text-bg/60">{SYSTEMS.line1}</span>
            <span className="block">{SYSTEMS.line2}</span>
          </h2>

          <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-10 md:mt-12">
            <p className="capa2-apoio col-span-12 max-w-[40rem] text-[17px] leading-relaxed text-bg/75 [text-wrap:pretty] lg:col-span-7 md:text-[19px]">
              {SYSTEMS.apoio}
            </p>

            {/* apoio: a resposta à pergunta da capa 1, agora pequena, junto do CTA */}
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-bg/15 lg:pl-8">
              <p className="eyebrow !text-bg/70">O que eu faço</p>
              <h3 className="font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.015em] md:text-[26px]">
                Construo o caminho até você.
              </h3>
              {/* < 640px sai: header e capa 1 já têm CTA */}
              <div className="mt-1 hidden sm:block">
                <StudioButton
                  href="#abordagem"
                  variant="secondary"
                  className="!border-bg !text-bg hover:!bg-bg hover:!text-ink"
                  arrow
                >
                  Ver como eu trabalho
                </StudioButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}