import { ReactNode } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from 'next-themes';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider defaultOpen={true}>
        <div className="admin-panel min-h-screen flex w-full">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            
            <main className="flex-1 p-6 overflow-x-hidden bg-gray-50 dark:bg-gray-950">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;