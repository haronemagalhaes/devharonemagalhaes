import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { WhatsappFloat } from "@/components/whatsapp-float";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harone Magalhães — Em atualização",
  description: "Site em atualização. Fale comigo pelo WhatsApp ou Instagram.",
  robots: { index: false, follow: false },
  themeColor: "#0b0d10",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "min-h-dvh bg-[#0b0d10] text-neutral-100 antialiased overflow-x-hidden",
          "[color-scheme:dark]",
          "flex flex-col",
        ].join(" ")}
      >
        <main className="flex-1">{children}</main>
        <WhatsappFloat />
        <Analytics />
      </body>
    </html>
  );
}