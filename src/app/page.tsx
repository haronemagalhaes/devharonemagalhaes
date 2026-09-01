import Header from "./home/header";
import { HeroSection } from "./home/hero-section";
import { ProofStrip } from "./home/proof-strip";
import { CapabilitiesSection } from "./home/capabilities-section";
import { ApproachSection } from "./home/approach-section";
import { PlansSection } from "./home/plans-section";
import { WorksSection } from "./home/works-section";
import { FacilitSection } from "./home/facilit-section";
import { TestimonialsSection } from "./home/testimonials-section";
import { AboutSection } from "./home/about-section";
import { FaqSection } from "./home/faq-section";
import { FinalCtaSection } from "./home/final-cta-section";
import dynamic from "next/dynamic";

/* Formulário (react-hook-form + zod) fica fora do bundle inicial — está abaixo da dobra. */
const ContactSection = dynamic(() =>
  import("./home/contact-section").then((mod) => mod.ContactSection),
);
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
        <FacilitSection />
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
