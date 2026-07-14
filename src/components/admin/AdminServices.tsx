import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useServices, useUpdateService, useDeleteService, useCreateService, type Service } from '@/hooks/useServices';
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import ImagePositionEditor from './ImagePositionEditor';
import ServiceCard from '@/components/ServiceCard';
import { getErrorMessage } from '@/lib/errors';

const AdminServices = () => {
  const { toast } = useToast();
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    image_url: '',
    image_path: '',
    image_position: '50% 50%',
    slug: '',
    is_active: true,
    order_position: 0,
    oldImagePath: '', // Add this field for image cleanup
  });


  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      image_url: '',
      image_path: '',
      image_position: '50% 50%',
      slug: '',
      is_active: true,
      order_position: services?.length || 0,
      oldImagePath: '',
    });
    setEditingService(null);
  };

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        short_description: service.short_description || '',
        image_url: service.image_url || '',
        image_path: service.image_path || '',
        image_position: service.image_position || '50% 50%',
        slug: service.slug || '',
        is_active: service.is_active,
        order_position: service.order_position || 0,
        oldImagePath: '',
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      const fileExt = 'jpg'; // Always use jpg for compressed images
      const fileName = `service-${Date.now()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      // Upload new image first
      const { data, error } = await supabase.storage
        .from('service-images')
        .upload(filePath, compressedFile);

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Erro no Upload",
          description: `Erro Supabase: ${error.message || 'Falha no upload da imagem'}`,
          variant: "destructive",
        });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      // Store the old image path for cleanup after successful service update
      const oldImagePath = editingService?.image_path;

      setFormData(prev => ({ 
        ...prev, 
        image_url: publicUrl,
        image_path: filePath,
        oldImagePath: oldImagePath // Store for cleanup
      }));
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no Upload",
        description: `Erro inesperado: ${getErrorMessage(error, 'Falha no upload da imagem')}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract oldImagePath and remove it from form data
      const { oldImagePath, ...serviceData } = formData;
      
      if (editingService) {
        await updateService.mutateAsync({
          id: editingService.id,
          ...serviceData,
        });
        
        // Only delete old image after successful update
        if (oldImagePath && oldImagePath !== serviceData.image_path) {
          try {
            await supabase.storage
              .from('service-images')
              .remove([oldImagePath]);
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
            // Don't fail the entire operation if old image deletion fails
          }
        }
        
        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso!",
        });
      } else {
        await createService.mutateAsync(serviceData);
        toast({
          title: "Sucesso",
          description: "Serviço criado com sucesso!",
        });
      }
      closeModal();
    } catch (error: unknown) {
      console.error('Error saving service:', error);
      toast({
        title: "Erro ao Salvar",
        description: getErrorMessage(error, "Erro ao salvar serviço. Tente novamente."),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Find the service to get the image path for deletion
      const serviceToDelete = services?.find(s => s.id === id);
      
      // Delete the service first
      await deleteService.mutateAsync(id);
      
      // Delete the image from storage if it exists (after successful service deletion)
      if (serviceToDelete?.image_path) {
        try {
          await supabase.storage
            .from('service-images')
            .remove([serviceToDelete.image_path]);
        } catch (deleteError) {
          console.warn('Failed to delete service image:', deleteError);
          // Don't fail the entire operation if image deletion fails
        }
      }
      
      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso!",
      });
    } catch (error: unknown) {
      console.error('Error deleting service:', error);
      toast({
        title: "Erro ao Excluir",
        description: getErrorMessage(error, "Erro ao excluir serviço. Tente novamente."),
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pela empresa
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {editingService ? 'Editar Serviço' : 'Adicionar Serviço'}
              </DialogTitle>
              <DialogDescription>
                Configure as informações do serviço e veja o preview em tempo real
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-1">
              <form onSubmit={handleSubmit} className="pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Nome do serviço"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="url-do-servico"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="short_description">Descrição Curta</Label>
                      <Input
                        id="short_description"
                        value={formData.short_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                        placeholder="Breve descrição para listagens"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição Completa</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição detalhada do serviço..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Imagem do Serviço</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        disabled={isUploading}
                      />
                      {isUploading && <p className="text-sm text-muted-foreground">Enviando imagem...</p>}
                    </div>

                    {/* Image Position Editor */}
                    {formData.image_url && (
                      <ImagePositionEditor
                        imageUrl={formData.image_url}
                        position={formData.image_position || "50% 50%"}
                        onPositionChange={(position) => setFormData({ ...formData, image_position: position })}
                      />
                    )}

                    <div className="grid grid-cols-2 gap-4">
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

                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                        />
                        <Label htmlFor="is_active">Ativo</Label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Live Preview */}
                  <div className="space-y-4 lg:sticky lg:top-0">
                    <Label>Preview em Tempo Real</Label>
                    <div className="rounded-lg border-2 border-dashed p-4 bg-muted/20">
                      {formData.image_url && formData.title ? (
                        <ServiceCard
                          service={{
                            id: 'preview',
                            title: formData.title,
                            description: formData.description,
                            short_description: formData.short_description,
                            image_url: formData.image_url,
                            image_position: formData.image_position,
                            slug: formData.slug,
                            is_active: formData.is_active,
                            order_position: formData.order_position,
                            image_path: formData.image_path,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                          }}
                          showMoreButton={true}
                        />
                      ) : (
                        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Preview aparecerá aqui</p>
                            <p className="text-xs">Adicione título e imagem</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      ⚡ Este é exatamente como o serviço aparecerá no site
                    </p>
                  </div>
                </div>
              </form>
            </div>

            <DialogFooter className="flex-shrink-0 border-t pt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button 
                type="submit"
                onClick={handleSubmit}
                disabled={createService.isPending || updateService.isPending || isUploading}
              >
                {(createService.isPending || updateService.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  editingService ? 'Atualizar' : 'Criar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => (
          <Card key={service.id} className="overflow-hidden group">
            {/* Image Card with Same Visual as ServiceCard */}
            <div className="relative h-64 overflow-hidden">
              {service.image_url ? (
                <>
                  <img 
                    src={service.image_url} 
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      objectPosition: service.image_position || 'center center'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-heading font-normal mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs opacity-90 line-clamp-2">
                      {service.short_description || service.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base truncate flex-1">{service.title}</CardTitle>
                <div className="flex space-x-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPreviewService(service);
                      setIsPreviewModalOpen(true);
                    }}
                    title="Visualizar Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(service)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o serviço "{service.title}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(service.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  service.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {service.is_active ? 'Ativo' : 'Inativo'}
                </span>
                <span className="text-xs text-muted-foreground">Pos: {service.order_position}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!services || services.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
              <p className="text-muted-foreground mb-4">Adicione serviços oferecidos pela empresa</p>
              <Button onClick={() => openModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Serviço
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview do Serviço</DialogTitle>
            <DialogDescription>
              Visualização de como o serviço aparece no site
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {previewService && (
              <ServiceCard
                service={previewService}
                showMoreButton={true}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
