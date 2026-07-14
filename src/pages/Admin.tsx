import { useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminSocialLinks from '@/components/admin/AdminSocialLinks';
import AdminServices from '@/components/admin/AdminServices';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminContactInfo from '@/components/admin/AdminContactInfo';
import AdminHelp from '@/components/admin/AdminHelp';
import { AdminMessages } from '@/components/admin/AdminMessages';
import AdminBackup from '@/components/admin/AdminBackup';
import Seo from '@/components/Seo';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Seo title="Painel administrativo" description="Área restrita da NSS Engenharia." noIndex />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Seo title="Acesso negado" description="Área restrita da NSS Engenharia." noIndex />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-8">
            Você precisa de permissões de administrador para acessar esta área.
          </p>
          <a 
            href="/" 
            className="text-primary hover:underline"
          >
            Voltar para o site
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title="Painel administrativo" description="Área restrita da NSS Engenharia." noIndex />
      <AdminLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="help" element={<AdminHelp />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="social-links" element={<AdminSocialLinks />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="contact-info" element={<AdminContactInfo />} />
          <Route path="backup" element={<AdminBackup />} />
        </Routes>
      </AdminLayout>
    </>
  );
};

export default Admin;
