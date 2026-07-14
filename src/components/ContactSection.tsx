import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";

const ContactSection = () => {
  const { data: contactInfo, isLoading } = useContactInfo();

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'phone': case 'telefone': return Phone;
      case 'email': case 'e-mail': return Mail;
      case 'address': case 'endereco': case 'endereço': return MapPin;
      case 'schedule': case 'horario': case 'horário': return Clock;
      default: return Mail;
    }
  };
  return (
    <section id="contato" className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title mb-6 text-primary font-heading font-normal" style={{letterSpacing: '0.05em'}}>CONTATO</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-heading font-normal" style={{letterSpacing: '0.05em'}}>
            Entre em contato conosco e descubra como podemos transformar 
            seu projeto em realidade com excelência e responsabilidade.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <h3 className="text-2xl font-heading font-normal text-primary mb-6" style={{letterSpacing: '0.05em'}}>
              FALE CONOSCO
            </h3>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Nome completo" 
                  className="h-12"
                />
                <Input 
                  placeholder="E-mail" 
                  type="email" 
                  className="h-12"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Telefone" 
                  className="h-12"
                />
                <Input 
                  placeholder="Empresa" 
                  className="h-12"
                />
              </div>
              
              <Input 
                placeholder="Assunto" 
                className="h-12"
              />
              
              <Textarea 
                placeholder="Descreva seu projeto ou dúvida"
                className="min-h-32 resize-none"
              />
              
              <Button className="btn-primary w-full h-12">
                ENVIAR MENSAGEM
              </Button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-heading font-normal text-primary mb-6" style={{letterSpacing: '0.05em'}}>
              INFORMAÇÕES
            </h3>
            
            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 animate-pulse flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 animate-pulse mb-2 w-24"></div>
                      <div className="h-3 bg-gray-200 animate-pulse mb-1 w-32"></div>
                      <div className="h-3 bg-gray-200 animate-pulse w-28"></div>
                    </div>
                  </div>
                ))
              ) : contactInfo && contactInfo.length > 0 ? (
                contactInfo.map((item) => {
                  const Icon = getIcon(item.type);
                  return (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={24} className="text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-heading font-normal text-primary mb-1" style={{letterSpacing: '0.05em'}}>
                          {item.label.toUpperCase()}
                        </h4>
                        <p className="text-muted-foreground font-heading font-normal" style={{letterSpacing: '0.05em'}}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Fallback to default contact info
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <MapPin size={24} className="text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-normal text-primary mb-1" style={{letterSpacing: '0.05em'}}>ENDEREÇO</h4>
                      <p className="text-muted-foreground font-heading font-normal" style={{letterSpacing: '0.05em'}}>
                        Rua das Engenharias, 123<br />
                        Bairro Industrial - São Paulo/SP<br />
                        CEP: 01234-567
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Phone size={24} className="text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-normal text-primary mb-1" style={{letterSpacing: '0.05em'}}>TELEFONE</h4>
                      <p className="text-muted-foreground font-heading font-normal" style={{letterSpacing: '0.05em'}}>
                        (11) 9999-9999<br />
                        (11) 8888-8888
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Mail size={24} className="text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-normal text-primary mb-1" style={{letterSpacing: '0.05em'}}>E-MAIL</h4>
                      <p className="text-muted-foreground font-heading font-normal" style={{letterSpacing: '0.05em'}}>
                        contato@fglaport.com.br<br />
                        comercial@fglaport.com.br
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Clock size={24} className="text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-normal text-primary mb-1" style={{letterSpacing: '0.05em'}}>HORÁRIO</h4>
                      <p className="text-muted-foreground font-heading font-normal" style={{letterSpacing: '0.05em'}}>
                        Segunda à Sexta: 8h às 18h<br />
                        Sábado: 8h às 12h
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;