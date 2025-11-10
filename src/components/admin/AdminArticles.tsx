import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle } from '@/hooks/useArticles';
import { Loader2, Plus, FileText, Newspaper, TrendingUp, Upload, Edit, Trash2, Eye, BookOpen, FilePlus, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import imageCompression from 'browser-image-compression';
import ImagePositionEditor from './ImagePositionEditor';

const AdminArticles = () => {
  const { toast } = useToast();
  const { data: articles, isLoading } = useArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<any>(null);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    slug: '',
    status: 'draft',
    category: 'Dicas',
    reading_time: 5,
    published_at: '',
    image_position: '50% 50%'
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featured_image: '',
      slug: '',
      status: 'draft',
      category: 'Dicas',
      reading_time: 5,
      published_at: '',
      image_position: '50% 50%'
    });
    setEditingArticle(null);
  };

  const openModal = (article?: any) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        content: article.content || '',
        excerpt: article.excerpt || '',
        featured_image: article.featured_image || '',
        slug: article.slug,
        status: article.status,
        category: article.category || 'Dicas',
        reading_time: article.reading_time || 5,
        published_at: article.published_at || '',
        image_position: article.image_position || '50% 50%'
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

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg' as const
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const compressedFile = await compressImage(file);
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, featured_image: publicUrl }));
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar imagem: " + error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const articleData = {
        ...formData,
        author_id: null, // TODO: Use actual user ID
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      };

      if (editingArticle) {
        await updateArticle.mutateAsync({
          id: editingArticle.id,
          ...articleData,
        });
        toast({
          title: "Sucesso",
          description: "Artigo atualizado com sucesso!",
        });
      } else {
        await createArticle.mutateAsync(articleData);
        toast({
          title: "Sucesso",
          description: "Artigo criado com sucesso!",
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar artigo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast({
        title: "Sucesso",
        description: "Artigo excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir artigo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const openPreview = (article: any) => {
    setPreviewArticle(article);
    setIsPreviewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const publishedCount = articles?.filter(a => a.status === 'published').length || 0;
  const draftCount = articles?.filter(a => a.status === 'draft').length || 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary" />
            Informativo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie artigos e conteúdo do blog
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {editingArticle ? 'Editar Artigo' : 'Novo Artigo'}
              </DialogTitle>
              <DialogDescription>
                Configure as informações do artigo e veja o preview em tempo real
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
                        placeholder="Título do artigo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="url-do-artigo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Resumo</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Breve resumo do artigo"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Conteúdo</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Conteúdo completo do artigo..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-upload">Imagem de Destaque</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={uploadingImage}
                          className="flex-1"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {uploadingImage ? "Enviando..." : "Escolher Imagem"}
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      {formData.featured_image && (
                        <div className="space-y-2">
                          <img 
                            src={formData.featured_image} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <ImagePositionEditor
                            imageUrl={formData.featured_image}
                            position={formData.image_position}
                            onPositionChange={(position) => setFormData(prev => ({ ...prev, image_position: position }))}
                          />
                        </div>
                      )}
                    </div>

                    {/* Category Toggle Switch */}
                    <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                      <Label className="text-base">Categoria do Artigo</Label>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-medium transition-colors ${
                            formData.category === 'Dicas' ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            Dicas
                          </span>
                          <Switch
                            id="category"
                            checked={formData.category === 'Publicações'}
                            onCheckedChange={(checked) => setFormData(prev => ({ 
                              ...prev, 
                              category: checked ? 'Publicações' : 'Dicas' 
                            }))}
                          />
                          <span className={`text-sm font-medium transition-colors ${
                            formData.category === 'Publicações' ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            Publicações
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.category === 'Dicas' 
                          ? 'Dicas práticas e conselhos para o dia a dia' 
                          : 'Artigos técnicos e publicações oficiais'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reading_time">Tempo de Leitura (min)</Label>
                        <Input
                          id="reading_time"
                          type="number"
                          value={formData.reading_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, reading_time: Number(e.target.value) }))}
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch
                            id="status"
                            checked={formData.status === 'published'}
                            onCheckedChange={(checked) => setFormData(prev => ({ 
                              ...prev, 
                              status: checked ? 'published' : 'draft' 
                            }))}
                          />
                          <Label htmlFor="status" className="font-normal">
                            {formData.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Live Preview */}
                  <div className="space-y-4 lg:sticky lg:top-0">
                    <Label>Preview em Tempo Real</Label>
                    <div className="rounded-lg border-2 border-dashed p-6 bg-muted/20 min-h-[500px]">
                      {formData.title ? (
                        <div className="space-y-4">
                          {formData.featured_image && (
                            <div className="relative w-full h-56 rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={formData.featured_image} 
                                alt={formData.title}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: formData.image_position }}
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Imagem+Inválida';
                                }}
                              />
                            </div>
                          )}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-sm font-medium">
                                {formData.category}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formData.reading_time} min de leitura
                              </span>
                            </div>
                            <h3 className="text-xl font-bold line-clamp-2 leading-tight">
                              {formData.title}
                            </h3>
                            {formData.excerpt && (
                              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {formData.excerpt}
                              </p>
                            )}
                            {formData.content && (
                              <div className="pt-3 border-t">
                                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                                  {formData.content}
                                </p>
                              </div>
                            )}
                            <div className="pt-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                formData.status === 'published' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {formData.status === 'published' ? 'Publicado' : 'Rascunho'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Preview aparecerá aqui</p>
                            <p className="text-xs">Adicione o título para começar</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      ⚡ Este é exatamente como o artigo aparecerá no site
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
                disabled={createArticle.isPending || updateArticle.isPending}
              >
                {(createArticle.isPending || updateArticle.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  editingArticle ? 'Atualizar' : 'Criar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Section */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  Total de Artigos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {articles?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                  Publicados
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {publishedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                  Rascunhos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {draftCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      {!articles || articles.length === 0 ? (
        <Card className="text-center py-12 border-2 border-dashed">
          <CardContent>
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Comece criando seu primeiro artigo para o informativo
            </p>
            <Button onClick={() => openModal()} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Artigo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative h-64 bg-muted overflow-hidden">
                {article.featured_image ? (
                  <>
                    <img 
                      src={article.featured_image} 
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ 
                        objectPosition: article.image_position || '50% 50%'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-heading font-normal mb-2 leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs opacity-90 line-clamp-2">
                        {article.excerpt || 'Sem descrição'}
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
                  <CardTitle className="text-base truncate flex-1">{article.title}</CardTitle>
                  <div className="flex space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPreview(article)}
                      title="Visualizar Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(article)}
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
                            Tem certeza que deseja excluir o artigo "{article.title}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(article.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
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
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString('pt-BR')}
                  </span>
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
            <DialogTitle>Preview do Artigo</DialogTitle>
            <DialogDescription>
              Visualize como o artigo aparecerá no site
            </DialogDescription>
          </DialogHeader>
          
          {previewArticle && (
            <div className="space-y-6">
              {previewArticle.featured_image && (
                <div className="relative w-full h-80 rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={previewArticle.featured_image} 
                    alt={previewArticle.title}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: previewArticle.image_position || '50% 50%' }}
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-sm">
                    {previewArticle.category || 'Dicas'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {previewArticle.reading_time || 5} min de leitura
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold leading-tight">
                  {previewArticle.title}
                </h1>
                
                {previewArticle.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {previewArticle.excerpt}
                  </p>
                )}
                
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{previewArticle.content}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArticles;