DROP POLICY IF EXISTS "Anyone can view active technologies" ON public.profile_technologies;

CREATE POLICY "Anyone can view active technologies"
ON public.profile_technologies
FOR SELECT
TO anon
USING (is_active = true);

CREATE POLICY "Authenticated can view technologies"
ON public.profile_technologies
FOR SELECT
TO authenticated
USING (true);