-- Add image_position column to projects table
ALTER TABLE public.projects 
ADD COLUMN image_position TEXT DEFAULT '50% 50%';