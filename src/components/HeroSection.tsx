import { Button } from "./ui/button";
import gabionWallHero from "@/assets/gabion-wall-hero-final.png";

const HeroSection = () => {
  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${gabionWallHero})`,
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Content */}
      <div className="relative z-10 container max-w-7xl">
        <div className="max-w-5xl">
          <h1 
            className="font-heading text-black leading-[1.3em] mb-4"
            style={{ 
              fontSize: '57px',
              fontWeight: 'normal',
              letterSpacing: '0.05em'
            }}
          >
            EXCELÊNCIA EM ENGENHARIA<br />
            GEOTÉCNICA E CIVIL
          </h1>
          
          <p 
            className="font-heading text-black leading-[1.3em] mb-8"
            style={{ 
              fontSize: '27px',
              fontWeight: 'normal',
              letterSpacing: '0.05em'
            }}
          >
            PROJETOS COM SEGURANÇA, PRECISÃO E SOLUÇÕES SUSTENTÁVEIS PARA CADA DESAFIO.
          </p>
          
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