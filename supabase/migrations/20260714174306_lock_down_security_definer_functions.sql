-- Prevent public RPC access to privileged SECURITY DEFINER functions.
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- RLS policies still need this helper for signed-in administrators.
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;

-- Anonymous traffic must never evaluate administrative policies.
ALTER POLICY "Only admins can manage articles" ON public.articles TO authenticated;
ALTER POLICY "Only admins can manage bd_ativo" ON public.bd_ativo TO authenticated;
ALTER POLICY "Only admins can manage contact info" ON public.contact_info TO authenticated;
ALTER POLICY "Only admins can manage contact messages" ON public.contact_messages TO authenticated;
ALTER POLICY "Admins can view all profiles" ON public.profiles TO authenticated;
ALTER POLICY "Only admins can manage projects" ON public.projects TO authenticated;
ALTER POLICY "Only admins can manage services" ON public.services TO authenticated;
ALTER POLICY "Only admins can manage site settings" ON public.site_settings TO authenticated;
ALTER POLICY "Only admins can manage social links" ON public.social_links TO authenticated;
