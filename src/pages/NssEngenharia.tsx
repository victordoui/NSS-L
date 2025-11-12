import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PartnersSection from "@/components/PartnersSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

        {/* Nossos Fundadores Section */}
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
              FUNDADORES
            </h2>
            
            {/* Layout Vertical: Perfis no topo, conteúdo abaixo */}
            <Tabs defaultValue="fabio" className="w-full">
              {/* Perfis dos Fundadores - Horizontalmente centralizados */}
              <div className="flex justify-center mb-16">
                <TabsList className="flex bg-transparent gap-12 h-auto">
                  <TabsTrigger value="fabio" className="group data-[state=active]:bg-transparent p-0 bg-transparent border-0 shadow-none">
                    <div className="flex flex-col items-center space-y-3 cursor-pointer">
                       <Avatar className="w-32 h-32 lg:w-40 lg:h-40 ring-4 ring-transparent group-data-[state=active]:ring-secondary transition-all duration-500 group-hover:ring-secondary/50 group-hover:scale-105">
                        <AvatarImage src="/assets/images/fabio-laport.png" alt="Fabio Laport" className="object-cover" />
                        <AvatarFallback className="bg-stone-200 text-stone-600 text-2xl font-heading">FL</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="mb-2">
                           <h3 className="font-heading text-black text-lg font-medium transition-colors group-hover:text-secondary group-data-[state=active]:text-secondary" style={{ letterSpacing: '0.05em' }}>
                            FABIO LAPORT
                          </h3>
                        </div>
                        <div>
                          <p className="font-body text-stone-600 text-sm">
                            Fundador & Diretor
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger value="giana" className="group data-[state=active]:bg-transparent p-0 bg-transparent border-0 shadow-none">
                    <div className="flex flex-col items-center space-y-3 cursor-pointer">
                      <Avatar className="w-32 h-32 lg:w-40 lg:h-40 ring-4 ring-transparent group-data-[state=active]:ring-secondary transition-all duration-500 group-hover:ring-secondary/50 group-hover:scale-105">
                        <AvatarImage src="/assets/images/giana-laport.png" alt="Giana Laport" className="object-cover" />
                        <AvatarFallback className="bg-stone-200 text-stone-600 text-2xl font-heading">GL</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="mb-2">
                          <h3 className="font-heading text-black text-lg font-medium transition-colors group-hover:text-secondary group-data-[state=active]:text-secondary" style={{ letterSpacing: '0.05em' }}>
                            GIANA LAPORT
                          </h3>
                        </div>
                        <div>
                          <p className="font-body text-stone-600 text-sm">
                            Consultora
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Conteúdo Detalhado - Centralizado e com largura máxima */}
              <div className="max-w-4xl mx-auto">
                <TabsContent value="fabio" className="mt-0">
                  <div className="space-y-8">
                    <div className="space-y-10 text-left">
                      {/* Formação e Experiência Inicial */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          FORMAÇÃO E EXPERIÊNCIA
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Profissional com formação em <strong>Direito</strong> e <strong>Técnico em Edificações</strong>, possui ampla experiência na área de construção civil e controle de qualidade, consolidada ao longo de mais de uma década de atuação no setor.
                        </p>
                      </div>

                      {/* Experiência Petrobras */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          EXPERIÊNCIA PETROBRAS
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Desenvolveu carreira em projetos de grande porte no sistema Petrobras, atuando por meio de renomadas construtoras:
                        </p>
                        <ul className="font-body text-black text-base leading-relaxed ml-6 space-y-2">
                          <li className="flex items-start">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Consórcio CITI (Andrade Gutierrez, Mendes Júnior, Queiroz Galvão)
                          </li>
                          <li className="flex items-start">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Gutierrez Engenharia
                          </li>
                          <li className="flex items-start">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            MPE e QSE
                          </li>
                        </ul>
                      </div>

                      {/* Especialidades Técnicas */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          ESPECIALIDADES TÉCNICAS
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Destacou-se em obras de alta complexidade, incluindo a <strong>Interligação Termorio/Reduc</strong>, a <strong>Terraplanagem</strong> e a <strong>Estrutura do Novo CENPES</strong>.
                        </p>
                        <p className="font-body text-black text-base leading-relaxed">
                          <strong>Serviços especializados:</strong>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                          <div className="flex items-center space-x-2">
                             <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            <span className="font-body text-black text-sm">Estacamentos</span>
                          </div>
                          <div className="flex items-center space-x-2">
                             <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            <span className="font-body text-black text-sm">Parede diafragma</span>
                          </div>
                          <div className="flex items-center space-x-2">
                             <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            <span className="font-body text-black text-sm">Estaca raiz</span>
                          </div>
                          <div className="flex items-center space-x-2">
                             <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            <span className="font-body text-black text-sm">Hélice contínua</span>
                          </div>
                          <div className="flex items-center space-x-2">
                             <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            <span className="font-body text-black text-sm">Monitoramento PDA</span>
                          </div>
                          <div className="flex items-center space-x-2">
                             <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            <span className="font-body text-black text-sm">Controle de qualidade</span>
                          </div>
                        </div>
                      </div>

                      {/* Função Atual */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          DIREÇÃO DA NSS ENGENHARIA
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Atualmente, exerce a função de <strong>Diretor da NSS Engenharia</strong>, liderando projetos voltados à geotecnia e execução de obras como muros de gabião, cortinas atirantadas e solo grampeado, além de sondagens SPT.
                        </p>
                      </div>

                      {/* Clientes e Projetos */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          CLIENTES E PROJETOS
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Sob sua gestão, a empresa vem se destacando na execução de empreendimentos para importantes clientes institucionais e privados:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
                          {[
                            "Casa Shopping", "Direcional", "New Wave", 
                            "Caneca Fina", "Membeca", "Quinta das Amoras",
                            "Iguá de Nova Friburgo", "Fortaleza de São João (Exército)",
                            "Hospital Federal de Laranjeiras", "Conlurb de Paquetá"
                          ].map((client, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></span>
                              <span className="font-body text-black text-sm">{client}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Conclusão */}
                       <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-secondary">
                        <p className="font-body text-black text-base leading-relaxed italic">
                          "A experiência técnica, aliada à capacidade de compreender e traduzir as demandas dos clientes em soluções eficazes, torna Fábio uma liderança estratégica na condução dos projetos mais desafiadores da NSS Engenharia."
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="giana" className="mt-0">
                  <div className="space-y-8">
                    <div className="space-y-10 text-left">
                      {/* Formação Acadêmica */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          FORMAÇÃO ACADÊMICA
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Engenheira Civil, Mestre em Engenharia Civil pela UERJ, com doutorado em andamento na mesma instituição. Possui sólida experiência em projetos de geotecnia, drenagem e estruturas, com mais de 15 anos de atuação em empresas de grande porte e na coordenação de projetos multidisciplinares de infraestrutura.
                        </p>
                      </div>

                      {/* Fundação da FG Laport */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          FUNDAÇÃO DA NSS ENGENHARIA
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Fundadora da NSS Engenharia, liderou importantes projetos estratégicos da empresa:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Contenção e drenagem da Usina de Três Rios</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Contenções em áreas urbanas (Austin, Gera Energia, Parque Industrial New Wave)</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Sondagens SPT (New Wave, Condomínio Vale das Amoras)</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Projetos estruturais (Hospital de Ipanema, residências unifamiliares, ETA Rio Dourado, projetos da Conlurb em Paquetá)</span>
                          </div>
                        </div>
                      </div>

                      {/* Consultoria Internacional */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          CONSULTORIA INTERNACIONAL
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Consultora na ONU-Habitat em projetos de infraestrutura e geotecnia na comunidade Izidora, em Belo Horizonte, evidenciando experiência em urbanização, habitação e desenvolvimento comunitário.
                        </p>
                      </div>

                      {/* Experiência GeoInfra Engenharia */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          EXPERIÊNCIA GEOINFRA ENGENHARIA
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Na GeoInfra Engenharia e Consultoria, participou de obras estratégicas de alta complexidade:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Fundações Biomanguinhos</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Contenção Chácara do Céu</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Contenção Vila Parque</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Contenção Club Med</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Instrumentação Pontal Oceânico</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Consultoria Petrobras</span>
                          </div>
                        </div>
                      </div>

                      {/* Grandes Projetos Petrobras */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          GRANDES PROJETOS PETROBRAS
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Atuou diretamente em grandes projetos da Petrobras, envolvendo fiscalização e execução de obras de alta complexidade:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Fundações e estruturas mistas</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Aterros em solos moles (COMPERJ)</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Adutoras e linhas de transmissão</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Obras marítimas (piers e pontes de acesso)</span>
                          </div>
                        </div>
                        <p className="font-body text-black text-base leading-relaxed mt-4">
                          Em consórcios como Queiroz Galvão – IESA e Skanska Brasil (REDUC), participou de obras industriais de grande complexidade, como a construção da Unidade de HDS e da rede de combate a incêndio na refinaria.
                        </p>
                      </div>

                      {/* Carreira Acadêmica */}
                      <div className="space-y-4">
                         <h4 className="font-heading text-black text-lg tracking-wide border-l-4 border-secondary pl-4">
                          CARREIRA ACADÊMICA
                        </h4>
                        <p className="font-body text-black text-base leading-relaxed">
                          Desenvolveu sólida trajetória como professora universitária em múltiplas instituições:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-4">
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Unig</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Unigranrio</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Universidade Castelo Branco</span>
                          </div>
                          <div className="flex items-start space-x-2">
                             <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="font-body text-black text-sm">Unicbe</span>
                          </div>
                        </div>
                        <p className="font-body text-black text-base leading-relaxed mt-4">
                          Lecionou disciplinas de Engenharia Civil e Arquitetura, e atuou como engenheira responsável em diferentes campi universitários (Nova Iguaçu, Itaperuna, Centro e Belford Roxo).
                        </p>
                      </div>

                      {/* Conclusão */}
                       <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-secondary">
                        <p className="font-body text-black text-base leading-relaxed italic">
                          "Profissional com perfil multidisciplinar, alia a experiência prática em obras de grande porte ao conhecimento acadêmico, mantendo constante atualização e dedicação à excelência técnica em projetos de engenharia."
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
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