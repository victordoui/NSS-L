import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, Settings, X } from "lucide-react";
import "@/pages/Index.css";

const menuItems = [
  { label: "Início", href: "/" },
  { label: "A NSS", href: "/nss-engenharia" },
  { label: "Serviços", href: "/servicos" },
  { label: "Obras", href: "/obras-executadas" },
  { label: "Informativo", href: "/informativo" },
  { label: "Contato", href: "/contato" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="editorial-header">
      <div className="editorial-header__brand-row">
        <Link to="/" className="editorial-header__logo" aria-label="NSS Engenharia - início">
          <img src="/assets/images/nss-engenharia-logo.png" alt="NSS Engenharia" />
        </Link>

        <div className="editorial-header__signature" aria-hidden="true">
          Engenharia diagnóstica
          <span>Patologia das construções</span>
        </div>

        <Link to="/contato" className="editorial-header__cta">
          Solicite uma avaliação <ArrowRight size={14} />
        </Link>

        <button
          type="button"
          className="editorial-header__menu-button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav className={`editorial-header__nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
        <div className="editorial-header__links">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={isActive ? "is-active" : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <Link
          to="/admin"
          className="editorial-header__admin"
          aria-label="Painel administrativo"
          onClick={() => setIsMenuOpen(false)}
        >
          <Settings size={15} />
          <span>Admin</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
