import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PublicProject = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  link: string | null;
  image_url: string | null;
  country: string | null;
  icon_emoji: string | null;
  icon_image_url: string | null;
  display_order: number;
};

export type PublicExperience = {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  color: string;
  display_order: number;
  bullets: { id: string; text: string; display_order: number }[];
};

export type PublicFormation = {
  id: string;
  course: string;
  institution: string;
  city: string | null;
  country: string | null;
  status: "Completado" | "En progreso" | "Certificado";
  obtained_date: string | null;
  icon_emoji: string | null;
  icon_image_url: string | null;
  certificate_url: string | null;
  certificate_mime: string | null;
  display_order: number;
};

export type PublicPrinciple = {
  id: string;
  phrase: string;
  description: string;
  category: "Técnica" | "Humana" | "Estratégica";
  icon_emoji: string | null;
  icon_image_url: string | null;
  display_order: number;
};

function useFetch<T>(loader: () => Promise<T[]>, deps: unknown[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    loader()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e?.message ?? "Error"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export const useProjects = () =>
  useFetch<PublicProject>(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as PublicProject[];
  });

export const useExperiences = () =>
  useFetch<PublicExperience>(async () => {
    const [{ data: exps, error: e1 }, { data: bullets, error: e2 }] = await Promise.all([
      supabase.from("experiences").select("*").order("display_order"),
      supabase.from("experience_bullets").select("*").order("display_order"),
    ]);
    if (e1) throw e1;
    if (e2) throw e2;
    return (exps ?? []).map((e) => ({
      ...(e as Omit<PublicExperience, "bullets">),
      bullets: (bullets ?? [])
        .filter((b) => b.experience_id === e.id)
        .map((b) => ({ id: b.id, text: b.text, display_order: b.display_order })),
    }));
  });

export const useFormations = () =>
  useFetch<PublicFormation>(async () => {
    const { data, error } = await supabase.from("formations").select("*").order("display_order");
    if (error) throw error;
    return (data ?? []) as PublicFormation[];
  });

export const useMindset = () =>
  useFetch<PublicPrinciple>(async () => {
    const { data, error } = await supabase.from("mindset_principles").select("*").order("display_order");
    if (error) throw error;
    return (data ?? []) as PublicPrinciple[];
  });
