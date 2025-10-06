import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { Skeleton } from "@/components/ui/skeleton";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: articles, isLoading } = useArticles();

  const article = articles?.find(a => a.slug === slug && a.status === 'published');

  const getCategoryLabel = (category: string) => {
    return category === "dicas" ? "Dicas" : "Publicações";
  };

  // Artigos relacionados da mesma categoria
  const relatedArticles = articles?.filter(
    a => a.status === 'published' && 
    a.category === article?.category && 
    a.slug !== slug
  ).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <article className="py-20">
            <div className="container max-w-4xl">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-96 w-full mb-8" />
              <Skeleton className="h-64 w-full" />
            </div>
          </article>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="container max-w-4xl py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Artigo não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <Button asChild>
              <Link to="/informativo">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Informativo
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <article className="py-20">
          <div className="container max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Button variant="ghost" asChild>
                <Link to="/informativo">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Informativo
                </Link>
              </Button>
            </div>

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  {getCategoryLabel(article.category || '')}
                </Badge>
              </div>

              <h1 
                className="font-heading font-bold leading-tight mb-6"
                style={{ fontSize: '42px', letterSpacing: '0.05em' }}
              >
                {article.title}
              </h1>

              <div className="flex items-center gap-6 text-muted-foreground text-sm">
                {article.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.published_at).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {article.reading_time || 5} min de leitura
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.featured_image && (
              <div className="mb-12">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Excerpt */}
            {article.excerpt && (
              <div className="mb-8 p-6 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="text-lg font-medium leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-12"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {article.content}
            </div>

            {/* Divider */}
            <hr className="my-12 border-border" />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      to={`/informativo/${related.slug}`}
                      className="group border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={related.featured_image || "/assets/images/article-placeholder.png"}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {related.reading_time || 5} min de leitura
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ArticleDetail;
