import { useEffect, useState } from "react";
import { Briefcase, History, Brain, GraduationCap, Plus, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import KpiCard from "@/components/admin/KpiCard";
import ActivitySparkline from "@/components/admin/ActivitySparkline";
import RecentActivity, { ActivityItem } from "@/components/admin/RecentActivity";

const TABLES = [
  { key: "projects",   label: "Proyectos",    icon: Briefcase,     color: "hsl(217 91% 60%)", titleField: "name" as const },
  { key: "experiences", label: "Experiencia",  icon: History,       color: "hsl(187 92% 42%)", titleField: "role" as const },
  { key: "mindset_principles", label: "Mentalidad",   icon: Brain,         color: "hsl(265 85% 65%)", titleField: "phrase" as const },
  { key: "formations", label: "Formación",    icon: GraduationCap, color: "hsl(150 70% 50%)", titleField: "course" as const },
];

const TYPE_MAP: Record<string, ActivityItem["type"]> = {
  projects: "projects",
  experiences: "experience",
  mindset_principles: "mindset",
  formations: "formations",
};

export default function AdminIndex() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [createdAtAll, setCreatedAtAll] = useState<string[]>([]);
  const [recent, setRecent] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        TABLES.map(async (t) => {
          const [countRes, recentRes] = await Promise.all([
            supabase.from(t.key as any).select("*", { count: "exact", head: true }),
            supabase.from(t.key as any).select(`id, ${t.titleField}, created_at, updated_at`).order("updated_at", { ascending: false }).limit(8),
          ]);
          return { key: t.key, count: countRes.count ?? 0, rows: (recentRes.data ?? []) as any[] };
        })
      );

      const c: Record<string, number> = {};
      const allDates: string[] = [];
      const activity: ActivityItem[] = [];
      results.forEach((r) => {
        c[r.key] = r.count;
        const titleField = TABLES.find((t) => t.key === r.key)!.titleField;
        r.rows.forEach((row) => {
          if (row.created_at) allDates.push(row.created_at);
          activity.push({
            id: row.id,
            type: TYPE_MAP[r.key],
            title: String(row[titleField] ?? "—"),
            updated_at: row.updated_at ?? row.created_at,
          });
        });
      });

      setCounts(c);
      setCreatedAtAll(allDates);
      setRecent(activity.sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)).slice(0, 8));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-[11px] font-mono uppercase tracking-wider mb-3">
          <Activity size={12} /> dashboard
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">Bienvenido</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Métricas en tiempo real de tu portafolio.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TABLES.map((t, i) => (
          <KpiCard
            key={t.key}
            label={t.label}
            value={loading ? 0 : counts[t.key] ?? 0}
            icon={t.icon}
            color={t.color}
            delay={i * 80}
          />
        ))}
      </div>

      {/* Sparkline + Recent */}
      <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: "350ms", animationFillMode: "both" }}>
          <ActivitySparkline dates={createdAtAll} />
        </div>
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "420ms", animationFillMode: "both" }}>
          <RecentActivity items={recent} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="animate-fade-in" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Crear nuevo</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TABLES.map((t) => {
            const Icon = t.icon;
            const route = `/admin/${t.key === "experiences" ? "experience" : t.key === "mindset_principles" ? "mindset" : t.key}`;
            return (
              <Link
                key={t.key}
                to={route}
                className="glass-card-hover rounded-xl p-4 flex items-center gap-3 group transition-transform hover:scale-[1.02]"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${t.color}1a`, border: `1px solid ${t.color}40` }}
                >
                  <Icon size={16} style={{ color: t.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground">Gestionar →</p>
                </div>
                <Plus size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
