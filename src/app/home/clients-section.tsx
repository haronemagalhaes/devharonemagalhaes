"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

/*
 * Clientes: logo (ou foto) + nome + setor, sem citação. Quando houver
 * depoimento real, o campo `quote` entra e o tile mostra a frase acima do
 * nome (slot comentado em <ClientTile>).
 */
type Client = {
  name: string;
  sector: string;
  image: string;
  width: number;
  height: number;
  /** "photo" = retrato circular em cor natural; "logo" = P&B → cor no hover */
  kind: "logo" | "photo";
  /** logos que não leem em P&B (ex.: dourado sobre azul) ficam coloridos */
  keepColor?: boolean;
  // quote?: string;
};

const CLIENTS: Client[] = [
  {
    name: "Centro Médico Vitalle",
    sector: "Saúde",
    image: "/vitalle-logo.png",
    width: 282,
    height: 262,
    kind: "logo",
  },
  {
    name: "Armarinho Unicortte",
    sector: "Comércio",
    image: "/unicortte-logo.png",
    width: 287,
    height: 165,
    kind: "logo",
  },
  {
    name: "Mendonça Advocacia",
    sector: "Jurídico",
    image: "/mendonca-logo.png",
    width: 1080,
    height: 1080,
    kind: "logo",
    keepColor: true,
  },
  {
    name: "Naiade Santana",
    sector: "Saúde",
    image: "/naiade-foto.png",
    width: 320,
    height: 320,
    kind: "photo",
  },
];

const EASE_OUT = "ease-[cubic-bezier(0.16,1,0.3,1)]";

function ClientTile({ client, index }: { client: Client; index: number }) {
  return (
    <Reveal
      as="li"
      delay={index * 0.06}
      className="group flex flex-col items-center gap-5 rounded-[8px] border border-line bg-surface px-4 py-8 text-center md:px-6 md:py-10"
    >
      {/*
        Depoimento (futuro) — entra acima do nome quando `client.quote` existir:
        <blockquote className="font-display text-[17px] font-bold leading-snug tracking-[-0.01em] text-ink">
          “{client.quote}”
        </blockquote>
      */}
      <div className="flex h-[72px] items-center justify-center">
        {client.kind === "photo" ? (
          <Image
            src={client.image}
            alt={client.name}
            width={client.width}
            height={client.height}
            sizes="72px"
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
        ) : (
          <Image
            src={client.image}
            alt={client.name}
            width={client.width}
            height={client.height}
            sizes="160px"
            className={cn(
              "h-[56px] w-auto max-w-[150px] rounded-[6px] object-contain transition-[filter,opacity] duration-500",
              EASE_OUT,
              !client.keepColor &&
                "opacity-85 grayscale group-hover:opacity-100 group-hover:grayscale-0",
            )}
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[0.95rem] font-medium leading-snug text-ink">{client.name}</p>
        <p className="text-[0.8rem] uppercase tracking-[0.06em] text-ink-soft">{client.sector}</p>
      </div>
    </Reveal>
  );
}

export function ClientsSection() {
  return (
    <section id="clientes" className="section-pad" aria-labelledby="clientes-title">
      <div className="container-studio">
        <SectionHeading
          index="06"
          eyebrow="Clientes"
          title="Quem confia no trabalho"
          id="clientes-title"
        />

        <ul className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4 md:gap-5">
          {CLIENTS.map((client, i) => (
            <ClientTile key={client.name} client={client} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
