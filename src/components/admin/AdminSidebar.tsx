import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Share2, 
  Wrench, 
  FileText, 
  Building2,
  Phone,
  Newspaper,
  HelpCircle,
  ChevronRight,
  Mail
} from 'lucide-react';
import { useContactMessages } from '@/hooks/useContactMessages';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { unreadCount } = useContactMessages();

  const contentItems = [
    {
      title: 'Mensagens',
      icon: Mail,
      href: '/admin/messages',
      badge: unreadCount,
    },
    {
      title: 'Serviços',
      icon: Wrench,
      href: '/admin/services',
    },
    {
      title: 'Informativo',
      icon: FileText,
      href: '/admin/articles',
    },
    {
      title: 'Obras Executadas',
      icon: Building2,
      href: '/admin/projects',
    },
  ];

  const configItems = [
    {
      title: 'Redes Sociais',
      icon: Share2,
      href: '/admin/social-links',
    },
    {
      title: 'Dados de Contato',
      icon: Phone,
      href: '/admin/contact-info',
    },
    {
      title: 'Configurações',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (items: typeof contentItems) => 
    items.some(item => isActive(item.href));

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-800 bg-[#141414]">
      <SidebarContent className="gap-4 py-4">
        {/* Logo Section */}
        {!isCollapsed && (
          <div className="px-6 pb-4 mb-2 border-b border-gray-800 bg-gradient-to-b from-black to-[#141414]">
            <div className="flex items-center gap-3 group">
              <img 
                src="/assets/images/fg-laport-logo.png" 
                alt="FG Laport Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="text-lg font-bold leading-tight text-brand-gold font-heading">LAPORT</h2>
                <p className="text-xs text-gray-400 font-medium font-body">Engenharia</p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive('/admin')} 
                className={cn(
                  "h-12 text-base px-4 transition-all duration-200 text-gray-200 hover:bg-white/5 hover:translate-x-1",
                  isActive('/admin') && "bg-gradient-to-r from-brand-gold/20 to-transparent border-l-3 border-brand-gold font-semibold text-white"
                )}
              >
                <Link to="/admin" className="flex items-center gap-3">
                  <LayoutDashboard className={cn("h-5 w-5", isActive('/admin') && "text-brand-gold")} />
                  <span className="font-body">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Conteúdo */}
        <SidebarGroup className="mt-2">
          <Collapsible defaultOpen={true} className="group/collapsible">
            <SidebarGroupLabel asChild className="h-10 px-4 mb-1">
              <CollapsibleTrigger className="w-full hover:bg-white/5 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                    <Newspaper className="h-4 w-4 text-brand-gold" />
                  </div>
                  {!isCollapsed && <span className="font-bold text-xs uppercase tracking-wider text-gray-400 font-heading">Conteúdo</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90 text-gray-400" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {contentItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.href)} 
                        className={cn(
                          "h-10 text-sm pl-12 transition-all duration-200 hover:translate-x-1 text-gray-300 hover:bg-white/5",
                          isActive(item.href) && "bg-gradient-to-r from-brand-gold/20 to-transparent border-l-3 border-brand-gold font-semibold text-white"
                        )}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          <item.icon className={cn("h-4 w-4", isActive(item.href) && "text-brand-gold")} />
                          <span className="font-body">{item.title}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Configurações */}
        <SidebarGroup className="mt-4 pt-4 border-t border-gray-800">
          <Collapsible defaultOpen={true} className="group/collapsible">
            <SidebarGroupLabel asChild className="h-10 px-4 mb-1">
              <CollapsibleTrigger className="w-full hover:bg-white/5 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold-light/10 flex items-center justify-center group-hover:bg-brand-gold-light/20 transition-colors">
                    <Settings className="h-4 w-4 text-brand-gold-light" />
                  </div>
                  {!isCollapsed && <span className="font-bold text-xs uppercase tracking-wider text-gray-400 font-heading">Configurações</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90 text-gray-400" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {configItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.href)} 
                        className={cn(
                          "h-10 text-sm pl-12 transition-all duration-200 hover:translate-x-1 text-gray-300 hover:bg-white/5",
                          isActive(item.href) && "bg-gradient-to-r from-brand-gold/20 to-transparent border-l-3 border-brand-gold font-semibold text-white"
                        )}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          <item.icon className={cn("h-4 w-4", isActive(item.href) && "text-brand-gold")} />
                          <span className="font-body">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Ajuda */}
        <SidebarGroup className="mt-auto border-t border-gray-800 pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive('/admin/help')} 
                className={cn(
                  "h-10 text-sm px-4 transition-all duration-200 text-gray-300 hover:bg-white/5 hover:translate-x-1",
                  isActive('/admin/help') && "bg-gradient-to-r from-brand-gold/20 to-transparent border-l-3 border-brand-gold font-semibold text-white"
                )}
              >
                <Link to="/admin/help" className="flex items-center gap-3">
                  <HelpCircle className={cn("h-4 w-4", isActive('/admin/help') && "text-brand-gold")} />
                  <span className="font-body">Ajuda</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
