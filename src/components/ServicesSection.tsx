import { useServices } from "@/hooks/useServices";
import ServiceCard from "./ServiceCard";

const ServicesSection = () => {
  const { data: services, isLoading, error } = useServices();

  if (isLoading) {
    return (
      <section id="servicos" className="py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6 text-primary font-heading font-normal" style={{letterSpacing: '0.05em'}}>SERVIÇOS</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-heading font-normal" style={{letterSpacing: '0.05em'}}>
              Carregando serviços...
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[400px] bg-white/10 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !services) {
    return (
      <section id="servicos" className="py-24 bg-gray-50">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title mb-6 text-primary font-heading font-normal" style={{letterSpacing: '0.05em'}}>SERVIÇOS</h2>
            <p className="text-xl text-gray-600">Erro ao carregar serviços. Tente novamente mais tarde.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" className="py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title mb-6 text-primary font-heading font-normal" style={{letterSpacing: '0.05em'}}>SERVIÇOS</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-heading font-normal" style={{letterSpacing: '0.05em'}}>
            Soluções completas em engenharia com foco em qualidade, 
            eficiência e responsabilidade técnica.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id}
              service={service}
              index={index}
              showMoreButton={true}
            />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button 
            className="btn-primary"
            onClick={() => window.location.href = '/servicos'}
          >
            VER TODOS OS SERVIÇOS
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;