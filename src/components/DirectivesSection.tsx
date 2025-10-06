const DirectivesSection = () => {
  const directives = [
    {
      number: "01",
      title: "COMPROMISSO COM PRAZOS",
      description: "Cumprimento rigoroso de cronogramas com antecipação sempre que possível, garantindo a confiabilidade em todos os projetos."
    },
    {
      number: "02",
      title: "EFICIÊNCIA COM CUSTO INTELIGENTE",
      description: "Otimização de recursos e processos para entregar o melhor valor com investimento responsável e retorno garantido."
    },
    {
      number: "03",
      title: "QUALIDADE EM CADA ETAPA",
      description: "Excelência técnica em todos os processos, desde o planejamento até a entrega final, sem exceções."
    },
    {
      number: "04",
      title: "SUSTENTABILIDADE COM RESPONSABILIDADE",
      description: "Desenvolvimento de soluções ambientalmente responsáveis e socialmente conscientes para o futuro."
    },
    {
      number: "05",
      title: "ESTRUTURA E CAPACIDADE TÉCNICA",
      description: "Equipe especializada, frota moderna e infraestrutura robusta para enfrentar qualquer desafio."
    },
    {
      number: "06",
      title: "RELACIONAMENTO E TRANSPARÊNCIA",
      description: "Comunicação clara, transparente e relacionamento de confiança com clientes e parceiros."
    }
  ];

  return (
    <section id="diretrizes" className="py-24 section-dark">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title mb-6 text-white font-heading font-normal" style={{letterSpacing: '0.05em'}}>DIRETRIZES</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-heading font-normal" style={{letterSpacing: '0.05em'}}>
            Parâmetros que garantem clareza, técnica e desempenho em todas as frentes.
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