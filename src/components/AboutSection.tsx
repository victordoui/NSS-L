import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section id="nss-engenharia" className="py-24 bg-background">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Title, Subtitle and Button */}
            <div className="space-y-8">
              <div>
                <h3 
                  className="font-heading font-normal text-foreground mb-6"
                  style={{ 
                    fontSize: '43px', 
                    lineHeight: '1.5em',
                    letterSpacing: '0.05em'
                  }}
                >
                  NSS ENGENHARIA
                </h3>
                <p 
                  className="font-heading font-normal text-foreground mb-8"
                  style={{ 
                    fontSize: '21px', 
                    lineHeight: '1.5em',
                    letterSpacing: '0.05em'
                  }}
                >
                  Toda obra que entregamos é uma história de sucesso.
                </p>
              </div>
              
              <Link to="/nss-engenharia">
                <Button 
                  className="bg-foreground text-background hover:bg-foreground/90 px-6 py-3 font-heading font-normal rounded-none h-auto"
                  style={{letterSpacing: '0.05em'}}
                >
                  CONHEÇA A NSS ENGENHARIA
                </Button>
              </Link>
            </div>
            
            {/* Right Column - Text Content */}
            <div className="space-y-4">
              <p 
                className="font-heading font-normal text-foreground"
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.5em',
                  textAlign: 'justify',
                  letterSpacing: '0.05em'
                }}
              >
                Com mais de uma década de atuação, a NSS ENGENHARIA consolida-se como referência em soluções de engenharia. Nossa trajetória é marcada por entregas que aliam precisão técnica, cumprimento rigoroso de prazos e compromisso com a excelência.
              </p>
              
              <p 
                className="font-heading font-normal text-foreground"
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.5em',
                  textAlign: 'justify',
                  letterSpacing: '0.05em'
                }}
              >
                Contamos com equipe própria altamente qualificada, parque de máquinas moderno e gestão financeira estruturada, o que nos permite executar projetos complexos com autonomia e eficiência.
              </p>
              
              <p 
                className="font-heading font-normal text-foreground"
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.5em',
                  textAlign: 'justify',
                  letterSpacing: '0.05em'
                }}
              >
                Nosso diferencial está na capacidade de antecipar prazos, superando expectativas e garantindo resultados que se destacam pela qualidade e confiabilidade.
              </p>
              
              <p 
                className="font-heading font-normal text-foreground"
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.5em',
                  textAlign: 'justify',
                  letterSpacing: '0.05em'
                }}
              >
                Mantemos índices de liquidez consistentes, assegurando estabilidade para contratos de grande porte e segurança para nossos clientes.
              </p>
              
              <p 
                className="font-heading font-normal text-foreground"
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.5em',
                  textAlign: 'justify',
                  letterSpacing: '0.05em'
                }}
              >
                O que realizamos até aqui demonstra nossa competência. O que vem a seguir, vamos construir juntos, com ainda mais solidez e inovação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;