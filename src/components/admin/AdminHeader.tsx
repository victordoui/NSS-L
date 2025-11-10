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
  return <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 h-14 shadow-sm">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-3">
          <Link to="/admin" className="flex items-center space-x-3 group">
            <span className="font-bold text-lg text-gray-900 group-hover:text-brand-gold transition-colors font-heading">
              Painel Administrativo
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center shadow-sm">
              <span className="text-xs font-semibold text-white font-heading">
                {profile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 font-body">
              {profile?.full_name || 'Admin'}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100 transition-colors">
            <Link to="/">
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline font-body">Site</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline font-body">
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </span>
          </Button>
        </div>
      </div>
    </header>;
};
export default AdminHeader;