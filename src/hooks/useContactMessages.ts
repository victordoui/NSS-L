import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageInsert {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export const useContactMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  const createMessage = useMutation({
    mutationFn: async (newMessage: ContactMessageInsert) => {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast({
        title: "Mensagem enviada!",
        description: "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error creating message:", error);
    },
  });

  const updateMessage = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { data, error } = await supabase
        .from("contact_messages")
        .update({ is_read })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar mensagem",
        description: "Ocorreu um erro ao atualizar a mensagem.",
        variant: "destructive",
      });
      console.error("Error updating message:", error);
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast({
        title: "Mensagem excluída",
        description: "A mensagem foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir mensagem",
        description: "Ocorreu um erro ao excluir a mensagem.",
        variant: "destructive",
      });
      console.error("Error deleting message:", error);
    },
  });

  const unreadCount = messages?.filter((msg) => !msg.is_read).length || 0;

  return {
    messages,
    isLoading,
    unreadCount,
    createMessage,
    updateMessage,
    deleteMessage,
  };
};
