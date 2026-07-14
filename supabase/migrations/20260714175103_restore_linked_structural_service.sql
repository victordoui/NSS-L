-- Restore the legitimate service referenced by the redesigned home page.
INSERT INTO public.services (
  title,
  description,
  short_description,
  slug,
  image_url,
  order_position,
  is_active
)
SELECT
  'Projeto de Estrutura',
  'Elaboração de projetos estruturais em concreto armado, aço e madeira, dimensionamento de elementos estruturais e análise de cargas para edificações e obras de infraestrutura.',
  'Projetos estruturais completos em concreto, aço e madeira',
  'projeto-estrutura',
  '/assets/services/projeto-estrutura.jpg',
  3,
  true
WHERE NOT EXISTS (
  SELECT 1
  FROM public.services
  WHERE slug = 'projeto-estrutura'
);
