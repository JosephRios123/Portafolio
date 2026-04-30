import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Briefcase, History, Brain, GraduationCap, LogOut, ExternalLink, ShieldCheck, Menu, X, LayoutDashboard } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useIsMobile } from "@/hooks/use-mobile";

const items = [
  { to: "/admin",            label: "Dashboard",   icon: LayoutDashboard, exact: true },
  { to: "/admin/projects",   label: "Proyectos",   icon: Briefcase },
  { to: "/admin/experience", label: "Experiencia", icon: History },
  { to: "/admin/mindset",    label: "Mentalidad",  icon: Brain },
  { to: "/admin/formations", label: "Formación",   icon: GraduationCap },
];

function titleFromPath(p: string) {
  return items.find((i) => (i.exact ? p === i.to : p.startsWith(i.to)))?.label ?? "Admin";
}

function initials(email?: string | null) {
  if (!email) return "A";
  return email.slice(0, 2).toUpperCase();
}

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Esc closes drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const SidebarInner = (
    <>
      <div className="p-5 sm:p-6 border-b border-border/60">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-accent" />
          <span className="font-black text-foreground">Admin</span>
        </div>
        <p className="text-xs text-muted-foreground font-mono truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
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

      <div className="p-4 border-t border-border/60 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-accent transition-colors min-h-[44px]"
        >
          <ExternalLink size={14} /> Ver portafolio
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-destructive transition-colors min-h-[44px]"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:w-64 border-r border-border/60 flex-col shrink-0"
        style={{ background: "hsl(var(--surface))" }}
      >
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {isMobile && drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col md:hidden border-r border-border/60 animate-slide-in-right"
            style={{ background: "hsl(var(--surface))", animation: "slide-in-left 0.25s ease-out" }}
          >
            {SidebarInner}
          </aside>
        </>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 lg:px-8 border-b border-border/60 backdrop-blur-xl"
          style={{ background: "hsl(var(--surface) / 0.85)" }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden touch-target inline-flex items-center justify-center rounded-lg text-foreground hover:bg-muted/50"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-sm sm:text-base font-bold text-foreground truncate flex-1">{titleFromPath(pathname)}</h2>
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-background"
              style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}
              title={user?.email ?? ""}
            >
              {initials(user?.email)}
            </div>
            <button
              onClick={handleLogout}
              className="md:hidden touch-target inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted/50"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
