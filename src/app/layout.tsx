import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HaroneMagalhães.Dev",
  description: "Portfólio e projetos de Harone Magalhães",
  themeColor: "#0b0d10", // evita barra branca no mobile
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          // fundo global + dark + correções mobile
          "min-h-dvh bg-[#0b0d10] text-neutral-100 antialiased overflow-x-hidden",
          "[color-scheme:dark]",
          "flex flex-col",
        ].join(" ")}
      >
        <main className="flex-1">{children}</main>
        {/* se tiver <Footer/>, garanta bg no próprio Footer também */}
      </body>
    </html>
  );
}
