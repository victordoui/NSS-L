import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContactInfo {
  id: string;
  type: string;
  label: string;
  value: string;
  is_active: boolean;
  order_position: number | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useContactInfo = () => {
  return useQuery({
    queryKey: ["contact-info"],
    queryFn: async (): Promise<ContactInfo[]> => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .order("order_position", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateContactInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactInfo: Omit<ContactInfo, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("contact_info")
        .insert([contactInfo])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
    },
  });
};

export const useUpdateContactInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContactInfo> & { id: string }) => {
      const { data, error } = await supabase
        .from("contact_info")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
    },
  });
};

export const useDeleteContactInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_info")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
    },
  });
};