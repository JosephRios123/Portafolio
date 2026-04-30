import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Briefcase, History, Brain, GraduationCap, LogOut, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const items = [
  { to: "/admin/projects",   label: "Proyectos",   icon: Briefcase },
  { to: "/admin/experience", label: "Experiencia", icon: History },
  { to: "/admin/mindset",    label: "Mentalidad",  icon: Brain },
  { to: "/admin/formations", label: "Formación",   icon: GraduationCap },
];

export default function AdminLayout() {
  const { session, isAdmin, loading, user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) navigate("/admin/login", { replace: true });
  }, [loading, session, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (!session || !isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/60 flex flex-col" style={{ background: "hsl(var(--surface))" }}>
        <div className="p-6 border-b border-border/60">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} className="text-accent" />
            <span className="font-black text-foreground">Admin</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/60 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <ExternalLink size={14} /> Ver portafolio
          </a>
          <button
            onClick={() => { signOut(); navigate("/admin/login"); }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
