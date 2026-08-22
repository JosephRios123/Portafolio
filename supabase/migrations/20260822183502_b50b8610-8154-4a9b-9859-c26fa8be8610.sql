CREATE TYPE public.tech_category AS ENUM ('Frontend','Backend','Database','Cloud','DevOps','AI','Tools','Architecture','Other');

CREATE TABLE public.profile_technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category public.tech_category NOT NULL DEFAULT 'Other',
  icon_name text NOT NULL DEFAULT 'Cpu',
  color text,
  description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profile_technologies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_technologies TO authenticated;
GRANT ALL ON public.profile_technologies TO service_role;

ALTER TABLE public.profile_technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active technologies"
  ON public.profile_technologies FOR SELECT
  USING (is_active = true OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage technologies"
  ON public.profile_technologies FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER profile_technologies_touch BEFORE UPDATE ON public.profile_technologies
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.profile_core (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'BACKEND',
  status_text text NOT NULL DEFAULT 'CORE_ACTIVE',
  icon_name text NOT NULL DEFAULT 'Cpu',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profile_core TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_core TO authenticated;
GRANT ALL ON public.profile_core TO service_role;

ALTER TABLE public.profile_core ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view core"
  ON public.profile_core FOR SELECT USING (true);

CREATE POLICY "Admins manage core"
  ON public.profile_core FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER profile_core_touch BEFORE UPDATE ON public.profile_core
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();