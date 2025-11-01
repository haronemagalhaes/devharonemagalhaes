import Image from "next/image";
import Header from "./home/header";
import { HeroSection } from "@/app/home/hero-section";
import { ServicesSection } from "@/app/home/services-section";
import { WorksSection } from "@/app/home/works-section";
import Footer from "@/app/home/footer";
import Logo from "@/assets/Logomarca.png";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f] text-white font-sans">
      <Header />


      <main className="flex flex-col">
        <HeroSection />
        <ServicesSection />
        <WorksSection />
      </main>


      <Footer />


      <div className="w-full border-t border-white/5 bg-[#0a0a0f] py-6 text-center">
        <p className="text-white/60 text-sm mb-2">Desenvolvido por</p>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={Logo}
            alt="Logo Harone Magalhães"
            width={26}
            height={26}
            className="rounded-full object-contain shadow-md shadow-cyan-500/10"
          />
          <span className="font-semibold text-white hover:text-cyan-400 transition-colors duration-200">
            haronedev.com.br
          </span>
        </div>
      </div>
    </div>
  );
}
