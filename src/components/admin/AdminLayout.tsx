import { ReactNode } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumbs } from './Breadcrumbs';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="admin-panel min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          
          <main className="flex-1 p-6 overflow-x-hidden bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Breadcrumbs />
                <SidebarTrigger className="lg:hidden" />
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;