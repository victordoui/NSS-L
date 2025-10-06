-- Add image positioning and storage fields to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS image_path TEXT,
ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center center';