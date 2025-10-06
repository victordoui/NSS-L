-- Adicionar campos para localização e Google Maps na tabela site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS google_maps_embed_url TEXT,
ADD COLUMN IF NOT EXISTS location_address TEXT;

-- Inserir ou atualizar configuração de localização
-- Primeiro, tentar inserir um novo registro se não existir nenhum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'google_maps_embed_url') THEN
    INSERT INTO site_settings (key, value, description)
    VALUES ('google_maps_embed_url', '', 'URL de incorporação do Google Maps');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'location_address') THEN
    INSERT INTO site_settings (key, value, description)
    VALUES ('location_address', 'São Paulo - SP', 'Endereço da empresa para exibição');
  END IF;
END $$;