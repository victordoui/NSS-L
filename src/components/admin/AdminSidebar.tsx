import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Settings,
  MessageSquare,
  Wrench,
  Image,
  LayoutDashboard,
  Share2,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
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
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { useContactMessages } from '@/hooks/useContactMessages';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { unreadCount } = useContactMessages();
  const [contentOpen, setContentOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(true);

  const contentItems = [
    { title: 'Mensagens', icon: MessageSquare, href: '/admin/messages' },
    { title: 'Serviços', icon: Wrench, href: '/admin/services' },
    { title: 'Informativo', icon: FileText, href: '/admin/articles' },
    { title: 'Obras Executadas', icon: Image, href: '/admin/projects' },
  ];

  const configItems = [
    { title: 'Redes Sociais', icon: Share2, href: '/admin/social-links' },
    { title: 'Dados de Contato', icon: Phone, href: '/admin/contact-info' },
    { title: 'Configurações', icon: Settings, href: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-gray-800/50 bg-gradient-to-b from-gray-900 via-gray-900 to-black admin-sidebar-pattern">
      <SidebarContent>
        {!collapsed && (
          <div className="px-4 py-6 border-b border-brand-gold/20 bg-gradient-to-r from-brand-gold/5 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Link to="/admin" className="flex items-center gap-3 group relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center shadow-xl icon-glow group-hover:scale-110 transition-all duration-300">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white group-hover:text-brand-gold transition-colors font-heading tracking-[0.15em] block">
                  LAPORT
                </span>
                <span className="text-xs text-gray-400 font-body tracking-wider">
                  Engenharia
                </span>
              </div>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
          </div>
        )}

        <SidebarGroup className="px-2 py-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  'h-11 hover:bg-white/10 transition-all duration-300 ripple rounded-xl',
                  isActive('/admin') && 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 border-l-4 border-brand-gold text-brand-gold font-semibold shadow-lg'
                )}
              >
                <Link to="/admin" className="flex items-center gap-3">
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300',
                    isActive('/admin') 
                      ? 'bg-brand-gold/20 icon-glow' 
                      : 'bg-white/5 hover:bg-white/10'
                  )}>
                    <LayoutDashboard className={cn('w-5 h-5', isActive('/admin') && 'text-brand-gold')} />
                  </div>
                  {!collapsed && <span className="font-body font-medium">Dashboard</span>}
                  {isActive('/admin') && !collapsed && (
                    <Sparkles className="w-4 h-4 ml-auto text-brand-gold animate-pulse" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <Collapsible
          open={contentOpen}
          onOpenChange={setContentOpen}
          className="group/collapsible"
        >
          <SidebarGroup className="px-2 py-2">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="group/label py-2 hover:bg-white/8 cursor-pointer rounded-xl transition-all duration-300">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover/label:from-blue-500/30 group-hover/label:to-purple-500/30 transition-all duration-300 border border-blue-500/20">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-xs font-bold text-gray-300 uppercase tracking-[0.15em] group-hover/label:text-white transition-colors font-heading">
                        Conteúdo
                      </span>
                      {contentOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-300" />
                      )}
                    </>
                  )}
                </div>
              </SidebarGroupLabel>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {contentItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          'h-10 hover:bg-white/10 transition-all duration-300 rounded-xl ripple',
                          isActive(item.href) && 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 text-brand-gold border-l-4 border-brand-gold font-semibold'
                        )}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                            isActive(item.href)
                              ? 'bg-brand-gold/20 icon-glow scale-110'
                              : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                          )}>
                            <item.icon className={cn('w-4 h-4', isActive(item.href) && 'text-brand-gold')} />
                          </div>
                          {!collapsed && (
                            <>
                              <span className="flex-1 font-body">{item.title}</span>
                              {item.href === '/admin/messages' && unreadCount > 0 && (
                                <Badge
                                  variant="default"
                                  className="ml-auto h-5 min-w-[20px] px-1.5 text-xs bg-red-500 hover:bg-red-600 text-white animate-pulse"
                                >
                                  {unreadCount}
                                </Badge>
                              )}
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible
          open={configOpen}
          onOpenChange={setConfigOpen}
          className="group/collapsible"
        >
          <SidebarGroup className="px-2 py-2 mt-2 pt-4 border-t border-gray-800/50">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="group/label py-2 hover:bg-white/8 cursor-pointer rounded-xl transition-all duration-300">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center group-hover/label:from-amber-500/30 group-hover/label:to-orange-500/30 transition-all duration-300 border border-amber-500/20">
                    <Settings className="w-4 h-4 text-amber-400" />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-xs font-bold text-gray-300 uppercase tracking-[0.15em] group-hover/label:text-white transition-colors font-heading">
                        Configurações
                      </span>
                      {configOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-300" />
                      )}
                    </>
                  )}
                </div>
              </SidebarGroupLabel>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {configItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          'h-10 hover:bg-white/10 transition-all duration-300 rounded-xl ripple',
                          isActive(item.href) && 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 text-brand-gold border-l-4 border-brand-gold font-semibold'
                        )}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                            isActive(item.href)
                              ? 'bg-brand-gold/20 icon-glow scale-110'
                              : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                          )}>
                            <item.icon className={cn('w-4 h-4', isActive(item.href) && 'text-brand-gold')} />
                          </div>
                          {!collapsed && <span className="font-body">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarGroup className="mt-auto px-2 py-3 border-t border-gray-800/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  'h-10 hover:bg-white/10 transition-all duration-300 rounded-xl ripple',
                  isActive('/admin/help') && 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 text-brand-gold border-l-4 border-brand-gold font-semibold'
                )}
              >
                <Link to="/admin/help" className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                    isActive('/admin/help')
                      ? 'bg-brand-gold/20 icon-glow scale-110'
                      : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                  )}>
                    <HelpCircle className={cn('w-4 h-4', isActive('/admin/help') && 'text-brand-gold')} />
                  </div>
                  {!collapsed && <span className="font-body">Ajuda</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {!collapsed && (
            <div className="mt-4 px-3 py-2 text-center">
              <p className="text-xs text-gray-500 font-body">v2.1.0</p>
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
