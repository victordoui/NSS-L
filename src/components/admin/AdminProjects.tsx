import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useProjects, useUpdateProject, useDeleteProject, useCreateProject } from '@/hooks/useProjects';
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, MapPin, Calendar, Ruler, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import ImagePositionEditor from './ImagePositionEditor';
import { Badge } from '@/components/ui/badge';

const AdminProjects = () => {
  const { toast } = useToast();
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    client: '',
    location: '',
    area: '',
    duration: '',
    category: '',
    status: 'completed',
    featured_image: '',
    image_position: '50% 50%',
    images: [] as string[],
    is_featured: false,
    order_position: 0,
    completed_at: '',
    oldImagePath: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      slug: '',
      client: '',
      location: '',
      area: '',
      duration: '',
      category: '',
      status: 'completed',
      featured_image: '',
      image_position: '50% 50%',
      images: [],
      is_featured: false,
      order_position: projects?.length || 0,
      completed_at: '',
      oldImagePath: '',
    });
    setEditingProject(null);
  };

  const openModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || '',
        slug: project.slug,
        client: project.client || '',
        location: project.location || '',
        area: project.area || '',
        duration: project.duration || '',
        category: project.category || '',
        status: project.status,
        featured_image: project.featured_image || '',
        image_position: project.image_position || '50% 50%',
        images: project.images || [],
        is_featured: project.is_featured || false,
        order_position: project.order_position || 0,
        completed_at: project.completed_at || '',
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
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const compressImage = (file: File, maxWidth = 1200, quality = 0.85): Promise<File> => {
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
      const compressedFile = await compressImage(file);
      
      const fileExt = 'jpg';
      const fileName = `project-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

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

      const oldImagePath = editingProject?.featured_image;

      setFormData(prev => ({ 
        ...prev, 
        featured_image: publicUrl,
        image_position: prev.image_position || '50% 50%',
        oldImagePath: oldImagePath
      }));
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no Upload",
        description: `Erro inesperado: ${error.message || 'Falha no upload da imagem'}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      const { oldImagePath, ...projectData } = formData;
      
      // Convert year to full timestamp if completed_at is just a year
      if (projectData.completed_at && projectData.completed_at.length === 4) {
        projectData.completed_at = `${projectData.completed_at}-12-31T23:59:59Z`;
      }
      
      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          ...projectData,
        });
        
        toast({
          title: "Sucesso",
          description: "Projeto atualizado com sucesso!",
        });
      } else {
        await createProject.mutateAsync(projectData);
        toast({
          title: "Sucesso",
          description: "Projeto criado com sucesso!",
        });
      }
      closeModal();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: "Erro ao Salvar",
        description: error.message || "Erro ao salvar projeto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso!",
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro ao Excluir",
        description: error.message || "Erro ao excluir projeto. Tente novamente.",
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
          <h1 className="text-3xl font-bold">Obras Executadas</h1>
          <p className="text-muted-foreground">
            Gerencie o portfólio de projetos e obras executadas
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {editingProject ? 'Editar Projeto' : 'Adicionar Projeto'}
              </DialogTitle>
              <DialogDescription>
                Configure as informações do projeto e veja o preview em tempo real
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
                        placeholder="Nome do projeto"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="url-do-projeto"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client">Cliente</Label>
                        <Input
                          id="client"
                          value={formData.client}
                          onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                          placeholder="Nome do cliente"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="Ex: Dragagem, Terraplenagem"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Localização</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Cidade - Estado"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area">Área/Volume</Label>
                        <Input
                          id="area"
                          value={formData.area}
                          onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                          placeholder="Ex: 150.000 m³"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duração</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="Ex: 8 meses"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="completed_at">Ano de Conclusão</Label>
                        <Input
                          id="completed_at"
                          value={formData.completed_at}
                          onChange={(e) => setFormData(prev => ({ ...prev, completed_at: e.target.value }))}
                          placeholder="2023"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição detalhada do projeto..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="image">Imagem do Projeto</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 bg-muted/20 hover:bg-muted/30 transition-colors">
                        {formData.featured_image ? (
                          <div className="space-y-3">
                            <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                              <img 
                                src={formData.featured_image} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() => document.getElementById('image')?.click()}
                              disabled={isUploading}
                            >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              {isUploading ? 'Enviando...' : 'Alterar Imagem'}
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('image')?.click()}
                              disabled={isUploading}
                            >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
                            </Button>
                            <p className="text-sm text-muted-foreground mt-2">
                              Clique para fazer upload da imagem principal
                            </p>
                          </div>
                        )}
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </div>
                    </div>

                  {/* Image Position Editor */}
                  {formData.featured_image && (
                    <ImagePositionEditor
                      imageUrl={formData.featured_image}
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
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                        />
                        <Label htmlFor="is_featured">Destacar</Label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Live Preview */}
                  <div className="space-y-4 lg:sticky lg:top-0">
                    <Label>Preview em Tempo Real</Label>
                    <div className="rounded-lg border-2 border-dashed p-4 bg-muted/20">
                      {formData.featured_image && formData.title ? (
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                          <div className="aspect-video relative overflow-hidden">
                            <img 
                              src={formData.featured_image} 
                              alt={formData.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              style={{ 
                                objectPosition: formData.image_position || 'center center'
                              }}
                            />
                            {formData.category && (
                              <Badge className="absolute top-4 left-4 bg-primary text-white">
                                {formData.category}
                              </Badge>
                            )}
                            <Badge 
                              className="absolute top-4 right-4"
                              variant={formData.status === "completed" ? "default" : "secondary"}
                            >
                              {formData.status === "completed" ? "Concluída" : "Em Andamento"}
                            </Badge>
                          </div>
                          
                          <CardHeader>
                            <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
                              {formData.title}
                            </CardTitle>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-sm line-clamp-3">
                              {formData.description}
                            </p>
                            
                            <div className="space-y-2 text-sm">
                              {formData.location && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin size={16} />
                                  <span>{formData.location}</span>
                                </div>
                              )}
                              
                              {(formData.completed_at || formData.duration) && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar size={16} />
                                  <span>{formData.completed_at} {formData.duration && `• ${formData.duration}`}</span>
                                </div>
                              )}
                              
                              {formData.area && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Ruler size={16} />
                                  <span>{formData.area}</span>
                                </div>
                              )}
                            </div>
                            
                            {formData.client && (
                              <div className="border-t pt-4">
                                <div className="text-xs text-muted-foreground">Cliente</div>
                                <div className="font-semibold text-primary">{formData.client}</div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
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
                      ⚡ Este é exatamente como o projeto aparecerá no site
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
                disabled={createProject.isPending || updateProject.isPending || isUploading}
              >
                {(createProject.isPending || updateProject.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  editingProject ? 'Atualizar' : 'Criar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!projects || projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto cadastrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece adicionando seu primeiro projeto ao portfólio.
            </p>
            <Button onClick={() => openModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden group">
              {/* Image Card with Same Visual as ServiceCard */}
              <div className="relative h-64 overflow-hidden">
                {project.featured_image ? (
                  <>
                    <img 
                      src={project.featured_image} 
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ 
                        objectPosition: project.image_position || 'center center'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-heading font-normal mb-2 leading-tight">
                        {project.title}
                      </h3>
                      {project.location && (
                        <p className="text-xs opacity-90">📍 {project.location}</p>
                      )}
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
                  <CardTitle className="text-base truncate flex-1">{project.title}</CardTitle>
                  <div className="flex space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPreviewProject(project);
                        setIsPreviewModalOpen(true);
                      }}
                      title="Visualizar Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(project)}
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
                            Tem certeza que deseja excluir o projeto "{project.title}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(project.id)}>
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
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {project.status === 'completed' ? 'Concluída' : 'Rascunho'}
                  </span>
                  <span className="text-xs text-muted-foreground">Pos: {project.order_position}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview do Projeto</DialogTitle>
          </DialogHeader>
          {previewProject && (
            <div className="space-y-6">
              {previewProject.featured_image && (
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img 
                    src={previewProject.featured_image} 
                    alt={previewProject.title}
                    className="w-full h-full object-cover"
                    style={{ 
                      objectPosition: previewProject.image_position || 'center center'
                    }}
                  />
                  {previewProject.category && (
                    <Badge className="absolute top-4 left-4 bg-primary text-white">
                      {previewProject.category}
                    </Badge>
                  )}
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold mb-4">{previewProject.title}</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{previewProject.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {previewProject.client && (
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{previewProject.client}</p>
                  </div>
                )}
                {previewProject.location && (
                  <div>
                    <p className="text-sm text-muted-foreground">Localização</p>
                    <p className="font-medium">{previewProject.location}</p>
                  </div>
                )}
                {previewProject.area && (
                  <div>
                    <p className="text-sm text-muted-foreground">Área/Volume</p>
                    <p className="font-medium">{previewProject.area}</p>
                  </div>
                )}
                {previewProject.duration && (
                  <div>
                    <p className="text-sm text-muted-foreground">Duração</p>
                    <p className="font-medium">{previewProject.duration}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
