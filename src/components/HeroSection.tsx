import { Button } from "./ui/button";
import crackWallHero from "@/assets/crack-wall-hero.jpg";

const HeroSection = () => {
  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${crackWallHero})`,
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Content */}
      <div className="relative z-10 container max-w-7xl">
        <div className="max-w-5xl">
          <h1 
            className="font-heading text-black leading-[1.3em] mb-8"
            style={{ 
              fontSize: '57px',
              fontWeight: 'normal',
              letterSpacing: '0.05em'
            }}
          >
            ENGENHARIA DIAGNÓSTICA E<br />
            PATOLOGIA DAS CONSTRUÇÕES
          </h1>
          
          <Button 
            className="bg-black text-white hover:bg-black/90 px-8 py-4 text-base font-heading font-normal rounded-none h-auto"
            onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
            style={{letterSpacing: '0.05em'}}
          >
            FALE CONOSCO
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;