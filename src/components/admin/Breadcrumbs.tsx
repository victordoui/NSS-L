import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/services': 'Serviços',
  '/admin/articles': 'Informativo',
  '/admin/projects': 'Obras Executadas',
  '/admin/social-links': 'Redes Sociais',
  '/admin/contact-info': 'Dados de Contato',
  '/admin/settings': 'Configurações do Site',
  '/admin/help': 'Ajuda',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Se estiver no dashboard principal, não mostrar breadcrumbs
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.length > 1 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {routeLabels[location.pathname] || pathSegments[pathSegments.length - 1]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
