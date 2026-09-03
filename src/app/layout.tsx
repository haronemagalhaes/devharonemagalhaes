import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Grain } from "@/components/motion/grain";
import {
  CITY,
  EMAIL,
  INSTAGRAM_URL,
  SITE_DESCRIPTOR,
  SITE_NAME,
  SITE_URL,
  STATE,
  WHATSAPP_NUMBER,
} from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const TITLE =
  "Harone Magalhães — Sites, Sistemas e Tráfego Pago | Aracaju e todo o Brasil";
const DESCRIPTION =
  "Estúdio de uma pessoa só: site que traz cliente, sistema de gestão sob medida e tráfego pago no Google e no Meta. De Aracaju para o Brasil inteiro. Você fala direto com quem executa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F5F2",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: `${SITE_NAME} — ${SITE_DESCRIPTOR}`,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.png`,
      email: EMAIL,
      telephone: `+${WHATSAPP_NUMBER}`,
      sameAs: [INSTAGRAM_URL],
      founder: { "@type": "Person", name: SITE_NAME },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: SITE_NAME,
      description: DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      email: EMAIL,
      telephone: `+${WHATSAPP_NUMBER}`,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: CITY,
        addressRegion: STATE,
        addressCountry: "BR",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      knowsAbout: [
        "Sites e landing pages",
        "Sistemas e plataformas sob medida",
        "Automação de tarefas",
        "Tráfego pago (Google Ads e Meta Ads)",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <MotionProvider>
          {children}
          <WhatsappFloat />
        </MotionProvider>
        <Grain />
        {/* Vercel Analytics: o script só existe no deploy da Vercel */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
