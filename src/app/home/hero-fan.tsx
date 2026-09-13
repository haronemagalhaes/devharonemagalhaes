import Image from "next/image";
import Print2 from "@/assets/IMG_7352.jpeg";

/*
 * Leque de cartões abaixo do CTA da capa 1 — formato do Hero10 (21st.dev),
 * sem as dependências dele.
 *
 *   1 (esquerda, −6°)  print do sistema de gestão da clínica (desktop)
 *   2 (centro, 0°)     print do sistema de licitações (telefone) — é o caso
 *                      que a capa 2 cita ("Buscar licitação em 75 sites")
 *   3 (direita, +6°)   print do sistema de passeios (telefone)
 *
 * SEM framer-motion (2026-09-03). A entrada virou keyframe CSS
 * (`fan-in`, escalonada por --d) pelo mesmo motivo do resto do hero, e por
 * um motivo novo: a passagem pra capa 2 é uma animação guiada por scroll
 * que precisa mandar em `transform`. Se o framer também escrevesse
 * transform inline, uma das duas perderia. Camadas separadas:
 *   .fan-card      → entrada (opacity + translate + rotate)
 *   .fan-card-box  → passagem (scale + fade), guiada pelo scroll
 * Uma animação por elemento, nenhuma briga por propriedade.
 *
 * MOBILE (2026-09-04) — os TRÊS cartões, grandes, sangrando pelas bordas.
 * Duas tentativas anteriores erraram em direções opostas: três cartões
 * encolhidos pra caber lado a lado (93px de cartão = texto de interface a
 * ~3,6px, ilegível) e depois um cartão só, legível mas sem leque — e é o
 * leque que diz "são vários sistemas, não um".
 *
 * A saída foi tirar da largura da tela o poder de decidir o tamanho do
 * cartão: abaixo de `md` o leque é uma janela de 100vw com overflow
 * escondido, e o trio mede ~135vw dentro dela, então as pontas são cortadas
 * pela borda da TELA. A altura que entra na conta dos 100svh é a da janela,
 * não a do cartão. Toda a regra mora em `.hero-fan` no CSS.
 *
 * Recorte: os cartões são retrato (4:5). O print de gestão é paisagem
 * larga (1,96) e usa `object-position: left top` pra mostrar menu lateral e
 * cabeçalho; os dois prints de telefone são retrato (0,49) e o `cover` já
 * entrega a largura inteira, cortando só o rodapé.
 *
 * Identidade: raio 8px como os outros cards, contorno em --line, sombra
 * derivada de --ink. Os prints ficam em cor — é trabalho real, a cor é
 * parte da prova. Decorativo: aria-hidden.
 */
/*
 * Rotação, deslocamento e atraso de entrada NÃO vêm mais daqui por `style`.
 * Estilo inline ganha de folha de estilo, então o `--rot: -6deg` inline
 * anulava silenciosamente qualquer `--rot` que uma media query tentasse
 * aplicar — era por isso que a variante de mobile "com rotação maior" nunca
 * girou de verdade. Agora as três variáveis moram no CSS, keyed por
 * `data-card`, e o mobile pode sobrescrevê-las.
 */
type Kind = "gestao" | "licitacoes" | "passeios";

const CARDS: Kind[] = ["gestao", "licitacoes", "passeios"];

/* no mobile o cartão vai a min(58vw, 260px) — o navegador precisa pedir a
   largura de verdade, senão baixa um arquivo pequeno pra um cartão grande */
const SIZES = "(min-width: 1024px) 196px, (min-width: 768px) 140px, min(58vw, 260px)";

function CardContent({ kind }: { kind: Kind }) {
  if (kind === "licitacoes") {
    return (
      <Image src={Print2} alt="" fill placeholder="blur" sizes={SIZES} className="fan-img object-cover object-top" />
    );
  }
  if (kind === "gestao") {
    return (
      <Image src="/sistema-gestao.png" alt="" fill sizes={SIZES} className="fan-img object-cover object-left-top" />
    );
  }
  return <Image src="/IMG_7349.jpeg" alt="" fill sizes={SIZES} className="fan-img object-cover object-top" />;
}

/*
 * O interruptor `data-fan` (variantes a/b/c) saiu junto: existia pra
 * comparar "um cartão", "três cortados" e "sem leque" em screenshot, e a
 * decisão está tomada. Variante que não vai voltar é CSS morto — o
 * histórico do porquê fica no comentário do topo e no git.
 */
export function HeroFan({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`hero-fan ${className ?? ""}`}>
      {CARDS.map((kind) => (
        <div key={kind} className="fan-card" data-card={kind}>
          <div className="fan-card-box">
            <CardContent kind={kind} />
          </div>
        </div>
      ))}
    </div>
  );
}
