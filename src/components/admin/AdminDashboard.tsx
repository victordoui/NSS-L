import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Wrench, 
  FileText, 
  Building2, 
  Share2, 
  MessageSquare,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  services: number;
  articles: number;
  projects: number;
  socialLinks: number;
  contactMessages?: number;
}

interface RecentItem {
  id: string;
  title: string;
  type: 'service' | 'article' | 'project';
  updated_at: string;
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
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

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

      // Fetch recent items
      const [recentServices, recentArticles, recentProjects] = await Promise.all([
        supabase.from('services').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(2),
        supabase.from('articles').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(2),
        supabase.from('projects').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(2)
      ]);

      const items: RecentItem[] = [
        ...(recentServices.data?.map(item => ({ ...item, type: 'service' as const })) || []),
        ...(recentArticles.data?.map(item => ({ ...item, type: 'article' as const })) || []),
        ...(recentProjects.data?.map(item => ({ ...item, type: 'project' as const })) || [])
      ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5);

      setRecentItems(items);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Serviço';
      case 'article': return 'Artigo';
      case 'project': return 'Projeto';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return <Wrench className="h-4 w-4 text-brand-gold" />;
      case 'article': return <FileText className="h-4 w-4 text-brand-gold-light" />;
      case 'project': return <Building2 className="h-4 w-4 text-gray-700" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600 font-body">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Visão Geral
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-body">
            Bem-vindo ao painel administrativo FG Laport
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchStats}
          className="hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span className="font-body">Atualizar</span>
        </Button>
      </div>

      {/* Stats Cards - Compact Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <Card className="admin-card-dashboard">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide font-body">
                    Serviços
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5 font-heading">
                    {stats.services}
                  </p>
                </div>
              </div>
              <Link to="/admin/services">
                <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4 text-brand-gold" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card-dashboard">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-gold-light to-brand-gold flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide font-body">
                    Artigos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5 font-heading">
                    {stats.articles}
                  </p>
                </div>
              </div>
              <Link to="/admin/articles">
                <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4 text-brand-gold" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card-dashboard">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide font-body">
                    Projetos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5 font-heading">
                    {stats.projects}
                  </p>
                </div>
              </div>
              <Link to="/admin/projects">
                <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4 text-brand-gold" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card-dashboard">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-gold-dark to-gray-700 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide font-body">
                    Redes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5 font-heading">
                    {stats.socialLinks}
                  </p>
                </div>
              </div>
              <Link to="/admin/social-links">
                <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4 text-brand-gold" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card-dashboard">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-gold to-yellow-400 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide font-body">
                    Mensagens
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5 font-heading">
                    {stats.contactMessages}
                  </p>
                </div>
              </div>
              <Link to="/admin/contact-messages">
                <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4 text-brand-gold" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates Table */}
      <Card className="admin-card-compact">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 font-heading">
            Últimas Atualizações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 font-body">Nenhuma atualização recente</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="pl-6">Tipo</th>
                    <th>Título</th>
                    <th>Atualizado</th>
                    <th className="pr-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map((item) => (
                    <tr key={`${item.type}-${item.id}`}>
                      <td className="pl-6">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="text-xs font-medium text-gray-600 uppercase font-body">
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                      </td>
                      <td className="font-medium text-gray-900 font-body">{item.title}</td>
                      <td className="text-gray-500 font-body">{formatDate(item.updated_at)}</td>
                      <td className="pr-6">
                        <Link 
                          to={`/admin/${item.type === 'service' ? 'services' : item.type === 'article' ? 'articles' : 'projects'}`}
                          className="text-brand-gold hover:text-brand-gold-dark font-medium text-sm font-body"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;