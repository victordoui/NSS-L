import { useServices } from "@/hooks/useServices";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { Phone, Mail } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
const Footer = () => {
  const {
    data: services,
    isLoading: servicesLoading
  } = useServices();
  const {
    data: contactInfo,
    isLoading: contactLoading
  } = useContactInfo();
  const phoneContact = contactInfo?.find(c => c.type === 'phone' && c.is_active);
  const whatsappContact = contactInfo?.find(c => c.type === 'whatsapp' && c.is_active);
  const emailContact = contactInfo?.find(c => c.type === 'email' && c.is_active);
  return <footer className="section-dark py-12">
      <div className="container">
        {/* Top Section - Logo Left, Contact Info Center */}
        <div className="mb-12 pb-8 border-b border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo - Left */}
            <div className="flex items-center gap-3">
              <img src="/assets/images/fg-laport-logo.png" alt="FG LAPORT Logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col">
                <span className="font-heading font-normal text-xl leading-none" style={{
                letterSpacing: '0.05em'
              }}>LAPORT</span>
                <span className="font-heading font-normal text-sm opacity-80 leading-none" style={{
                letterSpacing: '0.05em'
              }}>ENGENHARIA</span>
              </div>
            </div>

            {/* Contact Info - Center */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {phoneContact && <a href={`tel:${phoneContact.value}`} className="flex items-center gap-4 text-white/90 hover:text-secondary transition-colors">
                  <Phone size={36} />
                  <div className="flex flex-col">
                    <span className="font-heading font-normal text-sm opacity-70" style={{
                  letterSpacing: '0.05em'
                }}>TELEFONE</span>
                    <span className="font-heading font-normal text-lg" style={{
                  letterSpacing: '0.05em'
                }}>
                      {phoneContact.value}
                    </span>
                  </div>
                </a>}
              
              {whatsappContact && <a href={`https://wa.me/${whatsappContact.value.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/90 hover:text-secondary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <div className="flex flex-col">
                    <span className="font-heading font-normal text-sm opacity-70" style={{
                  letterSpacing: '0.05em'
                }}>WHATSAPP</span>
                    <span className="font-heading font-normal text-lg" style={{
                  letterSpacing: '0.05em'
                }}>
                      {whatsappContact.value}
                    </span>
                  </div>
                </a>}
              
              {emailContact && <a href={`mailto:${emailContact.value}`} className="flex items-center gap-4 text-white/90 hover:text-secondary transition-colors">
                  <Mail size={36} />
                  <div className="flex flex-col">
                    <span className="font-heading font-normal text-sm opacity-70" style={{
                  letterSpacing: '0.05em'
                }}>E-MAIL</span>
                    <span className="font-heading font-normal text-lg" style={{
                  letterSpacing: '0.05em'
                }}>
                      {emailContact.value}
                    </span>
                  </div>
                </a>}
            </div>

            {/* Empty spacer for balance */}
            <div className="hidden md:block w-[180px]"></div>
          </div>
        </div>

        {/* Middle Section - Three Columns */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* INSTITUCIONAL */}
          <div>
            <h4 className="font-heading font-normal mb-4 text-xl" style={{
            letterSpacing: '0.05em'
          }}>INSTITUCIONAL</h4>
            <ul className="space-y-1">
              <li><a href="/" className="text-white/80 hover:text-secondary transition-colors font-heading font-normal" style={{
                letterSpacing: '0.05em'
              }}>HOME</a></li>
              <li><a href="/fg-laport" className="text-white/80 hover:text-secondary transition-colors font-heading font-normal" style={{
                letterSpacing: '0.05em'
              }}>FG LAPORT</a></li>
              <li><a href="/servicos" className="text-white/80 hover:text-secondary transition-colors font-heading font-normal" style={{
                letterSpacing: '0.05em'
              }}>SERVIÇOS</a></li>
              <li><a href="/obras-executadas" className="text-white/80 hover:text-secondary transition-colors font-heading font-normal" style={{
                letterSpacing: '0.05em'
              }}>OBRAS EXECUTADAS</a></li>
              <li><a href="/informativo" className="text-white/80 hover:text-secondary transition-colors font-heading font-normal" style={{
                letterSpacing: '0.05em'
              }}>INFORMATIVO</a></li>
              <li><a href="/contato" className="text-white/80 hover:text-secondary transition-colors font-heading font-normal" style={{
                letterSpacing: '0.05em'
              }}>CONTATO</a></li>
            </ul>
          </div>
          
          {/* SERVIÇOS */}
          <div>
            <h4 className="font-heading font-normal mb-4 text-xl" style={{
            letterSpacing: '0.05em'
          }}>SERVIÇOS</h4>
            <ul className="space-y-1">
              {servicesLoading ? Array.from({
              length: 8
            }).map((_, index) => <li key={index}>
                    <div className="h-4 bg-white/20 animate-pulse rounded"></div>
                  </li>) : (() => {
              const displayServices = ['projetos-geotecnia', 'projeto-estrutura', 'projeto-drenagem', 'projetos-terraplanagem', 'projetos-acessibilidade', 'obras-contencao', 'obras-reformas', 'sondagem-spt'];
              return displayServices.map(slug => {
                const service = services?.find(s => s.slug === slug);
                if (!service) return null;
                return <li key={service.id}>
                        <a href={`/servicos/${service.slug}`} className="text-white/80 hover:text-secondary transition-colors font-heading font-normal" style={{
                    letterSpacing: '0.05em'
                  }}>
                          {service.title.toUpperCase()}
                        </a>
                      </li>;
              }).filter(Boolean);
            })()}
            </ul>
          </div>

          {/* ACOMPANHE NOSSAS REDES SOCIAIS */}
          <div>
            <h4 className="font-heading font-normal mb-4 text-xl" style={{
            letterSpacing: '0.05em'
          }}>ACOMPANHE NOSSAS REDES SOCIAIS</h4>
            <SocialLinks />
          </div>
        </div>
        
        {/* Bottom Bar - Copyright */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/60 text-sm font-heading font-normal" style={{
          letterSpacing: '0.05em'
        }}>
            © {new Date().getFullYear()} FG LAPORT. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;