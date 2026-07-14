import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import servicesHeroPipes from "@/assets/services-hero-pipes.jpg";
import { useServices } from "@/hooks/useServices";
import ServiceCard from "@/components/ServiceCard";

const Servicos = () => {
  const { data: services, isLoading, error } = useServices();

  const scrollToContact = () => {
    window.location.href = '/contato';
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={servicesHeroPipes} 
              alt="Tubos para canteiro de obras" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 container">
            <h1 
              className="font-heading text-[clamp(2.25rem,11vw,3.5625rem)] text-white leading-[1em]"
              style={{ 
                fontWeight: 'normal',
                letterSpacing: '0.05em'
              }}
            >
              SERVIÇOS
            </h1>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-7xl">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : error || !services ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Erro ao carregar serviços. Tente novamente mais tarde.</p>
              </div>
            ) : (
              <>
                {/* Services Grid - All Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {services.map((service, index) => (
                    <ServiceCard 
                      key={service.id}
                      service={service}
                      index={index}
                      className="h-[400px]"
                    />
                  ))}
                </div>
              </>
            )}

            {/* Contact Button */}
            <div className="text-center">
              <Button 
                className="bg-primary text-white hover:bg-primary/90 px-8 py-4 text-base font-medium h-auto"
                onClick={scrollToContact}
              >
                ENTRE EM CONTATO
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Servicos;
