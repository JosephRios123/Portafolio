import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { session, isAdmin, loading, authError } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Reactive redirect — single source of truth
  useEffect(() => {
    if (!loading && session && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [loading, session, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    toast.success("Credenciales verificadas");
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background overflow-x-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-4 sm:mb-5"
            style={{
              background: "linear-gradient(135deg, hsl(217 91% 60% / 0.15), hsl(187 92% 42% / 0.15))",
              border: "1px solid hsl(217 91% 60% / 0.3)",
            }}>
            <ShieldCheck size={26} className="text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Panel Admin</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-2 font-mono">Acceso restringido</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">
          {authError && (
            <div role="alert" className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{authError}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              <Mail size={14} className="inline mr-1.5 text-accent" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              <Lock size={14} className="inline mr-1.5 text-accent" /> Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-background disabled:opacity-60 min-h-[48px]"
            style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}
          >
            {busy ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
