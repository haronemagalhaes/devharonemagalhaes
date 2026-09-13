import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { AnchorLink } from "@/components/site/anchor-link";
import { Lockup } from "@/components/site/lockup";
import { SocialLinks } from "@/components/site/social-links";
import { ThemeToggle } from "@/components/site/theme-toggle";
import {
  BASE_LINE,
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  SITE_NAME,
  whatsappUrl,
} from "@/lib/site";

/*
 * Navegação do rodapé = só o que o header NÃO tem. O header (fixo, sempre à
 * mão) cobre Capacidades · Trabalho · Planos · Contato; aqui ficam as seções
 * que ele deixa de fora. Repetir o menu por repetir não agrega nada.
 */
const FOOTER_NAV = [
  { label: "Resultados", id: "resultados" },
  { label: "Como trabalho", id: "abordagem" },
  { label: "Depoimentos", id: "depoimentos" },
  { label: "Quem faz", id: "sobre" },
  { label: "Perguntas frequentes", id: "faq" },
];

const TAGLINE =
  "Estúdio de tecnologia e presença digital — sites, sistemas, automação e tráfego pago.";

const WHATSAPP_LABEL = "+55 79 98116-4388";

const link = "link-line text-ink-soft transition-colors duration-300 hover:text-ink";

/** Rótulo de coluna no eyebrow do site — diz o que cada bloco é. */
function ColHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="eyebrow mb-5">{children}</h2>;
}

/** Linha ícone + conteúdo; o ícone é decoração, o texto é o que se lê. */
function Row({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <li className="flex min-w-0 items-start gap-2.5">
      <Icon aria-hidden className="mt-[3px] h-4 w-4 shrink-0 text-ink-soft" />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/**
 * Rodapé-colofão em quatro colunas: marca (lockup + descrição + redes) e três
 * blocos rotulados. Fecha com © à esquerda e o Instagram à direita.
 *
 * O modelo de referência traz `rounded-t-xl` + `mt-16` no <footer>: fora. Isso
 * transforma o rodapé num cartão flutuante, e o sistema daqui é papel contínuo
 * costurado por fios de 1px — a borda superior basta.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const [emailUser, emailDomain] = EMAIL.split("@");

  return (
    <footer className="border-t border-line" aria-label="Rodapé">
      <div className="container-studio py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
            <Lockup compact />
            <p className="max-w-[38ch] text-[15px] leading-relaxed text-ink-soft">
              {TAGLINE}
            </p>
            <SocialLinks className="mt-1" />
          </div>

          <nav aria-label="Outras seções da página" className="lg:col-span-2">
            <ColHeading>Nesta página</ColHeading>
            <ul className="flex flex-col gap-2.5 text-[15px]">
              {FOOTER_NAV.map((l) => (
                <li key={l.id}>
                  <AnchorLink href={`#${l.id}`} className={link}>
                    {l.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <ColHeading>Contato</ColHeading>
            <ul className="flex flex-col gap-2.5 text-[15px]">
              <Row icon={Mail}>
                {/* quebra só depois do "@" (wbr) — nunca no meio de "gmail" */}
                <a
                  href={`mailto:${EMAIL}`}
                  className={`${link} inline-block max-w-full [overflow-wrap:anywhere]`}
                >
                  {emailUser}@<wbr />
                  {emailDomain}
                </a>
              </Row>
              <Row icon={MessageCircle}>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${WHATSAPP_LABEL}`}
                  className={link}
                >
                  {WHATSAPP_LABEL}
                </a>
              </Row>
              <Row icon={Instagram}>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
                  className={link}
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </Row>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <ColHeading>O estúdio</ColHeading>
            <ul className="flex flex-col gap-2.5 text-[15px] text-ink-soft">
              <Row icon={MapPin}>{BASE_LINE}</Row>
            </ul>
          </div>
        </div>

        {/* Fecho: © à esquerda; à direita o Instagram e o interruptor de tema.
            O alternador mora aqui, e não no header — é preferência de leitura,
            não navegação, e o header já carrega marca + menu + CTA.

            `flex-wrap` no grupo da direita: quando a barra empilha (< 640px)
            os três itens — @haronedev_, "Tema" e o interruptor — dividem uma
            linha só. Cabem em 320px (≈ 200px de conteúdo), mas com fonte
            aumentada o rótulo passa pra linha de baixo em vez de espremer o
            interruptor. `gap-y-3` é o respiro dessa quebra. */}
        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-8 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:mt-14">
          <p className="text-ink-soft">
            © {year} {SITE_NAME}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
              className={link}
            >
              {INSTAGRAM_HANDLE}
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
