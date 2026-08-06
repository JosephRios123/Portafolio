CREATE TABLE public.professional_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('Conferencia', 'Workshop', 'Meetup', 'Webinar', 'Otro')),
  participation_role text NOT NULL CHECK (participation_role IN ('Ponente', 'Asistente', 'Organizador', 'Mentor', 'Otro')),
  event_date text NOT NULL,
  location text,
  description text NOT NULL,
  link text,
  icon_emoji text,
  icon_image_url text,
  certificate_url text,
  certificate_mime text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.professional_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_events TO authenticated;
GRANT ALL ON public.professional_events TO service_role;
ALTER TABLE public.professional_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view professional events" ON public.professional_events FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage professional events" ON public.professional_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER professional_events_touch BEFORE UPDATE ON public.professional_events FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX professional_events_order_date_idx ON public.professional_events (display_order, event_date DESC);