import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Wrench,
  FileText,
  Image,
  Share2,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Activity,
  Clock,
  Info,
  Zap,
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
  unreadMessages: number;
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
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const servicesRes = await supabase.from('services').select('id', { count: 'exact', head: true });
      const articlesRes = await supabase.from('articles').select('id', { count: 'exact', head: true });
      const projectsRes = await supabase.from('projects').select('id', { count: 'exact', head: true });
      const socialLinksRes = await supabase.from('social_links').select('id', { count: 'exact', head: true });
      const messagesRes = await supabase.from('contact_messages').select('id', { count: 'exact', head: true });
      const unreadMessages = await supabase.from('contact_messages').select('read').eq('read', false);

      setStats({
        services: servicesRes.count || 0,
        articles: articlesRes.count || 0,
        projects: projectsRes.count || 0,
        socialLinks: socialLinksRes.count || 0,
        messages: messagesRes.count || 0,
        unreadMessages: unreadMessages.data?.length || 0,
      });

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
        return Wrench;
      case 'article':
        return FileText;
      case 'project':
        return Image;
      default:
        return FileText;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Dashboard
          </h1>
          <p className="text-gray-600">
            Gerencie todo o conteúdo do seu site em um só lugar
          </p>
        </div>
        <Button
          onClick={fetchStats}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Services Card */}
        <Link to="/admin/services">
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Serviços
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.services}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Serviços cadastrados
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Articles Card */}
        <Link to="/admin/articles">
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Artigos
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.articles}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Artigos publicados
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Projects Card */}
        <Link to="/admin/projects">
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projetos
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.projects}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Obras executadas
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Social Links Card */}
        <Link to="/admin/social-links">
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Redes Sociais
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.socialLinks}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Links ativos
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Messages Card */}
        <Link to="/admin/messages">
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mensagens
              </CardTitle>
              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.messages}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.unreadMessages > 0 ? `${stats.unreadMessages} não lidas` : 'Todas lidas'}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Stats Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Visualizações Hoje
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,234</div>
            <p className="text-xs text-green-600 mt-1">
              +12% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Engajamento
            </CardTitle>
            <Activity className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">68%</div>
            <p className="text-xs text-blue-600 mt-1">
              +5% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tempo Médio
            </CardTitle>
            <Clock className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">3m 24s</div>
            <p className="text-xs text-purple-600 mt-1">
              +18s este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="w-5 h-5 text-gray-600" />
            Atualizações Recentes
          </CardTitle>
          <CardDescription>
            Últimas modificações no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma atualização recente
              </p>
            ) : (
              recentItems.map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <div 
                    key={`${item.type}-${item.id}`}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getTypeLabel(item.type)} • {formatDate(item.updated_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart Placeholder */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Activity className="w-5 h-5 text-gray-600" />
              Atividade
            </CardTitle>
            <CardDescription>
              Visão geral dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Gráfico em desenvolvimento</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Zap className="w-5 h-5 text-gray-600" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/services">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <Wrench className="w-4 h-4" />
                  <span className="text-sm">Novo Serviço</span>
                </Button>
              </Link>
              <Link to="/admin/articles">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Novo Artigo</span>
                </Button>
              </Link>
              <Link to="/admin/projects">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <Image className="w-4 h-4" />
                  <span className="text-sm">Nova Obra</span>
                </Button>
              </Link>
              <Link to="/admin/messages">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Ver Mensagens</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Info className="w-5 h-5 text-gray-600" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Status</p>
              <p className="font-medium text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Online
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Última Sincronização</p>
              <p className="font-medium text-gray-900">Há 2 minutos</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Versão</p>
              <p className="font-medium text-gray-900">2.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
