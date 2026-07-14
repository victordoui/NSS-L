import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Seo from '@/components/Seo';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) {
          toast({
            title: "Nome obrigatório",
            description: "Por favor, informe seu nome completo.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDevMode = async () => {
    setIsLogin(true);
    setEmail('dev@test.com');
    setPassword('123456');
    setLoading(true);
    
    try {
      await signIn('dev@test.com', '123456');
      toast({
        title: "Modo Desenvolvedor",
        description: "Logado como desenvolvedor com sucesso!",
      });
    } catch (error) {
      console.error('Dev login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Login' : 'Cadastrar'}
          </CardTitle>
          <p className="text-muted-foreground text-center">
            {isLogin 
              ? 'Acesse o painel administrativo' 
              : 'Crie sua conta de administrador'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
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
                required
                minLength={6}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading 
                ? (isLogin ? 'Entrando...' : 'Cadastrando...') 
                : (isLogin ? 'Entrar' : 'Cadastrar')
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center space-y-3">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm"
            >
              {isLogin 
                ? 'Não tem conta? Cadastre-se' 
                : 'Já tem conta? Faça login'
              }
            </button>
            
            {/* Botão Modo Desenvolvedor */}
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDevMode}
                disabled={loading}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                🚀 Modo Desenvolvedor
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
