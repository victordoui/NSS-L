import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Wrench, 
  FileText, 
  Building2, 
  Settings, 
  Share2,
  Phone,
  Activity,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DashboardStats {
  services: number;
  articles: number;
  projects: number;
  socialLinks: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    articles: 0,
    projects: 0,
    socialLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, articlesRes, projectsRes, socialLinksRes] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact' }),
        supabase.from('articles').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('social_links').select('id', { count: 'exact' }),
      ]);

      setStats({
        services: servicesRes.count || 0,
        articles: articlesRes.count || 0,
        projects: projectsRes.count || 0,
        socialLinks: socialLinksRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Serviços',
      value: stats.services,
      icon: Wrench,
      href: '/admin/services',
      description: 'Gerenciar serviços oferecidos',
      color: 'text-blue-600',
    },
    {
      title: 'Artigos',
      value: stats.articles,
      icon: FileText,
      href: '/admin/articles',
      description: 'Artigos do informativo',
      color: 'text-green-600',
    },
    {
      title: 'Projetos',
      value: stats.projects,
      icon: Building2,
      href: '/admin/projects',
      description: 'Obras executadas',
      color: 'text-purple-600',
    },
    {
      title: 'Redes Sociais',
      value: stats.socialLinks,
      icon: Share2,
      href: '/admin/social-links',
      description: 'Links das redes sociais',
      color: 'text-pink-600',
    },
  ];

  const quickActions = [
    {
      title: 'Configurações Gerais',
      description: 'Dados da empresa, contato e configurações',
      icon: Settings,
      href: '/admin/settings',
    },
    {
      title: 'Dados de Contato',
      description: 'Telefone, endereço e WhatsApp',
      icon: Phone,
      href: '/admin/contact-info',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Visão geral do painel administrativo
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="relative">
            <Activity className="h-4 w-4 text-green-600" />
            <div className="absolute inset-0 animate-ping">
              <Activity className="h-4 w-4 text-green-600 opacity-75" />
            </div>
          </div>
          <span className="font-semibold text-green-700 dark:text-green-400 text-sm">Sistema Online</span>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="admin-card-premium admin-stat-card group border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Serviços</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {stats.services}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Total de serviços cadastrados
            </p>
            <Button variant="outline" size="sm" className="w-full group-hover:border-blue-300 transition-colors" asChild>
              <Link to="/admin/services">
                Gerenciar
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="admin-card-premium admin-stat-card group border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Informativo</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-green-600 to-green-500 bg-clip-text text-transparent">
              {stats.articles}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Artigos publicados
            </p>
            <Button variant="outline" size="sm" className="w-full group-hover:border-green-300 transition-colors" asChild>
              <Link to="/admin/articles">
                Gerenciar
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="admin-card-premium admin-stat-card group border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Obras Executadas</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-purple-600 to-purple-500 bg-clip-text text-transparent">
              {stats.projects}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Projetos no portfólio
            </p>
            <Button variant="outline" size="sm" className="w-full group-hover:border-purple-300 transition-colors" asChild>
              <Link to="/admin/projects">
                Gerenciar
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="admin-card-premium admin-stat-card group border-l-4 border-l-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Redes Sociais</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <Share2 className="h-6 w-6 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-pink-600 to-pink-500 bg-clip-text text-transparent">
              {stats.socialLinks}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Links configurados
            </p>
            <Button variant="outline" size="sm" className="w-full group-hover:border-pink-300 transition-colors" asChild>
              <Link to="/admin/social-links">
                Gerenciar
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center shadow-md">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Ações Rápidas</span>
        </h2>
        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          <Card className="admin-card-premium group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Dados de Contato</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:scale-110 transition-all duration-300">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-5">
                Configure telefones, e-mails, endereço e WhatsApp
              </p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all" asChild>
                <Link to="/admin/contact-info">
                  Configurar
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="admin-card-premium group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Configurações</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-slate-500/10 flex items-center justify-center group-hover:bg-slate-500/20 group-hover:scale-110 transition-all duration-300">
                  <Settings className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-5">
                Ajustes gerais do site e da empresa
              </p>
              <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-md hover:shadow-lg transition-all" asChild>
                <Link to="/admin/settings">
                  Acessar
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="admin-card-premium group bg-gradient-to-br from-brand-gold/5 to-brand-gold/10 border-brand-gold/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Ver Site</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold/30 group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="h-6 w-6 text-brand-gold-dark" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-5">
                Visualize o site público em uma nova aba
              </p>
              <Button className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-brand-gold-dark hover:to-brand-gold shadow-md hover:shadow-lg transition-all" asChild>
                <Link to="/" target="_blank">
                  Abrir Site
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;