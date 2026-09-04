import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Briefcase,
  Calendar,
  ClipboardCheck,
  Gift,
  Globe,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

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
        <p className="flare-text text-sm font-bold uppercase tracking-[0.18em]">
          Tara
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Applicant tracking
        </p>
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

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2">
        <span className="flare-gradient flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
          E
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-foreground">Evelyn</p>
          <p className="text-xs text-muted-foreground">User</p>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto flex w-full max-w-7xl gap-6 px-4"
      style={{ ["--sidebar-width" as string]: "16rem" }}
    >
      <AppSidebar />
      <main className="min-w-0 flex-1 py-8">{children}</main>
    </div>
  );
}
