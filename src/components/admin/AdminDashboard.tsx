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
      
      // Fetch messages to count unread ones
      const allMessagesRes = await supabase.from('contact_messages').select('is_read');
      const unreadCount = allMessagesRes.data?.filter(m => !m.is_read).length || 0;

      setStats({
        services: servicesRes.count || 0,
        articles: articlesRes.count || 0,
        projects: projectsRes.count || 0,
        socialLinks: socialLinksRes.count || 0,
        messages: messagesRes.count || 0,
        unreadMessages: unreadCount,
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo ao Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Services Card */}
        <Link to="/admin/services">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Serviços
              </CardTitle>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all">
                <Wrench className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.services}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Serviços cadastrados
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Articles Card */}
        <Link to="/admin/articles">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-green-500/20 dark:hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Artigos
              </CardTitle>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition-all">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.articles}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Artigos publicados
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Projects Card */}
        <Link to="/admin/projects">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Projetos
              </CardTitle>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <Image className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.projects}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Obras executadas
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Social Links Card */}
        <Link to="/admin/social-links">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-orange-500/20 dark:hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Redes Sociais
              </CardTitle>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg group-hover:shadow-orange-500/50 transition-all">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.socialLinks}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Links ativos
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Messages Card */}
        <Link to="/admin/messages">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Mensagens
              </CardTitle>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg group-hover:shadow-red-500/50 transition-all">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.messages}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.unreadMessages > 0 ? `${stats.unreadMessages} não lidas` : 'Todas lidas'}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Stats Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-green-500/10 dark:hover:shadow-green-500/20 hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Visualizações Hoje
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1,234</div>
            <p className="text-xs text-green-600 mt-1">
              +12% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Taxa de Engajamento
            </CardTitle>
            <Activity className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">68%</div>
            <p className="text-xs text-blue-600 mt-1">
              +5% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tempo Médio
            </CardTitle>
            <Clock className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">3m 24s</div>
            <p className="text-xs text-purple-600 mt-1">
              +18s este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Atualizações Recentes
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Últimas modificações no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {recentItems.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma atualização recente
              </p>
            ) : (
              recentItems.map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <div 
                    key={`${item.type}-${item.id}`}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Activity Chart Placeholder */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Atividade
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Visão geral dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Gráfico em desenvolvimento</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 transition-all duration-300">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Ações Rápidas
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/services">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 dark:border-gray-600 dark:hover:bg-gray-700">
                  <Wrench className="w-4 h-4" />
                  <span className="text-sm">Novo Serviço</span>
                </Button>
              </Link>
              <Link to="/admin/articles">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 dark:border-gray-600 dark:hover:bg-gray-700">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Novo Artigo</span>
                </Button>
              </Link>
              <Link to="/admin/projects">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 dark:border-gray-600 dark:hover:bg-gray-700">
                  <Image className="w-4 h-4" />
                  <span className="text-sm">Nova Obra</span>
                </Button>
              </Link>
              <Link to="/admin/messages">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 dark:border-gray-600 dark:hover:bg-gray-700">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Ver Mensagens</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-all">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <p className="font-medium text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Online
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Última Sincronização</p>
              <p className="font-medium text-gray-900 dark:text-white">Há 2 minutos</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Versão</p>
              <p className="font-medium text-gray-900 dark:text-white">2.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
