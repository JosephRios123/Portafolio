import { Link } from "react-router-dom";
import { Briefcase, History, Brain, GraduationCap, Pencil } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "projects" | "experience" | "mindset" | "formations";
  title: string;
  updated_at: string;
}

const META: Record<ActivityItem["type"], { label: string; icon: typeof Briefcase; color: string; route: string }> = {
  projects:   { label: "Proyecto",   icon: Briefcase,     color: "hsl(217 91% 60%)", route: "/admin/projects" },
  experience: { label: "Experiencia", icon: History,      color: "hsl(187 92% 42%)", route: "/admin/experience" },
  mindset:    { label: "Mentalidad",  icon: Brain,        color: "hsl(265 85% 65%)", route: "/admin/mindset" },
  formations: { label: "Formación",   icon: GraduationCap, color: "hsl(150 70% 50%)", route: "/admin/formations" },
};

function timeAgo(iso: string) {
  const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return "ahora mismo";
  if (sec < 3600) return `hace ${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `hace ${Math.floor(sec / 3600)}h`;
  if (sec < 604800) return `hace ${Math.floor(sec / 86400)}d`;
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

export default function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-foreground">Actividad reciente</h3>
        <span className="text-xs text-muted-foreground font-mono">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Sin actividad todavía.</p>
      ) : (
        <ul className="divide-y divide-border/50">
          {items.map((it) => {
            const m = META[it.type];
            const Icon = m.icon;
            return (
              <li key={`${it.type}-${it.id}`} className="py-3 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${m.color}1a`, border: `1px solid ${m.color}40` }}
                >
                  <Icon size={15} style={{ color: m.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{it.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    <span style={{ color: m.color }}>{m.label}</span> · {timeAgo(it.updated_at)}
                  </p>
                </div>
                <Link
                  to={m.route}
                  className="touch-target inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-accent hover:bg-muted/50 transition-colors"
                  aria-label="Editar"
                >
                  <Pencil size={15} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
