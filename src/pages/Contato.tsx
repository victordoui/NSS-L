import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Building2 } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import TurnstileWidget from "@/components/TurnstileWidget";
import { ContactInfo, useContactInfo } from "@/hooks/useContactInfo";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useContactSubmission } from "@/hooks/useContactSubmission";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import contatoHero from "@/assets/contato-hero.jpg";
import { useRef, useState } from "react";

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100, "Nome muito longo"),
  phone: z.string().trim().refine(
    (phone) => phone.replace(/\D/g, "").length >= 8,
    "Telefone inválido",
  ).refine(
    (phone) => phone.replace(/\D/g, "").length <= 15,
    "Telefone inválido",
  ),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  message: z.string().trim().min(10, "Descreva um pouco mais sua necessidade").max(2000, "Mensagem muito longa"),
});

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ||
  (import.meta.env.DEV ? "1x00000000000000000000AA" : "");
const turnstileEnabled = Boolean(turnstileSiteKey);

const Contato = () => {
  const { data: contactInfoData, isLoading: contactLoading } = useContactInfo();
  const { data: siteSettings } = useSiteSettings();
  const { submitMessage } = useContactSubmission();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    if (turnstileEnabled && !turnstileToken) return;

    submitMessage.mutate({
      ...values,
      turnstileToken: turnstileToken || "",
      website: honeypotRef.current?.value || "",
    }, {
      onSuccess: () => {
        form.reset();
        if (honeypotRef.current) honeypotRef.current.value = "";
      },
      onSettled: () => {
        setTurnstileToken(null);
        setTurnstileResetKey((value) => value + 1);
      },
    });
  };

  const googleMapsUrl = siteSettings?.find(s => s.key === 'google_maps_embed_url')?.value || '';
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'phone': case 'telefone': return <Phone className="w-8 h-8" />;
      case 'whatsapp': return <WhatsAppIcon className="w-8 h-8" />;
      case 'email': case 'e-mail': return <Mail className="w-8 h-8" />;
      case 'address': case 'endereco': case 'endereço': return <MapPin className="w-8 h-8" />;
      case 'schedule': case 'horario': case 'horário': return <Clock className="w-8 h-8" />;
      case 'company_data': case 'dados': return <Building2 className="w-8 h-8" />;
      default: return <Mail className="w-8 h-8" />;
    }
  };

  const orderPriority: Record<string, number> = {
    'telefone': 1,
    'phone': 1,
    'whatsapp': 2,
    'email': 3,
    'e-mail': 3,
    'endereco': 4,
    'endereço': 4,
    'address': 4
  };

  const sortContactInfo = (items: ContactInfo[]) => {
    return [...items].sort((a, b) => {
      const aType = a.type.toLowerCase();
      const bType = b.type.toLowerCase();
      const aPriority = orderPriority[aType] || 999;
      const bPriority = orderPriority[bType] || 999;
      return aPriority - bPriority;
    });
  };

  const contactInfo = contactLoading 
    ? []
    : (contactInfoData && contactInfoData.length > 0
        ? sortContactInfo(
            contactInfoData.filter(item => item.type !== 'whatsapp_button')
          ).map(item => ({
            icon: getIcon(item.type),
            title: item.label.replace(/\s*PRINCIPAL\s*/gi, '').trim(),
            info: item.value,
            description: ""
          }))
        : []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section 
          className="relative min-h-[600px] flex items-center bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${contatoHero})`,
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Content */}
          <div className="relative z-10 container max-w-6xl">
            <div className="max-w-4xl">
              <h1 
                className="font-heading text-[clamp(2.5rem,12vw,3.5625rem)] text-white leading-[1em]"
                style={{ 
                  fontWeight: 'normal',
                  letterSpacing: '0.05em' 
                }}
              >
                CONTATO
              </h1>
            </div>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-6xl">
            <div className="grid min-w-0 lg:grid-cols-2 gap-16">
              {/* Left: Contact Information */}
              <div className="min-w-0 space-y-8">
                {contactLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-4 animate-pulse" aria-hidden="true">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-28 bg-muted" />
                        <div className="h-4 w-48 bg-muted" />
                      </div>
                    </div>
                  ))
                ) : contactInfo.length > 0 ? contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 text-primary">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-foreground mb-2 text-lg tracking-wide">{item.title.toUpperCase()}</h4>
                      <p className="break-words font-medium text-muted-foreground text-base">{item.info}</p>
                      {item.description && (
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="max-w-md text-muted-foreground">
                    Preencha o formulário ao lado para falar com a equipe da NSS Engenharia.
                  </p>
                )}
              </div>

              {/* Right: Contact Form */}
              <div className="min-w-0">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    aria-busy={submitMessage.isPending}
                  >
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="contact-website">Website</label>
                      <input
                        ref={honeypotRef}
                        id="contact-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold text-foreground tracking-wide">
                            NOME
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Seu nome completo" 
                              className="h-12 text-base" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold text-foreground tracking-wide">
                            TELEFONE
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(11) 99999-9999" 
                              className="h-12 text-base" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold text-foreground tracking-wide">
                            E-MAIL
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="seu@email.com" 
                              className="h-12 text-base" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold text-foreground tracking-wide">
                            MENSAGEM
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva sua mensagem..."
                              rows={6}
                              className="text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {turnstileEnabled && (
                      <div className="space-y-2">
                        <TurnstileWidget
                          siteKey={turnstileSiteKey}
                          resetKey={turnstileResetKey}
                          onVerify={setTurnstileToken}
                        />
                        <p className="text-xs text-muted-foreground">
                          Esta verificação protege o formulário contra mensagens automáticas.
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 text-base font-bold"
                      disabled={submitMessage.isPending || (turnstileEnabled && !turnstileToken)}
                    >
                      {submitMessage.isPending ? "ENVIANDO..." : "ENVIAR"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-20">
          <div className="container max-w-6xl">
            <h3 className="text-2xl font-bold text-primary mb-8">
              Nossa Localização
            </h3>
            
            {/* Google Maps or Placeholder */}
            {googleMapsUrl ? (
              <div className="rounded-lg overflow-hidden border-2 border-primary/20 h-96">
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da empresa"
                ></iframe>
              </div>
            ) : (
              <div className="bg-muted rounded-lg h-96 flex items-center justify-center border-2">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto" />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contato;
