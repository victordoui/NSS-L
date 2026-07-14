-- Drop the problematic RLS policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a SECURITY DEFINER function to check admin role without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

-- Recreate the admin policy using the security definer function
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.is_admin());

-- Also fix other policies that might have the same issue
-- Check and fix the admin policies on other tables to use the same function
DROP POLICY IF EXISTS "Only admins can manage articles" ON public.articles;
CREATE POLICY "Only admins can manage articles" ON public.articles
FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can manage contact info" ON public.contact_info;
CREATE POLICY "Only admins can manage contact info" ON public.contact_info
FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can manage projects" ON public.projects;
CREATE POLICY "Only admins can manage projects" ON public.projects
FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can manage services" ON public.services;
CREATE POLICY "Only admins can manage services" ON public.services
FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can manage site settings" ON public.site_settings;
CREATE POLICY "Only admins can manage site settings" ON public.site_settings
FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can manage social links" ON public.social_links;
CREATE POLICY "Only admins can manage social links" ON public.social_links
FOR ALL USING (public.is_admin());