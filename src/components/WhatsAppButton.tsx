import { MessageCircle } from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";

const WhatsAppButton = () => {
  const { data: contactInfo } = useContactInfo();
  
  const whatsappContact = contactInfo?.find(
    contact => contact.type === 'whatsapp_button' && contact.is_active
  ) || contactInfo?.find(
    contact => contact.type === 'whatsapp' && contact.is_active
  );
  
  if (!whatsappContact) {
    return null; // Don't show button if no WhatsApp number is configured
  }
  
  const sanitizePhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Add country code if missing (assuming Brazil +55)
    if (cleanPhone.length === 11 && cleanPhone.startsWith('11')) {
      return `55${cleanPhone}`;
    } else if (cleanPhone.length === 10) {
      return `5511${cleanPhone}`;
    } else if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
      return cleanPhone;
    }
    
    return cleanPhone;
  };
  
  const whatsappNumber = sanitizePhoneNumber(whatsappContact.value);
  const message = "Olá! Gostaria de saber mais sobre os serviços da NSS ENGENHARIA.";
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-2 ring-white/90 transition-all duration-300 hover:scale-105 hover:bg-[#20b358] hover:shadow-xl sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      aria-label="Entrar em contato via WhatsApp"
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
    </button>
  );
};

export default WhatsAppButton;
