REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;

REVOKE ALL ON TABLE public.projects FROM anon;
GRANT SELECT ON TABLE public.projects TO anon;
REVOKE ALL ON TABLE public.projects FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects TO authenticated;
GRANT ALL ON TABLE public.projects TO service_role;

REVOKE ALL ON TABLE public.experiences FROM anon;
GRANT SELECT ON TABLE public.experiences TO anon;
REVOKE ALL ON TABLE public.experiences FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.experiences TO authenticated;
GRANT ALL ON TABLE public.experiences TO service_role;

REVOKE ALL ON TABLE public.experience_bullets FROM anon;
GRANT SELECT ON TABLE public.experience_bullets TO anon;
REVOKE ALL ON TABLE public.experience_bullets FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.experience_bullets TO authenticated;
GRANT ALL ON TABLE public.experience_bullets TO service_role;

REVOKE ALL ON TABLE public.mindset_principles FROM anon;
GRANT SELECT ON TABLE public.mindset_principles TO anon;
REVOKE ALL ON TABLE public.mindset_principles FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.mindset_principles TO authenticated;
GRANT ALL ON TABLE public.mindset_principles TO service_role;

REVOKE ALL ON TABLE public.formations FROM anon;
GRANT SELECT ON TABLE public.formations TO anon;
REVOKE ALL ON TABLE public.formations FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.formations TO authenticated;
GRANT ALL ON TABLE public.formations TO service_role;

REVOKE ALL ON TABLE public.professional_events FROM anon;
GRANT SELECT ON TABLE public.professional_events TO anon;
REVOKE ALL ON TABLE public.professional_events FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.professional_events TO authenticated;
GRANT ALL ON TABLE public.professional_events TO service_role;

REVOKE ALL ON TABLE public.user_roles FROM anon;
REVOKE ALL ON TABLE public.user_roles FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;