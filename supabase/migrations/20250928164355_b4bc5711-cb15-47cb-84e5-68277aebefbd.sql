-- Fix the remaining function search path issue
-- Check which function still needs fixing by recreating the promote_user_to_admin function with search_path
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;