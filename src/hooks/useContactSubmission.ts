import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ContactSubmissionInput {
  name: string;
  phone: string;
  email: string;
  message: string;
  turnstileToken: string;
  website: string;
}

type ContactSubmissionCode =
  | "INVALID_INPUT"
  | "BOT_REJECTED"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE";

type ContactSubmissionResponse = {
  ok: boolean;
  code?: ContactSubmissionCode;
};

class ContactSubmissionError extends Error {
  constructor(public readonly code: ContactSubmissionCode = "SERVICE_UNAVAILABLE") {
    super(code);
  }
}

const getResponseCode = async (error: unknown): Promise<ContactSubmissionCode> => {
  const context = typeof error === "object" && error && "context" in error
    ? (error as { context?: unknown }).context
    : undefined;

  if (context instanceof Response) {
    const body = await context.clone().json().catch(() => null) as ContactSubmissionResponse | null;
    if (body?.code) return body.code;
  }

  return "SERVICE_UNAVAILABLE";
};

const errorMessages: Record<ContactSubmissionCode, string> = {
  INVALID_INPUT: "Revise os dados informados e tente novamente.",
  BOT_REJECTED: "Não foi possível confirmar a verificação de segurança. Tente novamente.",
  RATE_LIMITED: "Muitas tentativas foram feitas. Aguarde alguns minutos antes de tentar novamente.",
  SERVICE_UNAVAILABLE: "O serviço está temporariamente indisponível. Tente novamente mais tarde.",
};

export const useContactSubmission = () => {
  const submitMessage = useMutation({
    mutationFn: async (input: ContactSubmissionInput) => {
      const { data, error } = await supabase.functions.invoke<ContactSubmissionResponse>(
        "submit-contact-message",
        { body: input },
      );

      if (error) throw new ContactSubmissionError(await getResponseCode(error));
      if (!data?.ok) throw new ContactSubmissionError(data?.code);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: "Recebemos sua mensagem e entraremos em contato em breve.",
      });
    },
    onError: (error) => {
      const code = error instanceof ContactSubmissionError ? error.code : "SERVICE_UNAVAILABLE";
      toast({
        title: "Não foi possível enviar",
        description: errorMessages[code],
        variant: "destructive",
      });
    },
  });

  return { submitMessage };
};
