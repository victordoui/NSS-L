import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DirectivesSection from "@/components/DirectivesSection";
import ServicesSection from "@/components/ServicesSection";
import InformativeSection from "@/components/InformativeSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <DirectivesSection />
        <ServicesSection />
        <InformativeSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
