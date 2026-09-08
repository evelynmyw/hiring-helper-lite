import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Briefcase,
  Calendar,
  ClipboardCheck,
  Gift,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import taraLogo from "../assets/tara-logo.png";
import { RequireAuth, useAuth } from "@/components/AuthProvider";
import { initials } from "@/lib/auth";

type NavItem = {
  label: string;
  icon: LucideIcon;
  to?:
    | "/dashboard"
    | "/chat"
    | "/screening"
    | "/jobs"
    | "/employees"
    | "/schedule"
    | "/analytics";
  exact?: boolean;
};

const NAV: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Jobs", icon: Briefcase, to: "/jobs" },
  { label: "Candidates", icon: Users, to: "/chat" },
  { label: "Screening", icon: ClipboardCheck, to: "/screening" },
  { label: "Employee", icon: UserRound, to: "/employees" },
  { label: "Promotion", icon: Gift },
  { label: "Message", icon: MessageSquare },
  { label: "Schedule", icon: Calendar, to: "/schedule" },
  { label: "Analytics", icon: BarChart3, to: "/analytics" },
  { label: "Career site", icon: Globe },
  { label: "Help Center", icon: HelpCircle },
  { label: "Settings", icon: Settings },
];

const itemBase =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all";

export function AppSidebar() {
  return (
    <aside className="glass sticky top-16 hidden h-[calc(100vh-4rem)] w-[var(--sidebar-width)] shrink-0 flex-col overflow-y-auto rounded-r-2xl p-3 md:flex">
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <img
            src={taraLogo}
            alt="Tara"
            className="h-7 w-7 rounded-lg object-contain"
          />
          <div>
            <p className="flare-text text-sm font-bold uppercase tracking-[0.18em]">
              Tara
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Applicant tracking
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ label, icon: Icon, to }) =>
          to ? (
            <Link
              key={label}
              to={to}
              className={`${itemBase} text-muted-foreground hover:bg-secondary/50 hover:text-foreground`}
              activeProps={{
                className: `${itemBase} flare-ring bg-secondary/70 text-foreground shadow-[0_8px_24px_-16px_var(--sappan-rose)]`,
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ) : (
            <span
              key={label}
              aria-disabled
              className={`${itemBase} cursor-not-allowed text-muted-foreground/60`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </span>
          ),
        )}
      </nav>

      <UserCard />
    </aside>
  );
}

function UserCard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    await navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2">
      <span className="flare-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
        {initials(user)}
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-medium text-foreground">
          {user?.name?.trim() || user?.email || "Signed in"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user?.email ?? ""}
        </p>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Log out"
        title="Log out"
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div
        className="mx-auto flex w-full max-w-7xl gap-6 px-4"
        style={{ ["--sidebar-width" as string]: "16rem" }}
      >
        <AppSidebar />
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
