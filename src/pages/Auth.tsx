import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import Seo from '@/components/Seo';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background flex items-center justify-center p-4">
      <Seo title="Acesso administrativo" description="Área restrita da NSS Engenharia." noIndex />
      <div className="w-full max-w-md space-y-8">
        {/* Logo NSS Engenharia */}
        <div className="flex justify-center">
          <img
            src="/assets/images/nss-engenharia-logo.png"
            alt="NSS Engenharia"
            className="w-20 h-20 md:w-24 md:h-24 object-contain transition-transform hover:scale-105 duration-300"
          />
        </div>
        
        <Card className="w-full">
        <CardHeader className="space-y-1">
          <h1 className="text-2xl font-bold text-center">
            Acesso administrativo
          </h1>
          <p className="text-muted-foreground text-center">
            Entre com uma conta autorizada para gerenciar o site
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                autoComplete="current-password"
                required
                minLength={6}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            O cadastro de novas contas é restrito ao responsável pelo sistema.
          </p>
        </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Auth;
