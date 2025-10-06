import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, Settings } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const menuItems = [
    { label: "HOME", href: "/" },
    { label: "FG LAPORT", href: "/fg-laport" },
    { 
      label: "SERVIÇOS", 
      href: "/servicos",
      dropdown: [
        { label: "Dragagem e Desassoreamento", href: "/servicos/dragagem-desassoreamento" },
        { label: "Terraplenagem", href: "/servicos/terraplenagem" },
        { label: "Locação de Equipamentos", href: "/servicos/locacao-equipamentos" },
        { label: "Infraestrutura", href: "/servicos/infraestrutura" },
        { label: "Projeto e Gerenciamento de Obra", href: "/servicos/projeto-gerenciamento" },
        { label: "Construção Civil", href: "/servicos/construcao-civil" },
        { label: "Estrutura Metálica", href: "/servicos/estrutura-metalica" },
        { label: "Planejamento e Viabilidade de Obra", href: "/servicos/planejamento-viabilidade" },
      ]
    },
    { label: "OBRAS EXECUTADAS", href: "/obras-executadas" },
    { label: "INFORMATIVO", href: "/informativo" },
    { label: "CONTATO", href: "/contato" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/7369b880-71b0-43f8-bf9e-6aa670edfbab.png" 
              alt="Laport Engenharia Logo" 
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-heading font-normal text-xl text-primary leading-none" style={{letterSpacing: '0.05em'}}>LAPORT</span>
              <span className="font-heading font-normal text-sm text-muted-foreground leading-none" style={{letterSpacing: '0.05em'}}>ENGENHARIA</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.dropdown && item.dropdown.some(subItem => location.pathname === subItem.href));
              
              return (
                <div 
                  key={item.label} 
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`font-heading font-normal transition-colors flex items-center gap-1 ${
                      isActive 
                        ? 'text-secondary' 
                        : 'text-foreground hover:text-secondary'
                    }`}
                    style={{fontSize: '16px', letterSpacing: '0.05em'}}
                  >
                    {item.label}
                    {item.dropdown && <ChevronDown size={16} />}
                  </Link>
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl border border-border py-2 z-50">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          className="block px-4 py-3 font-heading font-normal text-foreground hover:bg-muted hover:text-secondary transition-colors"
                          style={{fontSize: '14px', letterSpacing: '0.05em'}}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Admin Panel Button */}
            <Link
              to="/admin"
              className="text-foreground hover:text-secondary transition-colors"
              title="Painel Administrativo"
            >
              <Settings size={20} />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-border bg-white/95 backdrop-blur-sm">
            <div className="py-4 space-y-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`block font-heading font-normal transition-colors ${
                      isActive 
                        ? 'text-secondary' 
                        : 'text-foreground hover:text-secondary'
                    }`}
                    style={{fontSize: '16px', letterSpacing: '0.05em'}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Admin Panel Button for Mobile */}
              <Link
                to="/admin"
                className="block font-heading font-normal text-foreground hover:text-secondary transition-colors"
                style={{fontSize: '16px', letterSpacing: '0.05em'}}
                onClick={() => setIsMenuOpen(false)}
              >
                ADMIN
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;