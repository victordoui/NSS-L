import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useSocialLinks, useCreateSocialLink, useUpdateSocialLink, useDeleteSocialLink, type SocialLink } from '@/hooks/useSocialLinks';
import { Loader2, Plus, Edit, Trash2, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminSocialLinks = () => {
  const { toast } = useToast();
  const { data: socialLinks, isLoading } = useSocialLinks();
  const createSocialLink = useCreateSocialLink();
  const updateSocialLink = useUpdateSocialLink();
  const deleteSocialLink = useDeleteSocialLink();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    is_active: true,
    order_position: 0,
  });

  const platformIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
  ];

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      is_active: true,
      order_position: socialLinks?.length || 0,
    });
    setEditingLink(null);
  };

  const openModal = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        platform: link.platform,
        url: link.url,
        is_active: link.is_active,
        order_position: link.order_position || 0,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.platform || !formData.url) {
      toast({
        title: "Erro",
        description: "Plataforma e URL são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingLink) {
        await updateSocialLink.mutateAsync({
          id: editingLink.id,
          ...formData,
          updated_by: null, // TODO: Use actual user ID
        });
        toast({
          title: "Sucesso",
          description: "Link social atualizado com sucesso!",
        });
      } else {
        await createSocialLink.mutateAsync({
          ...formData,
          updated_by: null, // TODO: Use actual user ID
        });
        toast({
          title: "Sucesso",
          description: "Link social criado com sucesso!",
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error saving social link:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar link social. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSocialLink.mutateAsync(id);
      toast({
        title: "Sucesso",
        description: "Link social excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir link social. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const IconComponent = formData.platform ? platformIcons[formData.platform as keyof typeof platformIcons] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Redes Sociais</h1>
          <p className="text-muted-foreground">
            Gerencie os links das redes sociais da empresa
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLink ? 'Editar Link Social' : 'Adicionar Link Social'}
              </DialogTitle>
              <DialogDescription>
                Configure as informações do link social
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => {
                      const Icon = platformIcons[platform.value as keyof typeof platformIcons];
                      return (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex items-center">
                            <Icon className="mr-2 h-4 w-4" />
                            {platform.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_position">Posição</Label>
                <Input
                  id="order_position"
                  type="number"
                  value={formData.order_position}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_position: Number(e.target.value) }))}
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={createSocialLink.isPending || updateSocialLink.isPending}
                >
                  {(createSocialLink.isPending || updateSocialLink.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    editingLink ? 'Atualizar' : 'Criar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {socialLinks?.map((link) => {
          const IconComponent = platformIcons[link.platform as keyof typeof platformIcons];
          return (
            <Card key={link.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                  <CardTitle className="text-base capitalize">{link.platform}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(link)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este link social? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(link.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    link.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {link.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-muted-foreground">Pos: {link.order_position}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(!socialLinks || socialLinks.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum link social encontrado</h3>
              <p className="text-muted-foreground mb-4">Adicione links para as redes sociais da empresa</p>
              <Button onClick={() => openModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSocialLinks;
