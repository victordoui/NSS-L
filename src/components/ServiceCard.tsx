import { Service } from "@/hooks/useServices";
import { useState, memo } from "react";

interface ServiceCardProps {
  service: Service;
  className?: string;
  showMoreButton?: boolean;
  onMoreClick?: (service: Service) => void;
  index?: number;
}

const ServiceCard = memo(({ service, className = "", showMoreButton = true, onMoreClick, index = 0 }: ServiceCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(service);
    } else {
      window.location.href = `/servicos/${service.slug}`;
    }
  };

  const handleCardClick = () => {
    handleMoreClick();
  };

  return (
    <div 
      className={`relative overflow-hidden group cursor-pointer h-[400px] animate-fade-in ${className}`}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          handleCardClick();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`Ver detalhes de ${service.title}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image with Lazy Loading */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
      {!imageError && (
          <img
            src={service.image_url || service.image_path || '/api/placeholder/400/300'}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
            style={{ 
              objectPosition: service.image_position || 'center center'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error('Erro ao carregar imagem do serviço:', service.title, service.image_url, service.image_path);
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        )}
        {imageError && (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
            <span className="text-gray-500">Imagem indisponível</span>
          </div>
        )}
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-end text-white">
        <h3 className="text-lg font-heading font-normal mb-3 leading-tight" style={{letterSpacing: '0.05em'}}>
          {service.title}
        </h3>
        
        <p className="text-sm opacity-90 leading-relaxed mb-4 line-clamp-3 font-heading font-normal" style={{letterSpacing: '0.05em'}}>
          {service.short_description || service.description}
        </p>
        
        {showMoreButton && (
          <button 
            className="service-more-btn self-start"
            onClick={(e) => {
              e.stopPropagation();
              handleMoreClick();
            }}
          >
            MAIS
          </button>
        )}
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
