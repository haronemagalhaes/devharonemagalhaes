import { AnchorLink } from "@/components/site/anchor-link";
import { Lockup } from "@/components/site/lockup";
import {
  BASE_LINE,
  CONTACT_ID,
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  NAV_LINKS,
  RESPONSE_TIME,
  SITE_NAME,
} from "@/lib/site";

/** Capacidades · Trabalho · Planos · Sobre · Contato (Contato por último) */
const FOOTER_NAV = [
  ...NAV_LINKS.filter((l) => l.id !== CONTACT_ID),
  { label: "Sobre", id: "sobre" },
  { label: "Contato", id: CONTACT_ID },
];

const TAGLINE =
  "Estúdio de tecnologia e presença digital — sites, sistemas, automação e tráfego pago.";

const link =
  "link-line text-ink-soft transition-colors duration-300 hover:text-ink";

/**
 * Rodapé-colofão. Mobile: uma coluna (lockup → tagline → nav → contato →
 * fio → copyright). ≥ 640px: linha de cima full-width e duas colunas
 * (navegação | contato) alinhadas pelo topo.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const [emailUser, emailDomain] = EMAIL.split("@");

  return (
    <footer className="border-t border-line" aria-label="Rodapé">
      <div className="container-studio py-14 md:py-16">
        <div className="flex flex-col gap-4">
          <Lockup compact />
          <p className="text-[15px] leading-relaxed text-ink-soft">{TAGLINE}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-6">
          <nav aria-label="Rodapé">
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

          <ul className="flex flex-col gap-2.5 text-[15px] text-ink-soft" aria-label="Contato">
            <li>{BASE_LINE}</li>
            <li>
              {/* quebra só depois do "@" (wbr) — nunca no meio de "gmail" */}
              <a
                href={`mailto:${EMAIL}`}
                className={`${link} inline-block max-w-full text-[0.85rem] [overflow-wrap:anywhere] sm:text-[15px]`}
              >
                {emailUser}@<wbr />
                {emailDomain}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
                className={link}
              >
                {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>{RESPONSE_TIME}</li>
          </ul>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-[13px] text-ink-soft sm:mt-12 sm:pt-8">
          <p>
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
