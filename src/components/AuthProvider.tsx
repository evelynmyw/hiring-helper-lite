import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import { loadProfile, signOutRequest, type AuthUser } from "@/lib/auth";

type Status = "loading" | "signed-in" | "signed-out";

type AuthContextValue = {
  user: AuthUser | null;
  status: Status;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;

    const apply = async (
      sessionUser:
        | { id: string; email?: string | undefined; user_metadata?: Record<string, unknown> }
        | null
        | undefined,
    ) => {
      if (!sessionUser) {
        if (!active) return;
        setUser(null);
        setStatus("signed-out");
        return;
      }
      const metaName = (sessionUser.user_metadata?.["name"] ??
        sessionUser.user_metadata?.["full_name"]) as string | undefined;
      const profile = await loadProfile(
        sessionUser.id,
        sessionUser.email ?? "",
        metaName ?? null,
      );
      if (!active) return;
      setUser(profile);
      setStatus("signed-in");
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void apply(session?.user ?? null);
    });

    void supabase.auth.getSession().then(({ data }) => {
      void apply(data.session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setStatus("signed-out");
    await signOutRequest();
  }, []);

  const value = useMemo(
    () => ({ user, status, signOut }),
    [user, status, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (status === "signed-out") {
      void navigate({
        to: "/auth",
        search: { redirect: pathname },
        replace: true,
      });
    }
  }, [status, navigate, pathname]);

  if (status !== "signed-in") {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="glass h-10 w-48 animate-pulse rounded-lg" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass h-28 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
