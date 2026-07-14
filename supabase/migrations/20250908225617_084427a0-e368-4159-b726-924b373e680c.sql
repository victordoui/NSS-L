-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  image_url TEXT,
  slug TEXT UNIQUE,
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active services
CREATE POLICY "Anyone can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-images', 'service-images', true);

-- Create storage policies for service images
CREATE POLICY "Service images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'service-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial services data
INSERT INTO public.services (title, description, short_description, slug, order_position, image_url) VALUES
('DRAGAGEM E DESASSOREAMENTO', 'Remoção de sedimentos e recuperação da capacidade hídrica de reservatórios, rios e lagoas com equipamentos especializados e técnicas avançadas.', 'Remoção de sedimentos e recuperação da capacidade hídrica de reservatórios, rios e lagoas com equipamentos especializados.', 'dragagem-desassoreamento', 1, '/assets/desassoreamento-guarapiranga.jpg'),
('TERRAPLENAGEM', 'Movimentação de terra, nivelamento e preparação de terrenos para construção civil e industrial com máquinas de alta performance.', 'Movimentação de terra, nivelamento e preparação de terrenos para construção civil e industrial.', 'terraplenagem', 2, '/assets/terraplenagem-toyota.jpg'),
('LOCAÇÃO DE EQUIPAMENTOS', 'Aluguel de maquinário pesado e equipamentos especializados para obras de infraestrutura com manutenção e suporte técnico.', 'Aluguel de maquinário pesado e equipamentos especializados para obras de infraestrutura.', 'locacao-equipamentos', 3, '/assets/engineering-hero.jpg'),
('INFRAESTRUTURA', 'Construção de sistemas de saneamento, drenagem urbana e obras de infraestrutura básica com tecnologia de ponta.', 'Construção de sistemas de saneamento, drenagem urbana e obras de infraestrutura básica.', 'infraestrutura', 4, '/assets/drenagem-campinas.jpg'),
('PROJETO E GERENCIAMENTO', 'Desenvolvimento de projetos executivos e gestão completa de obras do início ao fim com acompanhamento técnico especializado.', 'Desenvolvimento de projetos executivos e gestão completa de obras do início ao fim.', 'projeto-gerenciamento', 5, '/assets/ete-jundiai.jpg'),
('CONSTRUÇÃO CIVIL', 'Execução de obras residenciais, comerciais e industriais com qualidade, pontualidade e padrões elevados de construção.', 'Execução de obras residenciais, comerciais e industriais com qualidade e pontualidade.', 'construcao-civil', 6, '/assets/engineering-hero.jpg'),
('ESTRUTURA METÁLICA', 'Fabricação e montagem de estruturas metálicas para galpões industriais e construções com soldas certificadas e materiais de qualidade.', 'Fabricação e montagem de estruturas metálicas para galpões industriais e construções.', 'estrutura-metalica', 7, '/assets/engineering-hero.jpg'),
('PLANEJAMENTO E VIABILIDADE', 'Estudos de viabilidade técnica e econômica, cronogramas e orçamentos detalhados com análise completa de projetos.', 'Estudos de viabilidade técnica e econômica, cronogramas e orçamentos detalhados.', 'planejamento-viabilidade', 8, '/assets/engineering-hero.jpg');