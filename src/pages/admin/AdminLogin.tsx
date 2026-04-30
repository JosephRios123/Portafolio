import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const ADMIN_EMAIL = "cresposfelices@gmail.com";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminAuth();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) navigate("/admin", { replace: true });
  }, [loading, session, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      toast.success("Bienvenido al panel");
      navigate("/admin", { replace: true });
      setBusy(false);
      return;
    }
    // First-time bootstrap: if it's the configured admin and credentials are invalid, try sign-up
    if (email === ADMIN_EMAIL) {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (signUpErr) {
        toast.error(signUpErr.message);
        setBusy(false);
        return;
      }
      // Assign admin role
      if (signUpData.user) {
        await supabase.from("user_roles").insert({ user_id: signUpData.user.id, role: "admin" });
      }
      // Try login again
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) {
        toast.error(loginErr.message);
      } else {
        toast.success("Cuenta admin creada y autenticada");
        navigate("/admin", { replace: true });
      }
    } else {
      toast.error(error.message);
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{
              background: "linear-gradient(135deg, hsl(217 91% 60% / 0.15), hsl(187 92% 42% / 0.15))",
              border: "1px solid hsl(217 91% 60% / 0.3)",
            }}>
            <ShieldCheck size={28} className="text-accent" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Panel Admin</h1>
          <p className="text-muted-foreground text-sm mt-2 font-mono">Acceso restringido</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              <Mail size={14} className="inline mr-1.5 text-accent" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
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
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-background disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))" }}
          >
            {busy ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
