-- Permitir leitura pública das configurações do site
-- Isso permite que o Google Maps apareça na página de contato
-- sem necessidade de autenticação
CREATE POLICY "Allow public read access to site_settings" 
ON public.site_settings 
FOR SELECT 
USING (true);