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
    profile
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
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 h-16 shadow-sm">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-2" />
          <Link to="/admin" className="flex items-center space-x-3">
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              Painel Administrativo
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="w-7 h-7 rounded-full bg-gray-800 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {profile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {profile?.full_name || 'Admin'}
            </span>
          </div>
          
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