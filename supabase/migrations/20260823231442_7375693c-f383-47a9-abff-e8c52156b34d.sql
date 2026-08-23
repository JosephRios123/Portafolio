GRANT SELECT ON public.profile_technologies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_technologies TO authenticated;
GRANT ALL ON public.profile_technologies TO service_role;

GRANT SELECT ON public.profile_core TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_core TO authenticated;
GRANT ALL ON public.profile_core TO service_role;