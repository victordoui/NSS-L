import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Search, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import informativoHero from "@/assets/informativo-hero.jpg";
import { useArticles } from "@/hooks/useArticles";

const Informativo = () => {
  const { data: allArticles, isLoading } = useArticles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryLabel = (category: string) => {
    return category === "dicas" ? "Dicas" : "Publicações";
  };

  // Filtrar apenas artigos publicados
  const publishedArticles = allArticles?.filter(article => article.status === 'published') || [];

  // Aplicar filtros de busca e categoria
  const filteredArticles = publishedArticles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section 
          className="relative min-h-[600px] flex items-center bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${informativoHero})`,
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 container max-w-6xl">
            <div className="max-w-4xl">
              <h1 
                className="font-heading text-[clamp(2.25rem,11vw,3.5625rem)] text-white leading-[1em]"
                style={{ 
                  fontWeight: 'normal',
                  letterSpacing: '0.05em' 
                }}
              >
                INFORMATIVO
              </h1>
            </div>
          </div>
        </section>

        {/* Blog Feed */}
        <section className="py-20">
          <div className="container max-w-6xl">
            {/* Search and Filter Bar */}
            <div className="flex justify-between items-center mb-8 gap-4">
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todos
                </Button>
                <Button
                  variant={selectedCategory === "dicas" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("dicas")}
                >
                  Dicas
                </Button>
                <Button
                  variant={selectedCategory === "publicacoes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("publicacoes")}
                >
                  Publicações
                </Button>
              </div>

              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            {/* Articles Grid - 2 Columns */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-20 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum artigo encontrado
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <article 
                    key={article.id}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={article.featured_image || "/assets/images/article-placeholder.png"} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4" variant="secondary">
                        {getCategoryLabel(article.category || '')}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <a 
                        href={`/informativo/${article.slug}`}
                        className="block"
                      >
                        <h2 
                          className="font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                          style={{ fontSize: '21px' }}
                        >
                          {article.title}
                        </h2>
                      </a>
                      
                      <p 
                        className="text-muted-foreground leading-relaxed line-clamp-3"
                        style={{ fontSize: '14px' }}
                      >
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span 
                          className="text-muted-foreground"
                          style={{ fontSize: '12px' }}
                        >
                          {article.reading_time || 5} min de leitura
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.location.href = `/informativo/${article.slug}`}
                          className="text-primary hover:text-primary/80"
                        >
                          Ler artigo
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
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

export default Informativo;
