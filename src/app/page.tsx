import Header from "./home/header";
import { HeroSection } from "./home/hero-section";
import { ProofStrip } from "./home/proof-strip";
import { CapabilitiesSection } from "./home/capabilities-section";
import { CasesSection } from "./home/cases-section";
import { ApproachSection } from "./home/approach-section";
import { PlansSection } from "./home/plans-section";
import { WorksSection } from "./home/works-section";
import { ProductSection } from "./home/product-section";
import { TestimonialsSection } from "./home/testimonials-section";
import { AboutSection } from "./home/about-section";
import { FaqSection } from "./home/faq-section";
import { FinalCtaSection } from "./home/final-cta-section";
/* O formulário (react-hook-form + zod) entra sob demanda — ver contact-form-loader.tsx */
import { ContactSection } from "./home/contact-section";
import Footer from "./home/footer";

/* Ordem: promessa (hero) → números → o que eu faço → prova (Resultados) →
   como trabalho → planos → trabalho → produto → depoimentos → quem faz →
   FAQ → CTA → contato. Os índices dos eyebrows seguem essa ordem (01–10). */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProofStrip />
        <CapabilitiesSection />
        <CasesSection />
        <ApproachSection />
        <PlansSection />
        <WorksSection />
        <ProductSection />
        <TestimonialsSection />
        <AboutSection />
        <FaqSection />
        <FinalCtaSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
