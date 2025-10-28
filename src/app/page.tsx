import { Header } from "@/app/home/header";
import { HeroSection } from "@/app/home/hero-section";
import { ServicesSection } from "@/app/home/services-section";
import { WorksSection } from "@/app/home/works-section";
import Footer from "@/app/home/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f] text-white font-sans">
      {/* Header fixo com blur e animação */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex flex-col">
        <HeroSection />
        <ServicesSection />
        <WorksSection />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
