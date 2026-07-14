import { useParams, Navigate } from "react-router-dom";
import { useServices } from "@/hooks/useServices";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: services, isLoading, error } = useServices();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (error || !services) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-heading mb-4">Serviço não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O serviço que você está procurando não existe ou foi removido.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              Voltar
            </button>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  const service = services.find(s => s.slug === slug);

  if (!service) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section with Service Image */}
        <section className="relative h-96 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${service.image_url || '/api/placeholder/1200/400'})`,
              backgroundPosition: service.image_position || 'center center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-heading font-normal mb-4" style={{letterSpacing: '0.05em'}}>
                {service.title}
              </h1>
              {service.short_description && (
                <p className="text-lg opacity-90 max-w-2xl" style={{letterSpacing: '0.05em'}}>
                  {service.short_description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-foreground leading-relaxed whitespace-pre-wrap"
                  style={{letterSpacing: '0.025em'}}
                >
                  {service.description}
                </div>
              </div>

              {/* Contact CTA - Enhanced */}
              <div className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-1">
                <div className="bg-background rounded-xl p-8 lg:p-12 text-center relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 animate-pulse">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-heading font-normal mb-4 text-foreground" style={{letterSpacing: '0.05em'}}>
                      Interessado neste serviço?
                    </h3>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" style={{letterSpacing: '0.025em'}}>
                      Nossa equipe de especialistas está pronta para ajudar com soluções personalizadas para seu projeto. 
                      Entre em contato para um orçamento detalhado.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button 
                        onClick={() => window.location.href = '/contato'}
                        className="group relative bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                      >
                        SOLICITAR ORÇAMENTO
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                      
                      <a 
                        href="/contato"
                        className="group flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 font-medium text-lg"
                      >
                        <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Falar com a equipe
                      </a>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Resposta em 24h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Orçamento gratuito</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Consultoria especializada</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ServiceDetail;
