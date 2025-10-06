import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings, useCreateSiteSetting, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { Loader2, Save, MapPin, ExternalLink } from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useSiteSettings();
  const createSetting = useCreateSiteSetting();
  const updateSetting = useUpdateSiteSetting();

  const [formData, setFormData] = useState({
    company_name: '',
    company_description: '',
    company_mission: '',
    company_vision: '',
    company_values: '',
    google_maps_embed_url: '',
    location_address: '',
  });

  // Initialize form data when settings load
  useState(() => {
    if (settings) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {} as Record<string, string>);
      
      setFormData(prev => ({
        ...prev,
        ...settingsMap,
      }));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const promises = Object.entries(formData).map(async ([key, value]) => {
        const existingSetting = settings?.find(s => s.key === key);
        
        if (existingSetting) {
          return updateSetting.mutateAsync({
            id: existingSetting.id,
            value,
          });
        } else {
          return createSetting.mutateAsync({
            key,
            value,
            description: getDescriptionForKey(key),
            updated_by: null,
          });
        }
      });

      await Promise.all(promises);
      
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getDescriptionForKey = (key: string) => {
    const descriptions: Record<string, string> = {
      company_name: 'Nome da empresa',
      company_description: 'Descrição da empresa',
      company_mission: 'Missão da empresa',
      company_vision: 'Visão da empresa',
      company_values: 'Valores da empresa',
      google_maps_embed_url: 'URL de incorporação do Google Maps',
      location_address: 'Endereço da empresa',
    };
    return descriptions[key] || '';
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações Gerais</h1>
        <p className="text-muted-foreground">
          Gerencie as informações básicas da empresa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
            <CardDescription>
              Configure as informações básicas que aparecem no site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="FG Laport Engenharia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_description">Descrição</Label>
              <Textarea
                id="company_description"
                value={formData.company_description}
                onChange={(e) => handleInputChange('company_description', e.target.value)}
                placeholder="Breve descrição da empresa..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_mission">Missão</Label>
              <Textarea
                id="company_mission"
                value={formData.company_mission}
                onChange={(e) => handleInputChange('company_mission', e.target.value)}
                placeholder="Nossa missão é..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_vision">Visão</Label>
              <Textarea
                id="company_vision"
                value={formData.company_vision}
                onChange={(e) => handleInputChange('company_vision', e.target.value)}
                placeholder="Nossa visão é..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_values">Valores</Label>
              <Textarea
                id="company_values"
                value={formData.company_values}
                onChange={(e) => handleInputChange('company_values', e.target.value)}
                placeholder="Nossos valores são..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Localização e Google Maps
            </CardTitle>
            <CardDescription>
              Configure o endereço e a integração com Google Maps para a página de contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location_address">Endereço da Empresa</Label>
              <Input
                id="location_address"
                value={formData.location_address}
                onChange={(e) => handleInputChange('location_address', e.target.value)}
                placeholder="São Paulo - SP"
              />
              <p className="text-sm text-muted-foreground">
                Este endereço será exibido na página de contato
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_maps_embed_url">URL de Incorporação do Google Maps</Label>
              <Textarea
                id="google_maps_embed_url"
                value={formData.google_maps_embed_url}
                onChange={(e) => handleInputChange('google_maps_embed_url', e.target.value)}
                placeholder="Cole aqui a URL de incorporação do Google Maps..."
                rows={4}
              />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Para obter a URL de incorporação:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Acesse <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Google Maps <ExternalLink className="h-3 w-3" /></a></li>
                  <li>Procure o endereço da empresa</li>
                  <li>Clique em "Compartilhar"</li>
                  <li>Selecione "Incorporar um mapa"</li>
                  <li>Copie o código HTML e cole aqui apenas a URL que está dentro do atributo src</li>
                </ol>
                <p className="mt-2 font-medium">Exemplo: https://www.google.com/maps/embed?pb=...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={createSetting.isPending || updateSetting.isPending}
          >
            {(createSetting.isPending || updateSetting.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;