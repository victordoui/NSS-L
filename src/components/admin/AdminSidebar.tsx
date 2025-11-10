import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Wrench,
  Image,
  Share2,
  Phone,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useContactMessages } from '@/hooks/useContactMessages';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const { unreadCount } = useContactMessages();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarContent>
        {/* Logo Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
              <span className="text-white font-bold text-lg">FG</span>
            </div>
            <span className="font-bold text-xl text-gray-900">LAPORT</span>
          </Link>
        </div>

        {/* Dashboard */}
        <SidebarGroup className="px-3 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/admin"
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                    isActive('/admin') && 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium'
                  )}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Visão Geral</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Conteúdo */}
        <SidebarGroup className="px-3 py-2">
          <SidebarGroupLabel className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Conteúdo</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/messages"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                      isActive('/admin/messages') && 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium'
                    )}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Mensagens</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/services"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                      isActive('/admin/services') && 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium'
                    )}
                  >
                    <Wrench className="w-5 h-5" />
                    <span>Serviços</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/articles"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                      isActive('/admin/articles') && 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium'
                    )}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Informativo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/projects"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                      isActive('/admin/projects') && 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium'
                    )}
                  >
                    <Image className="w-5 h-5" />
                    <span>Obras Executadas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuração */}
        <SidebarGroup className="px-3 py-2">
          <SidebarGroupLabel className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Configuração</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/social-links"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                      isActive('/admin/social-links') && 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium'
                    )}
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Rede Sociais</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/contact-info"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                      isActive('/admin/contact-info') && 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium'
                    )}
                  >
                    <Phone className="w-5 h-5" />
                    <span>Dados de Contato</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/settings"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                      isActive('/admin/settings') && 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium'
                    )}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Version */}
        <div className="mt-auto px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Versão 2.0.0</p>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
