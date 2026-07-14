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
                Com mais de dois anos de experiência, a NSS Engenharia é referência em Patologia das Construções, oferecendo diagnóstico técnico e soluções completas para problemas que comprometem a segurança e o desempenho das edificações.
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
                Atuamos com inspeções, laudos, perícias, identificação de causas, avaliação de riscos e propostas de intervenção, sempre com base em métodos confiáveis e atualizados.
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
                Nossa equipe é formada por profissionais especializados e contamos com equipamentos modernos para realizar medições e ensaios com precisão. Isso nos permite entender exatamente o que está acontecendo na estrutura e indicar a melhor solução para cada caso.
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
                Nosso diferencial está na clareza dos diagnósticos, na agilidade dos atendimentos e na qualidade das recomendações técnicas, garantindo segurança, economia e tranquilidade para nossos clientes.
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
                Também possuímos gestão financeira sólida, o que assegura estabilidade e confiança em contratos de pequeno, médio e grande porte.
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
                A NSS Engenharia é construída com experiência, responsabilidade e dedicação. Estamos prontos para ajudar você a preservar e recuperar a sua edificação com eficiência e segurança.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;