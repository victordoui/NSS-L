-- Update services with new specific images
UPDATE services SET 
  image_url = '/assets/locacao-equipamentos.jpg',
  updated_at = now()
WHERE title = 'LOCAÇÃO DE EQUIPAMENTOS';

UPDATE services SET 
  image_url = '/assets/construcao-civil.jpg',
  updated_at = now()
WHERE title = 'CONSTRUÇÃO CIVIL';

UPDATE services SET 
  image_url = '/assets/estrutura-metalica.jpg',
  updated_at = now()
WHERE title = 'ESTRUTURA METÁLICA';

UPDATE services SET 
  image_url = '/assets/planejamento-viabilidade.jpg',
  updated_at = now()
WHERE title = 'PLANEJAMENTO E VIABILIDADE';