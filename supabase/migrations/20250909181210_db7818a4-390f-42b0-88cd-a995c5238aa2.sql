-- Add image positioning and storage fields to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS image_path TEXT,
ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center center';

-- Update trigger for services table
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();