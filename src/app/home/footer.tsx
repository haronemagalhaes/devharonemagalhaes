import { AnchorLink } from "@/components/site/anchor-link";
import { Lockup } from "@/components/site/lockup";
import {
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  NAV_LINKS,
  RESPONSE_TIME,
  SITE_NAME,
} from "@/lib/site";

/** Rodapé-colofão: seco, tipográfico, em colunas. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line" aria-label="Rodapé">
      <div className="container-studio grid grid-cols-12 gap-x-6 gap-y-10 py-14 md:py-16">
        <div className="col-span-12 flex flex-col gap-4 md:col-span-5">
          <Lockup compact />
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-ink-soft">
            Estúdio de tecnologia e presença digital. Sites, sistemas,
            automação e tráfego pago.
          </p>
        </div>

        <nav className="col-span-6 md:col-span-3" aria-label="Rodapé">
          <ul className="flex flex-col gap-2 text-[15px]">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <AnchorLink href={`#${l.id}`} className="link-line text-ink">
                  {l.label}
                </AnchorLink>
              </li>
            ))}
            <li>
              <AnchorLink href="#sobre" className="link-line text-ink">
                Sobre
              </AnchorLink>
            </li>
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-4">
          <ul className="flex flex-col gap-2 text-[15px]">
            <li className="text-ink-soft">Aracaju, Brasil — atendo todo o Brasil</li>
            <li>
              <a href={`mailto:${EMAIL}`} className="link-line break-all text-ink">
                {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line text-ink"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li className="text-ink-soft">{RESPONSE_TIME}</li>
          </ul>
        </div>

        <div className="col-span-12 flex flex-col gap-2 border-t border-line pt-6 text-[13px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
