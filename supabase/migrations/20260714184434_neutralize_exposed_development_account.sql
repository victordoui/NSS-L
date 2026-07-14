-- The credentials for this legacy development account were committed to the
-- public-facing frontend. Remove its administrative privileges immediately.
UPDATE public.profiles AS profile
SET
  role = 'user',
  updated_at = now()
FROM auth.users AS auth_user
WHERE profile.user_id = auth_user.id
  AND lower(auth_user.email) = 'dev@test.com'
  AND profile.role = 'admin';
