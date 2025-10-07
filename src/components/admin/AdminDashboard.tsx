import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Wrench, 
  FileText, 
  Building2, 
  Share2, 
  Settings, 
  Phone, 
  ChevronRight, 
  Users,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  services: number;
  articles: number;
  projects: number;
  socialLinks: number;
  contactMessages?: number;
}

interface RecentActivity {
  id: string;
  type: 'service' | 'article' | 'project' | 'contact';
  title: string;
  time: string;
  status: 'success' | 'pending' | 'error';
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    articles: 0,
    projects: 0,
    socialLinks: 0,
    contactMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'service',
      title: 'Novo serviço adicionado',
      time: '2 horas atrás',
      status: 'success'
    },
    {
      id: '2',
      type: 'contact',
      title: 'Nova mensagem de contato',
      time: '4 horas atrás',
      status: 'pending'
    },
    {
      id: '3',
      type: 'article',
      title: 'Artigo publicado',
      time: '1 dia atrás',
      status: 'success'
    }
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, articlesRes, projectsRes, socialLinksRes, contactRes] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact' }),
        supabase.from('articles').select('*', { count: 'exact' }),
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('social_links').select('*', { count: 'exact' }),
        supabase.from('contact_messages').select('*', { count: 'exact' })
      ]);

      setStats({
        services: servicesRes.count || 0,
        articles: articlesRes.count || 0,
        projects: projectsRes.count || 0,
        socialLinks: socialLinksRes.count || 0,
        contactMessages: contactRes.count || 0
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'service': return <Wrench className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'project': return <Building2 className="h-4 w-4" />;
      case 'contact': return <MessageSquare className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                Dashboard Admin
              </h1>
              <p className="hidden sm:block mt-1 text-sm text-gray-600">
                Gerencie o conteúdo do seu site
              </p>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed right-0 top-16 h-full w-64 bg-white shadow-lg p-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <Link to="/admin/services" className="mobile-action-button" onClick={() => setMobileMenuOpen(false)}>
                <Wrench className="h-5 w-5" />
                <span>Gerenciar Serviços</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>
              <Link to="/admin/articles" className="mobile-action-button" onClick={() => setMobileMenuOpen(false)}>
                <FileText className="h-5 w-5" />
                <span>Gerenciar Artigos</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>
              <Link to="/admin/projects" className="mobile-action-button" onClick={() => setMobileMenuOpen(false)}>
                <Building2 className="h-5 w-5" />
                <span>Gerenciar Projetos</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>
              <Link to="/admin/social-links" className="mobile-action-button" onClick={() => setMobileMenuOpen(false)}>
                <Share2 className="h-5 w-5" />
                <span>Links Sociais</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>
              <Link to="/admin/contact-messages" className="mobile-action-button" onClick={() => setMobileMenuOpen(false)}>
                <Phone className="h-5 w-5" />
                <span>Mensagens</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile-First Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="simple-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Serviços</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.services}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Link to="/admin/services" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Ver todos →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="simple-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Artigos</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.articles}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Link to="/admin/articles" className="text-xs sm:text-sm text-green-600 hover:text-green-800 font-medium">
                    Ver todos →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="simple-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Projetos</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.projects}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Link to="/admin/projects" className="text-xs sm:text-sm text-purple-600 hover:text-purple-800 font-medium">
                    Ver todos →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="simple-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Share2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Links Sociais</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.socialLinks}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Link to="/admin/social-links" className="text-xs sm:text-sm text-orange-600 hover:text-orange-800 font-medium">
                    Ver todos →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="simple-card sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Mensagens</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.contactMessages}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Link to="/admin/contact-messages" className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium">
                    Ver todas →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile-Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Recent Activities - Full width on mobile */}
            <div className="lg:col-span-2">
              <Card className="simple-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl text-gray-900">Atividades Recentes</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className={`flex-shrink-0 ${getStatusColor(activity.status)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions - Hidden on mobile, shown in mobile menu */}
            <div className="hidden md:block">
              <Card className="simple-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl text-gray-900">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-4">
                    <Link to="/admin/services" className="simple-button w-full">
                      <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Gerenciar Serviços</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                    <Link to="/admin/articles" className="simple-button w-full">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Gerenciar Artigos</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                    <Link to="/admin/projects" className="simple-button w-full">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Gerenciar Projetos</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                    <Link to="/admin/social-links" className="simple-button w-full">
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Links Sociais</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                    <Link to="/admin/contact-messages" className="simple-button w-full">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Mensagens de Contato</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;