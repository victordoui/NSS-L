import { useState } from 'react';
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
  ChevronLeft,
  ChevronDown,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useContactMessages } from '@/hooks/useContactMessages';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { messages } = useContactMessages();
  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

  // Estados para controlar expansão dos grupos
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(true);

  const dashboardItems = [
    {
      title: 'Visão Geral',
      url: '/admin',
      icon: LayoutDashboard,
    },
  ];

  const contentItems = [
    {
      title: 'Mensagens',
      url: '/admin/messages',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      title: 'Serviços',
      url: '/admin/services',
      icon: Wrench,
    },
    {
      title: 'Informativo',
      url: '/admin/articles',
      icon: FileText,
    },
    {
      title: 'Obras Executadas',
      url: '/admin/projects',
      icon: Image,
    },
  ];

  const configItems = [
    {
      title: 'Redes Sociais',
      url: '/admin/social-links',
      icon: Share2,
    },
    {
      title: 'Dados de Contato',
      url: '/admin/contact-info',
      icon: Phone,
    },
    {
      title: 'Configurações',
      url: '/admin/settings',
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // Verificar se há rotas ativas em cada grupo
  const hasDashboardActive = dashboardItems.some(item => isActive(item.url));
  const hasContentActive = contentItems.some(item => isActive(item.url));
  const hasConfigActive = configItems.some(item => isActive(item.url));

  const renderMenuItem = (item: { title: string; url: string; icon: any; badge?: number }) => {
    const active = isActive(item.url);
    const menuButton = (
      <SidebarMenuButton asChild className={cn(
        "h-10 text-sm relative transition-all",
        active && "bg-gray-100 dark:bg-gray-800 text-primary font-semibold before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r"
      )}>
        <Link to={item.url} className="flex items-center gap-3 pl-11">
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </Link>
      </SidebarMenuButton>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{item.title}</span>
            {item.badge && (
              <Badge variant="destructive">{item.badge}</Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return menuButton;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon" className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        {/* Logo Section */}
        <SidebarHeader className="border-b border-gray-100/50 dark:border-gray-800/50">
          <div className="flex items-center justify-center py-6">
            <img 
              src="/assets/images/fg-laport-logo.png" 
              alt="FG Laport Logo" 
              className={cn(
                "object-contain transition-all duration-300",
                isCollapsed ? "w-10 h-10" : "w-20 h-20"
              )}
            />
          </div>
        </SidebarHeader>


        <SidebarContent className="px-3 py-4">
          {/* Dashboard Group */}
          {!isCollapsed ? (
            <Collapsible 
              open={dashboardOpen || hasDashboardActive} 
              onOpenChange={setDashboardOpen}
              className="space-y-1"
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="text-base font-semibold text-gray-900 dark:text-white px-3 mb-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md py-2 transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="flex-1">Dashboard</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    !(dashboardOpen || hasDashboardActive) && "-rotate-90"
                  )} />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {dashboardItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        {renderMenuItem(item)}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarGroup>
              <SidebarGroupLabel className="text-base font-semibold text-gray-900 dark:text-white px-3 mb-2 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {dashboardItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {renderMenuItem(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Content Group */}
          {!isCollapsed ? (
            <Collapsible 
              open={contentOpen || hasContentActive} 
              onOpenChange={setContentOpen}
              className="space-y-1"
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="text-base font-semibold text-gray-900 dark:text-white px-3 mb-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md py-2 transition-colors">
                  <FileText className="w-5 h-5" />
                  <span className="flex-1">Conteúdo</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    !(contentOpen || hasContentActive) && "-rotate-90"
                  )} />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {contentItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        {renderMenuItem(item)}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarGroup>
              <SidebarGroupLabel className="text-base font-semibold text-gray-900 dark:text-white px-3 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {contentItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {renderMenuItem(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Configuration Group */}
          {!isCollapsed ? (
            <Collapsible 
              open={configOpen || hasConfigActive} 
              onOpenChange={setConfigOpen}
              className="space-y-1"
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="text-base font-semibold text-gray-900 dark:text-white px-3 mb-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md py-2 transition-colors">
                  <Settings className="w-5 h-5" />
                  <span className="flex-1">Configuração</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    !(configOpen || hasConfigActive) && "-rotate-90"
                  )} />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {configItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        {renderMenuItem(item)}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarGroup>
              <SidebarGroupLabel className="text-base font-semibold text-gray-900 dark:text-white px-3 mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {configItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {renderMenuItem(item)}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer Version */}
        {!isCollapsed && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Versão 2.0.0</p>
          </div>
        )}
      </Sidebar>
    </TooltipProvider>
  );
};

export default AdminSidebar;
