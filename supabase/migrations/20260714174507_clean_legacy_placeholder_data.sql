-- Hide known placeholder records without deleting historical rows.
UPDATE public.contact_info
SET is_active = false, updated_at = now()
WHERE type = 'company_data'
  AND value = 'CNPJ: 00.000.000/0001-00';

UPDATE public.social_links
SET is_active = false, updated_at = now()
WHERE platform = 'facebook'
  AND url = 'testefacebook';

-- Keep legacy settings aligned with the verified NSS contact records.
UPDATE public.site_settings
SET
  value = CASE key
    WHEN 'company_name' THEN 'NSS Engenharia'
    WHEN 'company_email' THEN 'nssengenharia.0613@gmail.com'
    WHEN 'company_phone' THEN '(21) 98876-0992'
    WHEN 'company_address' THEN 'Rio de Janeiro - RJ'
    WHEN 'whatsapp_number' THEN '5521988760992'
    ELSE value
  END,
  updated_at = now()
WHERE key IN (
  'company_name',
  'company_email',
  'company_phone',
  'company_address',
  'whatsapp_number'
);
