import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SocialLinks from "@/components/SocialLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, Building2 } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useContactMessages, ContactMessageInsert } from "@/hooks/useContactMessages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import contatoHero from "@/assets/contato-hero.jpg";

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  phone: z.string().trim().min(1, "Telefone é obrigatório").max(20, "Telefone inválido"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  message: z.string().trim().min(1, "Mensagem é obrigatória").max(1000, "Mensagem muito longa"),
});

const Contato = () => {
  const { data: contactInfoData, isLoading: contactLoading } = useContactInfo();
  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const { data: siteSettings } = useSiteSettings();
  const { createMessage } = useContactMessages();

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    createMessage.mutate(values as ContactMessageInsert, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const googleMapsUrl = siteSettings?.find(s => s.key === 'google_maps_embed_url')?.value || '';
  const locationAddress = siteSettings?.find(s => s.key === 'location_address')?.value || 'São Paulo - SP';

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

  // Fallback contact info if no data from database
  const fallbackContactInfo = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "TELEFONE",
      info: "(11) 4002-8922",
      description: ""
    },
    {
      icon: <WhatsAppIcon className="w-8 h-8" />,
      title: "WHATSAPP",
      info: "(21) 99568-4915",
      description: ""
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "E-MAIL",
      info: "contato@reservaengenharia.com",
      description: ""
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "ENDEREÇO",
      info: "São Paulo - SP",
      description: ""
    }
  ];

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

  const sortContactInfo = (items: any[]) => {
    return [...items].sort((a, b) => {
      const aType = a.type?.toLowerCase() || a.title?.toLowerCase() || '';
      const bType = b.type?.toLowerCase() || b.title?.toLowerCase() || '';
      const aPriority = orderPriority[aType] || 999;
      const bPriority = orderPriority[bType] || 999;
      return aPriority - bPriority;
    });
  };

  const contactInfo = contactLoading 
    ? fallbackContactInfo 
    : (contactInfoData && contactInfoData.length > 0
        ? sortContactInfo(
            contactInfoData.filter(item => item.type !== 'whatsapp_button')
          ).map(item => ({
            icon: getIcon(item.type),
            title: item.label.replace(/\s*PRINCIPAL\s*/gi, '').trim(),
            info: item.value,
            description: ""
          }))
        : fallbackContactInfo);

  const services = servicesData?.map(service => service.title) || [
    "Dragagem e Desassoreamento",
    "Terraplenagem", 
    "Locação de Equipamentos",
    "Infraestrutura",
    "Projeto e Gerenciamento de Obra",
    "Construção Civil",
    "Estrutura Metálica",
    "Planejamento e Viabilidade de Obra"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
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
                className="font-heading text-white leading-[1em]"
                style={{ 
                  fontSize: '57px', 
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
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Left: Contact Information */}
              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-foreground mb-2 text-lg tracking-wide">{item.title.toUpperCase()}</h4>
                      <p className="font-medium text-muted-foreground text-base">{item.info}</p>
                      {item.description && (
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Contact Form */}
              <div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 text-base font-bold"
                      disabled={createMessage.isPending}
                    >
                      {createMessage.isPending ? "ENVIANDO..." : "ENVIAR"}
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