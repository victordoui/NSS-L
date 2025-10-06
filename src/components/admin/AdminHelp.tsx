import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle, CheckCircle2, Link as LinkIcon } from 'lucide-react';

const AdminHelp = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Central de Ajuda</h1>
        <p className="text-muted-foreground mt-2">
          Tutoriais e guias para configurar o painel administrativo
        </p>
      </div>

      {/* Tutorial do Google Maps */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle>Como Configurar o Google Maps</CardTitle>
          </div>
          <CardDescription>
            Aprenda a obter a URL correta do Google Maps para exibir o mapa na página de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Passo a passo */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Badge variant="outline" className="h-6 px-2 shrink-0">1</Badge>
              <div>
                <p className="font-medium">Acesse o Google Maps</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Abra o site <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">google.com/maps</a> no seu navegador
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge variant="outline" className="h-6 px-2 shrink-0">2</Badge>
              <div>
                <p className="font-medium">Busque o endereço</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Digite o endereço desejado na barra de pesquisa e pressione Enter
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge variant="outline" className="h-6 px-2 shrink-0">3</Badge>
              <div>
                <p className="font-medium">Clique em "Compartilhar"</p>
                <p className="text-sm text-muted-foreground mt-1">
                  No painel lateral esquerdo, clique no botão "Compartilhar"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge variant="outline" className="h-6 px-2 shrink-0">4</Badge>
              <div>
                <p className="font-medium">Selecione "Incorporar um mapa"</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Na janela que abrir, clique na aba "Incorporar um mapa"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge variant="outline" className="h-6 px-2 shrink-0">5</Badge>
              <div>
                <p className="font-medium">Copie o código HTML</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique em "COPIAR HTML" para copiar todo o código do iframe
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge variant="outline" className="h-6 px-2 shrink-0">6</Badge>
              <div>
                <p className="font-medium">Extraia a URL do atributo src</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Do código HTML copiado, você precisa apenas da URL que está dentro de <code className="bg-muted px-1 py-0.5 rounded">src="..."</code>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge variant="outline" className="h-6 px-2 shrink-0">7</Badge>
              <div>
                <p className="font-medium">Cole nas Configurações do Site</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vá em Configurações do Site e cole a URL no campo "Google Maps Embed URL"
                </p>
              </div>
            </div>
          </div>

          {/* Exemplo de URL correta */}
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <p className="font-medium text-green-800 dark:text-green-400 mb-2">Exemplo de URL correta:</p>
              <code className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-2 rounded block break-all">
                https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675...
              </code>
              <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                ✓ A URL deve começar com <strong>https://www.google.com/maps/embed</strong>
              </p>
            </AlertDescription>
          </Alert>

          {/* Aviso de erro comum */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">❌ Erro comum - URL incorreta:</p>
              <code className="text-xs bg-destructive/10 p-2 rounded block break-all">
                https://www.google.com/maps/place/Rua+Exemplo...
              </code>
              <p className="text-sm mt-2">
                Esta é a URL normal do navegador. <strong>NÃO funciona!</strong> Você deve usar a URL de <strong>embed</strong> (incorporar).
              </p>
            </AlertDescription>
          </Alert>

          {/* Dica adicional */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <LinkIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Dica útil</p>
                <p className="text-sm text-muted-foreground mt-1">
                  O código HTML completo que você copia do Google Maps é algo como:<br/>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded mt-2 inline-block">
                    &lt;iframe src="URL_AQUI" width="600" height="450"...&gt;&lt;/iframe&gt;
                  </code><br/>
                  Você só precisa da parte <strong>URL_AQUI</strong> (a URL que está entre aspas após src=)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHelp;
