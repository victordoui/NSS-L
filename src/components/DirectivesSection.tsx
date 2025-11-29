const DirectivesSection = () => {
  const directives = [
    {
      number: "01",
      title: "RIGOR NO DIAGNÓSTICO",
      description: "Análises técnicas detalhadas e fundamentadas, garantindo identificação precisa das causas das patologias e orientações confiáveis para cada caso."
    },
    {
      number: "02",
      title: "SOLUÇÕES TÉCNICAS COM VIABILIDADE",
      description: "Propostas de intervenção que unem eficiência, economia e segurança, sempre buscando a melhor relação entre custo, desempenho e durabilidade."
    },
    {
      number: "03",
      title: "QUALIDADE EM TODO O PROCESSO",
      description: "Excelência na execução de inspeções, ensaios, laudos e perícias, mantendo padrão elevado desde a primeira avaliação até a entrega final."
    },
    {
      number: "04",
      title: "SEGURANÇA E RESPONSABILIDADE",
      description: "Atuação comprometida com a integridade das edificações, com recomendações baseadas em normas, boas práticas e responsabilidade profissional."
    },
    {
      number: "05",
      title: "EQUIPE ESPECIALIZADA E EQUIPAMENTOS MODERNOS",
      description: "Profissionais qualificados e tecnologia atualizada para avaliações precisas, incluindo ensaios não destrutivos, medições e levantamentos completos."
    },
    {
      number: "06",
      title: "TRANSPARÊNCIA E RELACIONAMENTO",
      description: "Comunicação clara, documentação completa e relacionamento baseado em confiança, garantindo que o cliente entenda cada etapa do diagnóstico e da solução."
    }
  ];

  return (
    <section id="diretrizes" className="py-24 section-dark">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title mb-6 text-white font-heading font-normal" style={{letterSpacing: '0.05em'}}>DIRETRIZES</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-heading font-normal" style={{letterSpacing: '0.05em'}}>
            Parâmetros que garantem clareza, precisão técnica e segurança em cada diagnóstico e solução.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {directives.map((directive, index) => (
            <div 
              key={directive.number}
              className="relative p-8 directive-card group"
            >
              {/* Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-secondary text-black flex items-center justify-center font-heading font-normal text-xl" style={{letterSpacing: '0.05em'}}>
                {directive.number}
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <h3 className="text-2xl font-heading font-normal text-white mb-4 group-hover:text-secondary transition-colors" style={{letterSpacing: '0.05em'}}>
                  {directive.title}
                </h3>
                <p className="text-lg leading-relaxed text-white/90 font-heading font-normal" style={{letterSpacing: '0.05em'}}>
                  {directive.description}
                </p>
              </div>
              
              {/* Decorative line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DirectivesSection;