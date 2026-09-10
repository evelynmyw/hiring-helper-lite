import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, LogIn, UserPlus } from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable/index";
import { signInWithPassword, signUpWithPassword } from "@/lib/auth";
import taraLogo from "../assets/tara-hand-eye-logo.png";

type Search = { redirect?: string | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect:
      typeof search["redirect"] === "string"
        ? (search["redirect"] as string)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Tara" },
      {
        name: "description",
        content:
          "Sign in to Tara to access your recruiting dashboard, candidate search and resume screening.",
      },
      { property: "og:title", content: "Sign in — Tara" },
      {
        property: "og:description",
        content: "Sign in to your Tara recruiting workspace.",
      },
    ],
  }),
  component: AuthPage,
});

const inputClass =
  "w-full rounded-lg border border-input bg-cream px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

function AuthPage() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === "signed-in") {
      void navigate({ to: redirect ?? "/dashboard", replace: true });
    }
  }, [status, navigate, redirect]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setNotice(null);
    setPending(true);
    try {
      if (mode === "login") {
        await signInWithPassword(email.trim(), password);
      } else {
        const { needsConfirmation } = await signUpWithPassword(
          email.trim(),
          password,
          name.trim(),
        );
        if (needsConfirmation) {
          setNotice(
            "Check your inbox to confirm your email, then come back and log in.",
          );
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong, please try again",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleOAuth(provider: "google" | "microsoft") {
    setError(null);
    setNotice(null);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(
        `${provider === "google" ? "Google" : "Microsoft"} sign-in failed, please try again.`,
      );
    }
  }

  return (
    <main className="landing-bg flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-current/20 bg-cream shadow-sm">
        <div className="px-7 pb-7 pt-8">
        <div className="mb-7 flex items-center justify-center gap-2">
          <img
            src={taraLogo}
            alt="Tara"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <p className="font-serif text-2xl italic tracking-[0.08em] text-highlight">TARA</p>
        </div>
        <h1 className="landing-ink text-center text-2xl font-semibold tracking-tight">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to your Tara workspace."
            : "Every recruiter gets their own account."}
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={() => void handleOAuth("google")}
          className="mt-7 h-10 w-full rounded-lg"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => void handleOAuth("microsoft")}
          className="mt-3 h-10 w-full rounded-lg"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path fill="#F25022" d="M1 1h10.5v10.5H1z" />
            <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z" />
            <path fill="#00A4EF" d="M1 12.5h10.5V23H1z" />
            <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z" />
          </svg>
          Continue with Microsoft
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border/60" />
          or
          <span className="h-px flex-1 bg-border/60" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Evelyn"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="At least 8 characters"
              className={inputClass}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {notice && (
            <p className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm text-foreground">
              {notice}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="landing-ink h-10 w-full rounded-lg border border-current bg-transparent hover:bg-foreground/5"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "login" ? (
              <LogIn className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>
        </div>
        <div className="border-t border-border bg-cream/80 px-7 py-5">
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? "New to Tara?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
              setNotice(null);
            }}
             className="landing-ink font-semibold underline-offset-4 hover:underline"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
        </div>
      </div>
    </main>
  );
}
