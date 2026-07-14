-- Keep privileged authorization helpers outside the exposed Data API schema.
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;

-- Public content: anonymous visitors only see published/active records.
-- Signed-in administrators retain access to drafts and inactive records.
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Only admins can manage articles" ON public.articles;
CREATE POLICY "Anonymous users can view published articles"
ON public.articles FOR SELECT TO anon
USING (status = 'published');
CREATE POLICY "Authenticated users can view permitted articles"
ON public.articles FOR SELECT TO authenticated
USING (status = 'published' OR (SELECT private.is_admin()));
CREATE POLICY "Admins can insert articles"
ON public.articles FOR INSERT TO authenticated
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can update articles"
ON public.articles FOR UPDATE TO authenticated
USING ((SELECT private.is_admin()))
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can delete articles"
ON public.articles FOR DELETE TO authenticated
USING ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Anyone can view active contact info" ON public.contact_info;
DROP POLICY IF EXISTS "Only admins can manage contact info" ON public.contact_info;
CREATE POLICY "Anonymous users can view active contact info"
ON public.contact_info FOR SELECT TO anon
USING (is_active = true);
CREATE POLICY "Authenticated users can view permitted contact info"
ON public.contact_info FOR SELECT TO authenticated
USING (is_active = true OR (SELECT private.is_admin()));
CREATE POLICY "Admins can insert contact info"
ON public.contact_info FOR INSERT TO authenticated
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can update contact info"
ON public.contact_info FOR UPDATE TO authenticated
USING ((SELECT private.is_admin()))
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can delete contact info"
ON public.contact_info FOR DELETE TO authenticated
USING ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Anyone can view completed projects" ON public.projects;
DROP POLICY IF EXISTS "Only admins can manage projects" ON public.projects;
CREATE POLICY "Anonymous users can view completed projects"
ON public.projects FOR SELECT TO anon
USING (status = 'completed');
CREATE POLICY "Authenticated users can view permitted projects"
ON public.projects FOR SELECT TO authenticated
USING (status = 'completed' OR (SELECT private.is_admin()));
CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE TO authenticated
USING ((SELECT private.is_admin()))
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE TO authenticated
USING ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Only admins can manage services" ON public.services;
CREATE POLICY "Anonymous users can view active services"
ON public.services FOR SELECT TO anon
USING (is_active = true);
CREATE POLICY "Authenticated users can view permitted services"
ON public.services FOR SELECT TO authenticated
USING (is_active = true OR (SELECT private.is_admin()));
CREATE POLICY "Admins can insert services"
ON public.services FOR INSERT TO authenticated
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can update services"
ON public.services FOR UPDATE TO authenticated
USING ((SELECT private.is_admin()))
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE TO authenticated
USING ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Allow public read access to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Only admins can manage site settings" ON public.site_settings;
CREATE POLICY "Anonymous users can view site settings"
ON public.site_settings FOR SELECT TO anon
USING (true);
CREATE POLICY "Authenticated users can view site settings"
ON public.site_settings FOR SELECT TO authenticated
USING (true);
CREATE POLICY "Admins can insert site settings"
ON public.site_settings FOR INSERT TO authenticated
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can update site settings"
ON public.site_settings FOR UPDATE TO authenticated
USING ((SELECT private.is_admin()))
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can delete site settings"
ON public.site_settings FOR DELETE TO authenticated
USING ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Anyone can view active social links" ON public.social_links;
DROP POLICY IF EXISTS "Only admins can manage social links" ON public.social_links;
CREATE POLICY "Anonymous users can view active social links"
ON public.social_links FOR SELECT TO anon
USING (is_active = true);
CREATE POLICY "Authenticated users can view permitted social links"
ON public.social_links FOR SELECT TO authenticated
USING (is_active = true OR (SELECT private.is_admin()));
CREATE POLICY "Admins can insert social links"
ON public.social_links FOR INSERT TO authenticated
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can update social links"
ON public.social_links FOR UPDATE TO authenticated
USING ((SELECT private.is_admin()))
WITH CHECK ((SELECT private.is_admin()));
CREATE POLICY "Admins can delete social links"
ON public.social_links FOR DELETE TO authenticated
USING ((SELECT private.is_admin()));

-- Profiles are created by the trusted auth trigger. Clients may read but not
-- insert or update the role column, preventing account self-promotion.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view permitted profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR (SELECT private.is_admin())
);

-- Internal admin-only tables use the same non-exposed authorization helper.
ALTER POLICY "Only admins can manage bd_ativo" ON public.bd_ativo
TO authenticated
USING ((SELECT private.is_admin()))
WITH CHECK ((SELECT private.is_admin()));

ALTER POLICY "Only admins can manage contact messages" ON public.contact_messages
TO authenticated
USING ((SELECT private.is_admin()))
WITH CHECK ((SELECT private.is_admin()));

-- Public buckets serve direct object URLs without a broad SELECT policy.
DROP POLICY IF EXISTS "Service images are publicly accessible" ON storage.objects;
ALTER POLICY "Admins can insert service images" ON storage.objects
TO authenticated
WITH CHECK (bucket_id = 'service-images' AND (SELECT private.is_admin()));
ALTER POLICY "Admins can update service images" ON storage.objects
TO authenticated
USING (bucket_id = 'service-images' AND (SELECT private.is_admin()))
WITH CHECK (bucket_id = 'service-images' AND (SELECT private.is_admin()));
ALTER POLICY "Admins can delete service images" ON storage.objects
TO authenticated
USING (bucket_id = 'service-images' AND (SELECT private.is_admin()));

-- Remove the privileged helper from the exposed public RPC surface.
DROP FUNCTION public.is_admin(uuid);

-- Cover foreign keys used by joins and cascading updates/deletes.
CREATE INDEX IF NOT EXISTS articles_author_id_idx
ON public.articles (author_id);

CREATE INDEX IF NOT EXISTS contact_info_updated_by_idx
ON public.contact_info (updated_by);

CREATE INDEX IF NOT EXISTS site_settings_updated_by_idx
ON public.site_settings (updated_by);

CREATE INDEX IF NOT EXISTS social_links_updated_by_idx
ON public.social_links (updated_by);
