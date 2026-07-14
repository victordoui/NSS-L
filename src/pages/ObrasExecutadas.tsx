import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Ruler, Droplets } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import heroBackground from "@/assets/obras-executadas-hero-new.jpg";
import { useProjects } from "@/hooks/useProjects";

const ObrasExecutadas = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const { data: allProjects, isLoading } = useProjects();

  // Get unique categories from projects
  const categories = ["Todas", ...Array.from(new Set(allProjects?.map(p => p.category).filter(Boolean) || []))];

  const filteredObras = selectedCategory === "Todas" 
    ? allProjects || []
    : allProjects?.filter(project => project.category === selectedCategory) || [];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section 
          className="relative min-h-[600px] flex items-center bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroBackground})`,
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 container">
            <h1 
              className="font-heading text-[clamp(2.25rem,11vw,3.5625rem)] text-white leading-[1em]"
              style={{ 
                fontWeight: 'normal',
                letterSpacing: '0.05em'
              }}
            >
              OBRAS EXECUTADAS
            </h1>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-background">
          <div className="container">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-300"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-section">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full mb-4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredObras.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum projeto encontrado nesta categoria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredObras.map((obra) => (
                  <Card key={obra.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                    <div className="aspect-video relative overflow-hidden">
                      {obra.featured_image && (
                        <img 
                          src={obra.featured_image} 
                          alt={obra.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {obra.category && (
                        <Badge className="absolute top-4 left-4 bg-primary text-white">
                          {obra.category}
                        </Badge>
                      )}
                      <Badge 
                        className="absolute top-4 right-4"
                        variant={obra.status === "completed" ? "default" : "secondary"}
                      >
                        {obra.status === "completed" ? "Concluída" : "Em Andamento"}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
                        {obra.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {obra.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        {obra.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} />
                            <span>{obra.location}</span>
                          </div>
                        )}
                        
                        {(obra.completed_at || obra.duration) && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={16} />
                            <span>{obra.completed_at} {obra.duration && `• ${obra.duration}`}</span>
                          </div>
                        )}
                        
                        {obra.area && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            {obra.category === "Saneamento" ? <Droplets size={16} /> : <Ruler size={16} />}
                            <span>{obra.area}</span>
                          </div>
                        )}
                      </div>
                      
                      {obra.client && (
                        <div className="border-t pt-4">
                          <div className="text-xs text-muted-foreground">Cliente</div>
                          <div className="font-semibold text-primary">{obra.client}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-heading font-normal mb-4" style={{letterSpacing: '0.05em'}}>
              Precisa de uma Solução Personalizada?
            </h2>
            <p className="text-xl mb-8 opacity-90 font-heading font-normal" style={{letterSpacing: '0.05em'}}>
              Entre em contato conosco e descubra como podemos ajudar em seu próximo projeto
            </p>
            <Button size="lg" variant="secondary" asChild className="font-heading font-normal" style={{letterSpacing: '0.05em'}}>
              <a href="/contato">
                Solicitar Orçamento
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ObrasExecutadas;
