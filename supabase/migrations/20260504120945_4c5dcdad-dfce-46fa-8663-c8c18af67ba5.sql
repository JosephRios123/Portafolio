
-- 1. Limpieza: borrar el único proyecto existente
DELETE FROM public.projects;

-- 2. Nuevas columnas
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS icon_emoji text,
  ADD COLUMN IF NOT EXISTS icon_image_url text;

ALTER TABLE public.formations
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS icon_emoji text,
  ADD COLUMN IF NOT EXISTS icon_image_url text,
  ADD COLUMN IF NOT EXISTS certificate_url text,
  ADD COLUMN IF NOT EXISTS certificate_mime text;

ALTER TABLE public.mindset_principles
  ADD COLUMN IF NOT EXISTS icon_emoji text,
  ADD COLUMN IF NOT EXISTS icon_image_url text;

-- 3. Bucket para certificados (PDF/imagen, público para lectura)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Políticas de Storage para 'certificates'
DROP POLICY IF EXISTS "Certificates are public" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admins update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete certificates" ON storage.objects;

CREATE POLICY "Certificates are public"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

CREATE POLICY "Admins upload certificates"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update certificates"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete certificates"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));

-- 5. Endurecer políticas del bucket project-previews (eran inexistentes/abiertas)
DROP POLICY IF EXISTS "Project previews are public" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload project previews" ON storage.objects;
DROP POLICY IF EXISTS "Admins update project previews" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete project previews" ON storage.objects;

CREATE POLICY "Project previews are public"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-previews');

CREATE POLICY "Admins upload project previews"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-previews' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update project previews"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'project-previews' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete project previews"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project-previews' AND public.has_role(auth.uid(), 'admin'));
