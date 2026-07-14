import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useContactInfo, useCreateContactInfo, useUpdateContactInfo, useDeleteContactInfo } from '@/hooks/useContactInfo';
import { Loader2, Plus, Edit, Trash2, Phone, Mail, MapPin, MessageCircle, Smartphone, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminContactInfo = () => {
  const { toast } = useToast();
  const { data: contactInfo, isLoading } = useContactInfo();
  const createContactInfo = useCreateContactInfo();
  const updateContactInfo = useUpdateContactInfo();
  const deleteContactInfo = useDeleteContactInfo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: '',
    label: '',
    value: '',
    is_active: true,
    order_position: 0,
  });

  const typeIcons = {
    phone: Phone,
    email: Mail,
    address: MapPin,
    whatsapp: MessageCircle,
    whatsapp_button: Smartphone,
    company_data: Building2,
  };

  const contactTypes = [
    { value: 'phone', label: 'Telefone' },
    { value: 'email', label: 'Email' },
    { value: 'address', label: 'Endereço' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'whatsapp_button', label: 'WhatsApp Botão Flutuante' },
    { value: 'company_data', label: 'Dados da Empresa' },
  ];

  const resetForm = () => {
    setFormData({
      type: '',
      label: '',
      value: '',
      is_active: true,
      order_position: contactInfo?.length || 0,
    });
    setEditingContact(null);
  };

  const openModal = (contact?: any) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        type: contact.type,
        label: contact.label,
        value: contact.value,
        is_active: contact.is_active,
        order_position: contact.order_position || 0,
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
    
    if (!formData.type || !formData.label || !formData.value) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingContact) {
        await updateContactInfo.mutateAsync({
          id: editingContact.id,
          ...formData,
          updated_by: null, // TODO: Use actual user ID
        });
        toast({
          title: "Sucesso",
          description: "Informação de contato atualizada com sucesso!",
        });
      } else {
        await createContactInfo.mutateAsync({
          ...formData,
          updated_by: null, // TODO: Use actual user ID
        });
        toast({
          title: "Sucesso",
          description: "Informação de contato criada com sucesso!",
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar informação de contato. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContactInfo.mutateAsync(id);
      toast({
        title: "Sucesso",
        description: "Informação de contato excluída com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting contact info:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir informação de contato. Tente novamente.",
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

  const activeWhatsApp = contactInfo?.find(
    contact => contact.type === 'whatsapp_button' && contact.is_active
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dados de Contato</h1>
          <p className="text-muted-foreground">
            Gerencie as informações de contato da empresa
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Contato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? 'Editar Informação de Contato' : 'Adicionar Informação de Contato'}
              </DialogTitle>
              <DialogDescription>
                Configure as informações de contato
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactTypes.map((type) => {
                      const Icon = typeIcons[type.value as keyof typeof typeIcons];
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <Icon className="mr-2 h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Rótulo</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Ex: Telefone Principal, Email Comercial..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">{formData.type === 'company_data' ? 'Valor' : 'Número'}</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={
                    formData.type === 'phone' || formData.type === 'whatsapp' 
                      ? "(11) 99999-9999" 
                      : formData.type === 'email'
                      ? "contato@empresa.com"
                      : formData.type === 'address'
                      ? "Rua exemplo, 123 - Cidade, Estado"
                      : formData.type === 'company_data'
                      ? "00.000.000/0001-00"
                      : "Digite o valor..."
                  }
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
                  disabled={createContactInfo.isPending || updateContactInfo.isPending}
                >
                  {(createContactInfo.isPending || updateContactInfo.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    editingContact ? 'Atualizar' : 'Criar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contactInfo?.map((contact) => {
          const IconComponent = typeIcons[contact.type as keyof typeof typeIcons];
          const typeLabel = contactTypes.find(t => t.value === contact.type)?.label || contact.type;
          const isWhatsAppButton = contact.type === 'whatsapp_button' && contact.is_active;
          
          return (
            <Card 
              key={contact.id}
              className={isWhatsAppButton ? 'border-green-200 dark:border-green-900 bg-green-50/30 dark:bg-green-950/10' : ''}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  {IconComponent && <IconComponent className={`h-5 w-5 ${isWhatsAppButton ? 'text-[#25D366]' : ''}`} />}
                  <CardTitle className="text-base">{contact.label}</CardTitle>
                  {isWhatsAppButton && (
                    <span className="text-xs bg-[#25D366] text-white px-2 py-0.5 rounded-full">
                      Botão Ativo
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(contact)}
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
                          Tem certeza que deseja excluir esta informação de contato? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(contact.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-muted-foreground mb-1">{typeLabel}</p>
                <p className="text-sm break-words">{contact.value}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    contact.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {contact.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-muted-foreground">Pos: {contact.order_position}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(!contactInfo || contactInfo.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma informação de contato encontrada</h3>
              <p className="text-muted-foreground mb-4">Adicione informações de contato da empresa</p>
              <Button onClick={() => openModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Informação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminContactInfo;