-- Atualizar a URL do Google Maps com apenas a URL de embed (sem o HTML)
UPDATE site_settings 
SET value = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.7592417200894!2d-43.1891501246112!3d-22.946130039278398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997fedd5b4d137%3A0x3042dff684b391e1!2sR.%20Mal.%20Niemeyer%2C%2026%20-%20Botafogo%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022251-060!5e1!3m2!1spt-BR!2sbr!4v1759174226286!5m2!1spt-BR!2sbr',
    updated_at = now()
WHERE key = 'google_maps_embed_url';