/**
 * Formas de pagamento — texto + logos das bandeiras.
 * Os ícones são SVGs locais em public/payment/ (placeholders coloridos).
 * Substitua os arquivos pelos logos oficiais quando quiser, mantendo os nomes.
 * Cada logo fica num "chip" branco arredondado para garantir legibilidade no tema dark.
 */

const METHODS: { src: string; label: string }[] = [
  { src: "/payment/pix.svg", label: "Pix" },
  { src: "/payment/visa.svg", label: "Visa" },
  { src: "/payment/master.svg", label: "Mastercard" },
  { src: "/payment/elo.svg", label: "Elo" },
  { src: "/payment/boleto.svg", label: "Boleto" },
];

export function PaymentMethods({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "flex flex-col items-center gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center",
        className,
      ].join(" ")}
    >
      <span className="text-center text-xs leading-relaxed text-white/55">
        Aceitamos cartão, Pix, boleto e as principais bandeiras.
      </span>

      <ul
        className="flex flex-wrap items-center justify-center gap-2"
        aria-label="Formas de pagamento aceitas"
      >
        {METHODS.map((m) => (
          <li
            key={m.label}
            className="flex h-6 items-center justify-center rounded-md bg-white px-1.5 shadow-sm ring-1 ring-black/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.src} alt={m.label} className="h-4 w-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
}
