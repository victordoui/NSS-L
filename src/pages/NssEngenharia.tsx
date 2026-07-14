import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PartnersSection from "@/components/PartnersSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import heroBackgroundImage from "@/assets/fg-laport-hero-background.png";

const NssEngenharia = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section 
          className="min-h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
          style={{ 
            backgroundImage: `url(${heroBackgroundImage})`,
          }}
        >
          {/* Overlay escuro para melhor legibilidade do texto */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container relative z-10">
            <h1 
              className="font-heading text-white leading-[1em]"
              style={{ 
                fontSize: '57px',
                fontWeight: 'normal',
                letterSpacing: '0.05em'
              }}
            >
              NSS ENGENHARIA
            </h1>
          </div>
        </section>

        {/* Fundadora Section */}
        <section className="py-20 bg-white">
          <div className="container max-w-6xl">
            <h2 
              className="font-heading text-black text-center mb-16"
              style={{ 
                fontSize: '43px',
                lineHeight: '0.9em',
                letterSpacing: '0.05em'
              }}
            >
              FUNDADORA
            </h2>
            
            {/* Perfil da Nathalia */}
            <div className="max-w-4xl mx-auto">
              {/* Avatar e Nome */}
              <div className="flex flex-col items-center mb-12">
                <Avatar className="w-40 h-40 lg:w-48 lg:h-48 ring-4 ring-secondary mb-6">
                  <AvatarFallback className="bg-stone-200 text-stone-600 text-4xl font-heading">N</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-heading text-black text-2xl font-medium mb-2" style={{ letterSpacing: '0.05em' }}>
                    NATHALIA
                  </h3>
                  <p className="font-body text-stone-600 text-base">
                    Fundadora da NSS Engenharia
                  </p>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="space-y-10">
                {/* Introdução */}
                <div className="space-y-4">
                  <p className="font-body text-black text-base leading-relaxed text-justify">
                    Fundadora da NSS Engenharia, Nathalia atua há mais de dez anos na área de Engenharia Civil. Sua trajetória começou com o curso Técnico em Edificações, seguida pela graduação em Engenharia Civil e especializações em patologia das construções, inspeções, perícias, avaliações imobiliárias e projetos.
                  </p>
                  <p className="font-body text-black text-base leading-relaxed text-justify">
                    Ao longo de sua experiência, desenvolveu uma visão completa dos processos construtivos, unindo conhecimento técnico, análise precisa e foco em soluções eficientes.
                  </p>
                </div>

                {/* Especialidades Técnicas */}
                <div className="space-y-4">
                  <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                    ESPECIALIDADES TÉCNICAS
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                    {[
                      "Patologia das Construções",
                      "Inspeção Predial e Vistorias Técnicas",
                      "Laudos, Perícias e Pareceres",
                      "Avaliação Imobiliária",
                      "Regularização e Habite-se",
                      "Projetos de arquitetura e complementares",
                      "Acompanhamento e gestão de obras",
                      "Cálculo estrutural"
                    ].map((specialty, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                        <span className="font-body text-black text-sm">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compromisso */}
                <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-secondary">
                  <p className="font-body text-black text-base leading-relaxed italic">
                    Seu compromisso é oferecer diagnósticos claros, embasamento técnico e soluções seguras para cada necessidade.
                  </p>
                </div>

                {/* Direção da NSS Engenharia */}
                <div className="space-y-4">
                  <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                    DIREÇÃO DA NSS ENGENHARIA
                  </h4>
                  <p className="font-body text-black text-base leading-relaxed text-justify">
                    À frente da NSS Engenharia, Nathalia lidera projetos com foco em diagnósticos assertivos, qualidade técnica, transparência e segurança das edificações, atendendo proprietários, condomínios, construtoras, escritórios de advocacia e empresas do setor privado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <PartnersSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default NssEngenharia;