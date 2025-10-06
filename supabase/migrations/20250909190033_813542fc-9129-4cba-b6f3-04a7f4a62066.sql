-- Create RLS policies for service-images bucket to allow admin operations
CREATE POLICY "Admins can insert service images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'service-images' AND is_admin());

CREATE POLICY "Admins can update service images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'service-images' AND is_admin());

CREATE POLICY "Admins can delete service images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'service-images' AND is_admin());