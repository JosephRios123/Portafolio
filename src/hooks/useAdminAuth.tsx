import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthCtx {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AdminAuthCtx>({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
  authError: null,
  signOut: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const validationId = useRef(0);

  useEffect(() => {
    const validateSession = async (nextSession: Session | null) => {
      const currentValidation = ++validationId.current;
      setSession(nextSession);
      setAuthError(null);

      if (!nextSession) {
        setIsAdmin(false);
        setRoleLoading(false);
        setSessionLoading(false);
        return;
      }

      setRoleLoading(true);
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user || userData.user.id !== nextSession.user.id) {
          throw new Error("Invalid session");
        }

        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (error) throw error;
        if (currentValidation === validationId.current) setIsAdmin(Boolean(data));
      } catch {
        if (currentValidation === validationId.current) {
          setIsAdmin(false);
          setAuthError("No se pudieron verificar los permisos del panel. Intenta de nuevo.");
        }
      } finally {
        if (currentValidation === validationId.current) {
          setRoleLoading(false);
          setSessionLoading(false);
        }
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      // Defer network calls until the auth callback releases its internal lock.
      setTimeout(() => void validateSession(sess), 0);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      void validateSession(sess);
    });

    return () => {
      validationId.current += 1;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setAuthError(null);
  };

  const loading = sessionLoading || (!!session && roleLoading);

  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, isAdmin, loading, authError, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAdminAuth = () => useContext(Ctx);
