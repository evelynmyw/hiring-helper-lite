import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Gem,
  Loader,
  Lock,
  Mail,
  PartyPopper,
  X,
} from "lucide-react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...props}>
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1a6.2 6.2 0 1 1 0-12.4c1.8 0 3 .77 3.7 1.43l2.5-2.4A9.6 9.6 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4.1 9.6-9.8 0-.66-.07-1.2-.17-1.7H12Z"
    />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.02 1.59 1.02 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

const DefaultLogo = () => (
  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--sappan-rose)] to-[var(--inked-violet)] text-white">
    <Gem className="h-4 w-4" />
  </div>
);

type Step = "email" | "password";
type ModalStatus = "closed" | "loading" | "error" | "success";

export interface AuthComponentProps {
  logo?: React.ReactNode;
  brandName?: string;
  onSubmit?: (values: { email: string; password: string }) => Promise<void> | void;
}

export const AuthComponent = ({
  logo = <DefaultLogo />,
  brandName = "Recruiting Assistant",
  onSubmit,
}: AuthComponentProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [modalStatus, setModalStatus] = useState<ModalStatus>("closed");
  const [modalError, setModalError] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;

  useEffect(() => {
    if (step === "password") setTimeout(() => passwordRef.current?.focus(), 350);
  }, [step]);

  const fireConfetti = async () => {
    if (typeof window === "undefined") return;
    const confetti = (await import("canvas-confetti")).default;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    confetti({ ...defaults, particleCount: 50, origin: { x: 0, y: 1 }, angle: 60 });
    confetti({ ...defaults, particleCount: 50, origin: { x: 1, y: 1 }, angle: 120 });
  };

  const handleContinue = async () => {
    if (step === "email") {
      if (isEmailValid) setStep("password");
      return;
    }
    if (!isPasswordValid || modalStatus !== "closed") return;
    setModalStatus("loading");
    try {
      if (onSubmit) await onSubmit({ email, password });
      else await new Promise((r) => setTimeout(r, 1200));
      setModalStatus("success");
      void fireConfetti();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Sign in failed, please try again.");
      setModalStatus("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleContinue();
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 flex items-center gap-3">
        {logo}
        <span className="text-lg font-semibold tracking-tight text-foreground">{brandName}</span>
      </div>

      <div className="glass w-full max-w-md rounded-3xl border border-border/60 p-8 shadow-[0_30px_80px_-40px_var(--inked-violet)] backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.28 }}
          >
            <h1 className="flare-text text-2xl font-bold tracking-tight">
              {step === "email" ? "Welcome back" : "Enter your password"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === "email"
                ? "Sign in to continue to your recruiting workspace."
                : `Signing in as ${email}`}
            </p>
          </motion.div>
        </AnimatePresence>

        {step === "email" && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
            >
              <GitHubIcon /> GitHub
            </button>
          </div>
        )}

        {step === "email" && (
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
        )}

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void handleContinue();
          }}
        >
          {step === "email" ? (
            <label className="flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-3 transition-colors focus-within:border-[var(--sappan-rose)]">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </label>
          ) : (
            <label className="flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-3 transition-colors focus-within:border-[var(--sappan-rose)]">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="At least 6 characters"
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </label>
          )}

          <button
            type="submit"
            disabled={step === "email" ? !isEmailValid : !isPasswordValid}
            className={cn(
              "flare-gradient text-white group flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {step === "email" ? "Continue" : "Sign in"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          {step === "password" && (
            <button
              type="button"
              onClick={() => setStep("email")}
              className="mx-auto flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Go back
            </button>
          )}
        </form>
      </div>

      <AnimatePresence>
        {modalStatus !== "closed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 10 }}
              className="glass relative w-full max-w-sm rounded-3xl border border-border/60 p-8 text-center"
            >
              {modalStatus !== "loading" && (
                <button
                  type="button"
                  onClick={() => setModalStatus("closed")}
                  className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {modalStatus === "loading" && (
                <div className="flex flex-col items-center gap-3">
                  <Loader className="h-6 w-6 animate-spin text-[var(--sappan-rose)]" />
                  <p className="text-sm font-medium text-foreground">Signing you in...</p>
                </div>
              )}
              {modalStatus === "error" && (
                <div className="flex flex-col items-center gap-3">
                  <AlertCircle className="h-7 w-7 text-destructive" />
                  <p className="text-sm font-medium text-foreground">{modalError}</p>
                </div>
              )}
              {modalStatus === "success" && (
                <div className="flex flex-col items-center gap-3">
                  <PartyPopper className="h-7 w-7 text-[var(--sappan-rose)]" />
                  <p className="text-sm font-medium text-foreground">Welcome aboard!</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthComponent;
