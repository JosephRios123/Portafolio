CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM public, anon, authenticated;

ALTER POLICY "Admins manage roles" ON public.user_roles USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins manage projects" ON public.projects USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins manage experiences" ON public.experiences USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins manage bullets" ON public.experience_bullets USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins manage principles" ON public.mindset_principles USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins manage formations" ON public.formations USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins manage professional events" ON public.professional_events USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins upload project previews" ON storage.objects WITH CHECK (bucket_id = 'project-previews' AND private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins update project previews" ON storage.objects USING (bucket_id = 'project-previews' AND private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins delete project previews" ON storage.objects USING (bucket_id = 'project-previews' AND private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins upload certificates" ON storage.objects WITH CHECK (bucket_id = 'certificates' AND private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins update certificates" ON storage.objects USING (bucket_id = 'certificates' AND private.has_role(auth.uid(), 'admin'));
ALTER POLICY "Admins delete certificates" ON storage.objects USING (bucket_id = 'certificates' AND private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Admins can list project previews" ON storage.objects USING (bucket_id = 'project-previews' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION public.has_role(uuid, public.app_role);