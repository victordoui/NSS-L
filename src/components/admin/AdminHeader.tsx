import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Home } from 'lucide-react';
const AdminHeader = () => {
  const {
    signOut,
    profile
  } = useAuth();
  return <header className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center space-x-3">
          <Link to="/admin" className="flex items-center space-x-3 group">
            <span className="font-bold text-lg text-foreground group-hover:text-brand-gold transition-colors">
              Painel Administrativo
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {profile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {profile?.full_name || 'Admin'}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" asChild className="hover:bg-muted/80">
            <Link to="/">
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Site</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={signOut} className="hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>;
};
export default AdminHeader;