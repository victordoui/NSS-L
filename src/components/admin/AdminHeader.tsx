import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Home, Loader2 } from 'lucide-react';

const AdminHeader = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16 shadow-sm">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-3">
          <Link to="/admin" className="flex items-center space-x-3">
            <span className="font-bold text-lg text-gray-900">
              Painel Administrativo
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
            <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {profile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {profile?.full_name || 'Admin'}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100">
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
            className="hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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