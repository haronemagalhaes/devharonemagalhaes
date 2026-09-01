import Header from "./home/header";
import { HeroSection } from "./home/hero-section";
import { ProofStrip } from "./home/proof-strip";
import { CapabilitiesSection } from "./home/capabilities-section";
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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProofStrip />
        <CapabilitiesSection />
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
