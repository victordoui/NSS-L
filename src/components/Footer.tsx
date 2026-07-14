import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import { useContactInfo } from "@/hooks/useContactInfo";

const Footer = () => {
  const { data: contactInfo } = useContactInfo();
  const phone = contactInfo?.find((item) => item.type === "phone" && item.is_active);
  const whatsapp = contactInfo?.find((item) => item.type === "whatsapp" && item.is_active);
  const email = contactInfo?.find((item) => item.type === "email" && item.is_active);
  const address = contactInfo?.find((item) => item.type === "address" && item.is_active);
  const mainPhone = whatsapp || phone;

  return (
    <footer className="editorial-footer">
      <div className="editorial-footer__top">
        <div className="editorial-footer__brand">
          <img src="/assets/images/nss-engenharia-logo.png" alt="NSS Engenharia" />
          <p>
            Engenharia diagnóstica para preservar estruturas, orientar decisões e construir
            segurança.
          </p>
          <SocialLinks />
        </div>

        <div className="editorial-footer__column">
          <h3>Navegue</h3>
          <Link to="/">Início</Link>
          <Link to="/nss-engenharia">A NSS Engenharia</Link>
          <Link to="/servicos">Serviços</Link>
          <Link to="/obras-executadas">Obras executadas</Link>
          <Link to="/informativo">Informativo</Link>
        </div>

        <div className="editorial-footer__column editorial-footer__contact">
          <h3>Fale conosco</h3>
          {mainPhone && (
            <a
              href={
                mainPhone.type === "whatsapp"
                  ? `https://wa.me/${mainPhone.value.replace(/\D/g, "")}`
                  : `tel:${mainPhone.value}`
              }
              target={mainPhone.type === "whatsapp" ? "_blank" : undefined}
              rel={mainPhone.type === "whatsapp" ? "noopener noreferrer" : undefined}
            >
              <Phone size={16} /> {mainPhone.value}
            </a>
          )}
          {email && (
            <a href={`mailto:${email.value}`}>
              <Mail size={16} /> {email.value}
            </a>
          )}
          {address && (
            <span>
              <MapPin size={16} /> {address.value}
            </span>
          )}
          <Link to="/contato" className="editorial-footer__button">
            Enviar uma mensagem
          </Link>
        </div>
      </div>

      <div className="editorial-footer__bottom">
        <span>© {new Date().getFullYear()} NSS Engenharia</span>
        <span>Precisão técnica. Soluções seguras.</span>
      </div>
    </footer>
  );
};

export default Footer;
