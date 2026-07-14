import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  Wrench, 
  Image, 
  Share2,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { ActivityLineChart, type ActivityDataPoint } from './charts/ActivityLineChart';
import { DistributionBarChart, type DistributionDataPoint } from './charts/DistributionBarChart';
import { RecentMessagesTable } from './tables/RecentMessagesTable';
import type { Tables } from '@/integrations/supabase/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardStats {
  services: number;
  articles: number;
  projects: number;
  socialLinks: number;
  messages: number;
  unreadMessages: number;
}

type DashboardPeriod = '24h' | '7d' | '30d' | 'all';
type TimestampedRow = { updated_at: string };
type ContactMessage = Tables<'contact_messages'>;

const isDashboardPeriod = (value: string): value is DashboardPeriod =>
  value === '24h' || value === '7d' || value === '30d' || value === 'all';

const processDataByDay = (
  services: TimestampedRow[],
  articles: TimestampedRow[],
  projects: TimestampedRow[],
  days: number,
): ActivityDataPoint[] => {
  const dayMap: Record<string, Omit<ActivityDataPoint, 'day'>> = {};

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    dayMap[dayKey] = { services: 0, articles: 0, projects: 0 };
  }

  const countRows = (rows: TimestampedRow[], key: keyof Omit<ActivityDataPoint, 'day'>) => {
    rows.forEach((item) => {
      const date = new Date(item.updated_at);
      const dayKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (dayMap[dayKey]) dayMap[dayKey][key] += 1;
    });
  };

  countRows(services, 'services');
  countRows(articles, 'articles');
  countRows(projects, 'projects');

  return Object.entries(dayMap).map(([day, counts]) => ({ day, ...counts }));
};

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
  const [period, setPeriod] = useState<DashboardPeriod>('7d');
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        { count: servicesCount },
        { count: articlesCount },
        { count: projectsCount },
        { count: socialLinksCount },
        { count: messagesCount },
        { data: unreadData }
      ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('social_links').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id').eq('is_read', false)
      ]);

      setStats({
        services: servicesCount || 0,
        articles: articlesCount || 0,
        projects: projectsCount || 0,
        socialLinks: socialLinksCount || 0,
        messages: messagesCount || 0,
        unreadMessages: unreadData?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivityData = useCallback(async (selectedPeriod: DashboardPeriod) => {
    try {
      const daysMap = { '24h': 1, '7d': 7, '30d': 30, 'all': 365 };
      const days = daysMap[selectedPeriod as keyof typeof daysMap];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [servicesData, articlesData, projectsData] = await Promise.all([
        supabase
          .from('services')
          .select('updated_at')
          .gte('updated_at', startDate.toISOString()),
        supabase
          .from('articles')
          .select('updated_at')
          .gte('updated_at', startDate.toISOString()),
        supabase
          .from('projects')
          .select('updated_at')
          .gte('updated_at', startDate.toISOString()),
      ]);

      const processedData = processDataByDay(
        servicesData.data || [],
        articlesData.data || [],
        projectsData.data || [],
        days
      );
      
      setActivityData(processedData);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  }, []);

  const fetchRecentMessages = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      setRecentMessages(data || []);
    } catch (error) {
      console.error('Error fetching recent messages:', error);
    }
  }, []);

  const getDistributionData = (): DistributionDataPoint[] => [
    { name: 'Serviços', value: stats.services },
    { name: 'Artigos', value: stats.articles },
    { name: 'Projetos', value: stats.projects },
    { name: 'Redes Sociais', value: stats.socialLinks },
  ];

  useEffect(() => {
    Promise.all([
      fetchStats(),
      fetchActivityData(period),
      fetchRecentMessages()
    ]);
  }, [fetchActivityData, fetchRecentMessages, fetchStats, period]);

  const heroCards = [
    {
      title: 'Total de Conteúdos',
      value: stats.services + stats.articles + stats.projects,
      icon: FileText,
      color: 'blue',
      description: 'Serviços + Artigos + Projetos',
      link: '/admin/services',
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Mensagens',
      value: stats.messages,
      icon: MessageSquare,
      color: 'green',
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} não lidas` : null,
      description: 'Total de mensagens de contato',
      link: '/admin/messages',
      gradient: 'from-green-500 to-green-700'
    },
    {
      title: 'Publicações Ativas',
      value: stats.articles,
      icon: FileText,
      color: 'purple',
      description: 'Artigos informativos',
      link: '/admin/articles',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Projetos',
      value: stats.projects,
      icon: Image,
      color: 'orange',
      description: 'Obras executadas cadastradas',
      link: '/admin/projects',
      gradient: 'from-orange-500 to-orange-700'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Hero Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[140px]" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>

        {/* Table Skeleton */}
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ===== SEÇÃO PRINCIPAL: Header + Cards ===== */}
      <div className="bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 rounded-3xl p-6 shadow-lg space-y-6">
        {/* Header with Period Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          
          <div className="flex items-center gap-3">
            <Select
              value={period}
              onValueChange={(value) => {
                if (isDashboardPeriod(value)) setPeriod(value);
              }}
            >
              <SelectTrigger className="w-[160px] h-9 rounded-xl">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="all">Todo período</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => {
                fetchStats();
                fetchActivityData(period);
                fetchRecentMessages();
              }} 
              variant="outline" 
              size="sm"
              className="h-9 rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Hero Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {heroCards.map((card) => (
            <Link key={card.title} to={card.link}>
              <Card className={cn(
                "border-0 group relative overflow-hidden cursor-pointer transition-all duration-300 rounded-2xl",
                "hover:shadow-2xl hover:scale-[1.03]",
                card.color === 'blue' && "hover:shadow-blue-500/30 dark:hover:shadow-blue-500/50",
                card.color === 'green' && "hover:shadow-green-500/30 dark:hover:shadow-green-500/50",
                card.color === 'purple' && "hover:shadow-purple-500/30 dark:hover:shadow-purple-500/50",
                card.color === 'orange' && "hover:shadow-orange-500/30 dark:hover:shadow-orange-500/50"
              )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={cn(
                    "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg",
                    "transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl",
                    `${card.gradient}`
                  )}>
                    <card.icon className="w-7 h-7 text-white drop-shadow-sm" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {card.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                  {card.badge && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                        {card.badge}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== ANÁLISES DETALHADAS ===== */}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityLineChart data={activityData} loading={false} />
        <DistributionBarChart data={getDistributionData()} loading={false} />
      </div>

      {/* Recent Messages Table */}
      <RecentMessagesTable messages={recentMessages} loading={false} />
    </div>
  );
};

export default AdminDashboard;
