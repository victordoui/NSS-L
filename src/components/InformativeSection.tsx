import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { Skeleton } from "./ui/skeleton";

const InformativeSection = () => {
  const { data: allArticles, isLoading } = useArticles();
  
  const getCategoryLabel = (category: string) => {
    return category === "dicas" ? "Dicas" : "Publicações";
  };

  // Pegar os 2 artigos publicados mais recentes
  const articles = allArticles?.filter(article => article.status === 'published').slice(0, 2) || [];

  return (
    <section id="informativo" className="py-24 section-dark">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title mb-6 text-white font-heading font-normal" style={{letterSpacing: '0.05em'}}>INFORMATIVO</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-heading font-normal" style={{letterSpacing: '0.05em'}}>
            Dicas práticas e publicações técnicas sobre engenharia geotécnica e civil
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-6 p-6 bg-white/5">
                <Skeleton className="w-32 h-24 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {articles.map((article) => (
              <div key={article.id} className="flex gap-6 p-6 bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="w-32 h-24 flex-shrink-0 overflow-hidden">
                  <img 
                    src={article.featured_image || "/assets/images/article-placeholder.png"} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-secondary font-heading font-normal mb-2 uppercase" style={{letterSpacing: '0.05em'}}>
                    {getCategoryLabel(article.category || '')}
                  </div>
                  <h3 className="text-lg font-heading font-normal text-white mb-2 group-hover:text-secondary transition-colors" style={{letterSpacing: '0.05em'}}>
                    {article.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-3 font-heading font-normal line-clamp-3" style={{letterSpacing: '0.05em'}}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60 font-heading font-normal" style={{letterSpacing: '0.05em'}}>
                      {article.reading_time || 5} min de leitura
                    </span>
                    <Button variant="ghost" size="sm" className="text-secondary hover:text-white p-0 font-heading font-normal" style={{letterSpacing: '0.05em'}}>
                      <a href={`/informativo/${article.slug}`} className="flex items-center">
                        Ler mais
                        <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button size="lg" asChild className="bg-secondary hover:bg-white text-black hover:text-black font-heading font-normal" style={{letterSpacing: '0.05em'}}>
            <a href="/informativo">
              Ver Todas as Publicações
              <ArrowRight size={20} className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InformativeSection;
