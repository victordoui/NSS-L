-- Add image_position column to articles table
ALTER TABLE articles 
ADD COLUMN image_position text DEFAULT '50% 50%';