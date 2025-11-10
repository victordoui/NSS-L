import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Wrench,
  FileText,
  Image,
  Share2,
  MessageSquare,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Eye,
  Clock,
  Plus,
  Activity,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardStats {
  services: number;
  articles: number;
  projects: number;
  socialLinks: number;
  messages: number;
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
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [servicesRes, articlesRes, projectsRes, socialLinksRes, messagesRes] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact' }),
        supabase.from('articles').select('*', { count: 'exact' }),
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('social_links').select('*', { count: 'exact' }),
        supabase.from('contact_messages').select('*', { count: 'exact' }),
      ]);

      setStats({
        services: servicesRes.count || 0,
        articles: articlesRes.count || 0,
        projects: projectsRes.count || 0,
        socialLinks: socialLinksRes.count || 0,
        messages: messagesRes.count || 0,
      });

      // Fetch recent items
      const [recentServices, recentArticles, recentProjects] = await Promise.all([
        supabase.from('services').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(2),
        supabase.from('articles').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(2),
        supabase.from('projects').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(2),
      ]);

      const items: RecentItem[] = [
        ...(recentServices.data?.map((item) => ({ ...item, type: 'service' as const })) || []),
        ...(recentArticles.data?.map((item) => ({ ...item, type: 'article' as const })) || []),
        ...(recentProjects.data?.map((item) => ({ ...item, type: 'project' as const })) || []),
      ]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5);

      setRecentItems(items);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service':
        return 'Serviço';
      case 'article':
        return 'Artigo';
      case 'project':
        return 'Projeto';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service':
        return <Wrench className="h-4 w-4 text-brand-gold" />;
      case 'article':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'project':
        return <Image className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <>
      {loading ? (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="skeleton">
                <CardContent className="p-6">
                  <Skeleton className="h-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-heading">Visão Geral</h1>
              <p className="text-sm text-gray-600 mt-2 font-body">Bem-vindo ao painel administrativo FG Laport</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-body">Atualizado agora</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchStats}
                className="gap-2 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>

          {/* Hero Stats Cards - Vertical Premium */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            <Card className="admin-card-premium group animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold-dark p-4 shadow-xl icon-glow group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-full h-full text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-body">
                  Serviços
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-3 tabular-nums font-heading animate-count-up">
                  {stats.services}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span>Ativos</span>
                </div>
                <Link to="/admin/services">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-brand-gold group-hover:text-white group-hover:border-brand-gold transition-all duration-300"
                  >
                    Ver Todos <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="admin-card-premium group animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-xl icon-glow group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-full h-full text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-body">Artigos</p>
                <p className="text-4xl font-bold text-gray-900 mb-3 tabular-nums font-heading animate-count-up">
                  {stats.articles}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span>Publicados</span>
                </div>
                <Link to="/admin/articles">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300"
                  >
                    Ver Todos <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="admin-card-premium group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-xl icon-glow group-hover:scale-110 transition-transform duration-300">
                  <Image className="w-full h-full text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-body">Projetos</p>
                <p className="text-4xl font-bold text-gray-900 mb-3 tabular-nums font-heading animate-count-up">
                  {stats.projects}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                  <Eye className="w-3 h-3 text-purple-500" />
                  <span>Concluídos</span>
                </div>
                <Link to="/admin/projects">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all duration-300"
                  >
                    Ver Todos <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="admin-card-premium group animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-4 shadow-xl icon-glow group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="w-full h-full text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-body">
                  Redes Sociais
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-3 tabular-nums font-heading animate-count-up">
                  {stats.socialLinks}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                  <Activity className="w-3 h-3 text-green-500" />
                  <span>Conectadas</span>
                </div>
                <Link to="/admin/social-links">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-all duration-300"
                  >
                    Ver Todas <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="admin-card-premium group animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-4 shadow-xl icon-glow group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-full h-full text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-body">Mensagens</p>
                <p className="text-4xl font-bold text-gray-900 mb-3 tabular-nums font-heading animate-count-up">
                  {stats.messages}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                  <Clock className="w-3 h-3 text-red-500" />
                  <span>Recebidas</span>
                </div>
                <Link to="/admin/messages">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all duration-300"
                  >
                    Ver Todas <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Mini Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="admin-card-mini">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="h-5 w-5 text-brand-gold" />
                  <span className="text-2xl font-bold text-gray-900 tabular-nums font-heading">1.2k</span>
                </div>
                <p className="text-xs text-gray-500 font-body">Visualizações Hoje</p>
              </CardContent>
            </Card>

            <Card className="admin-card-mini">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-900 tabular-nums font-heading">87%</span>
                </div>
                <p className="text-xs text-gray-500 font-body">Taxa de Engajamento</p>
              </CardContent>
            </Card>

            <Card className="admin-card-mini">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold text-gray-900 tabular-nums font-heading">2m 30s</span>
                </div>
                <p className="text-xs text-gray-500 font-body">Tempo Médio</p>
              </CardContent>
            </Card>

            <Card className="admin-card-mini">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900 tabular-nums font-heading">+23%</span>
                </div>
                <p className="text-xs text-gray-500 font-body">Crescimento</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column - Recent Activity */}
            <div className="lg:col-span-2 space-y-5">
              {/* Recent Updates with Timeline Style */}
              <Card className="admin-card-premium">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-heading">
                      <Clock className="h-5 w-5 text-brand-gold" />
                      Últimas Atualizações
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="gap-2 hover:text-brand-gold">
                      Ver Todas <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {recentItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="font-body">Nenhuma atualização recente</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentItems.map((item, index) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className="p-5 hover:bg-gray-50/50 transition-colors group animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 group-hover:scale-110 transition-all duration-300 shrink-0">
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate font-body text-base">
                                  {item.title}
                                </h4>
                                <Badge variant="outline" className="shrink-0 font-body text-xs">
                                  {getTypeLabel(item.type)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 font-body">{formatDate(item.updated_at)}</p>
                            </div>
                            <Link
                              to={`/admin/${
                                item.type === 'service' ? 'services' : item.type === 'article' ? 'articles' : 'projects'
                              }`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity Chart Placeholder */}
              <Card className="admin-card-premium">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Atividade dos Últimos 30 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                    <div className="text-center">
                      <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-400 font-body">Gráfico de atividades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Actions & Info */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <Card className="admin-card-premium">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-heading">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all"
                    asChild
                  >
                    <Link to="/admin/services">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Serviço
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                    asChild
                  >
                    <Link to="/admin/articles">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Artigo
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all"
                    asChild
                  >
                    <Link to="/admin/projects">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Projeto
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* System Info */}
              <Card className="admin-card-premium">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-heading">Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-body">Status</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-body">Última Sincronização</span>
                    <span className="text-gray-900 font-medium font-body">Agora</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-body">Versão</span>
                    <span className="text-gray-900 font-medium font-body">2.1.0</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
