-- Create a default admin user
-- Note: This is for testing purposes only. In production, the admin should be created through proper registration flow.

-- First, let's update an existing user to be admin (if any exists) or create instructions for manual admin creation
-- Since we can't directly insert into auth.users through SQL, we'll create a function to promote users to admin

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find user by email
  SELECT id INTO user_record FROM auth.users WHERE email = user_email LIMIT 1;
  
  IF user_record.id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Update or insert profile with admin role
  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (user_record.id, 'admin', 'Administrator')
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = now();
    
  RETURN 'User promoted to admin successfully: ' || user_email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(TEXT) TO authenticated;

-- Insert some sample contact info data
INSERT INTO public.contact_info (type, label, value, is_active, order_position) VALUES
('phone', 'Telefone Principal', '(11) 99999-9999', true, 1),
('email', 'Email Principal', 'contato@reservaengenharia.com', true, 2),
('address', 'Endereço', 'São Paulo, SP', true, 3),
('whatsapp', 'WhatsApp', '5511999999999', true, 4)
ON CONFLICT DO NOTHING;