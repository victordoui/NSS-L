-- Corrigir caminhos das imagens de serviços para produção
UPDATE services 
SET image_url = REPLACE(image_url, '/src/assets/', '/assets/') 
WHERE image_url LIKE '/src/assets/%';