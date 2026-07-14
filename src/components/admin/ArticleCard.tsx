import { Article } from "@/hooks/useArticles";
import { useState, memo } from "react";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  index?: number;
}

const ArticleCard = memo(({ article, onEdit, onDelete, index = 0 }: ArticleCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return 'Não publicado';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="relative overflow-hidden group h-[420px] rounded-lg border bg-card animate-fade-in hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {article.featured_image && !imageError ? (
          <img
            src={article.featured_image}
            alt={article.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-4xl opacity-20">📝</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={article.status === 'published' ? 'default' : 'secondary'}
            className="shadow-md"
          >
            {article.status === 'published' ? 'Publicado' : 'Rascunho'}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
          {article.category && (
            <Badge variant="outline" className="text-xs">
              {article.category}
            </Badge>
          )}
          {article.reading_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.reading_time} min</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold leading-tight mb-2 line-clamp-2 flex-grow-0">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
          {article.excerpt || article.content?.substring(0, 120) + '...' || 'Sem descrição'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(article)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(article.id)}
            className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
});

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard;
