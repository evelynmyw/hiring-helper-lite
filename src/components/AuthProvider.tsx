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

import {
  clearToken,
  fetchMe,
  logoutRequest,
  setToken,
  type AuthUser,
} from "@/lib/auth";

type Status = "loading" | "signed-in" | "signed-out";

type AuthContextValue = {
  user: AuthUser | null;
  status: Status;
  signIn: (token: string, user: AuthUser) => void;
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
    fetchMe().then((me) => {
      if (!active) return;
      setUser(me);
      setStatus(me ? "signed-in" : "signed-out");
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback((token: string, nextUser: AuthUser) => {
    setToken(token);
    setUser(nextUser);
    setStatus("signed-in");
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setStatus("signed-out");
    clearToken();
    await logoutRequest();
  }, []);

  const value = useMemo(
    () => ({ user, status, signIn, signOut }),
    [user, status, signIn, signOut],
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
        <div className="glass h-10 w-48 animate-pulse rounded-xl" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass h-28 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
