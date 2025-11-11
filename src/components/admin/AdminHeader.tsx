import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Home, Loader2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SidebarTrigger } from '@/components/ui/sidebar';

const AdminHeader = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    signOut,
    profile,
    user
  } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      setIsLoggingOut(false);
    }
  };
  return (
    <header className="bg-gray-50 dark:bg-gray-950 sticky top-0 z-50 h-16 shadow-sm">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-2" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">
                {user?.email?.charAt(0).toUpperCase() || profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Bem-vindo! @{user?.email?.split('@')[0] || 'usuário'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {profile?.role === 'admin' ? 'Administrador do Sistema' : 'Usuário'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <Link to="/">
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Site</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;