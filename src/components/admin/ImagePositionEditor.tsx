import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';

interface ImagePositionEditorProps {
  imageUrl: string;
  position: string;
  onPositionChange: (position: string) => void;
}

const ImagePositionEditor = ({ imageUrl, position, onPositionChange }: ImagePositionEditorProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Parse position string to percentages
  const parsePosition = (pos: string) => {
    const parts = pos.split(' ');
    const x = parts[0]?.includes('%') ? parseFloat(parts[0]) : 50;
    const y = parts[1]?.includes('%') ? parseFloat(parts[1]) : 50;
    return { x, y };
  };

  const { x: posX, y: posY } = parsePosition(position);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    updatePosition({ clientX: touch.clientX, clientY: touch.clientY } as any);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    updatePosition({ clientX: touch.clientX, clientY: touch.clientY } as any);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updatePosition = (e: { clientX: number; clientY: number }) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onPositionChange(`${clampedX.toFixed(1)}% ${clampedY.toFixed(1)}%`);
  };

  const resetPosition = () => {
    onPositionChange('50% 50%');
  };

  // Prevent default touch behaviors
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', preventScroll, { passive: false });
    return () => container.removeEventListener('touchmove', preventScroll);
  }, [isDragging]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Ajustar Posição da Imagem</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetPosition}
          className="h-8 px-2"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Centralizar
        </Button>
      </div>

      {/* Interactive Image Editor */}
      <div
        ref={containerRef}
        className={`relative w-full h-48 md:h-64 border-2 border-dashed rounded-lg overflow-hidden bg-background ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } select-none`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image */}
        <div
          ref={imageRef}
          className="absolute inset-0 bg-cover transition-all duration-75"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: position,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Crosshair indicator */}
        <div
          className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-2 -translate-y-2 pointer-events-none"
          style={{
            left: `${posX}%`,
            top: `${posY}%`,
          }}
        >
          <div className="absolute inset-0.5 bg-primary rounded-full" />
        </div>

        {/* Position feedback */}
        <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded pointer-events-none">
          <span>Posição: {Math.round(posX)}%, {Math.round(posY)}%</span>
        </div>

        {/* Instructions */}
        <div className="absolute top-2 left-2 right-2 text-center text-white text-xs bg-black/50 px-2 py-1 rounded pointer-events-none">
          {isDragging ? 'Arraste para ajustar...' : 'Clique e arraste para posicionar a imagem'}
        </div>
      </div>

      {/* Service Card Preview with Optimized Component */}
      <div className="space-y-2">
        <Label>Preview do Card de Serviço (Tamanho Real)</Label>
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden group">
          <img
            src={imageUrl}
            alt="Preview do serviço"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{
              objectPosition: position,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative h-full p-6 flex flex-col justify-end text-white">
            <h3 className="text-lg font-heading font-normal mb-3 leading-tight" style={{letterSpacing: '0.05em'}}>
              Título do Serviço
            </h3>
            <p className="text-sm opacity-90 leading-relaxed mb-4 line-clamp-3 font-heading font-normal" style={{letterSpacing: '0.05em'}}>
              Descrição do serviço aparecerá aqui para demonstrar como ficará o card final no site.
            </p>
            <button className="service-more-btn self-start">
              MAIS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePositionEditor;