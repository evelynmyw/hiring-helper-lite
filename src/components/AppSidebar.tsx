import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import taraLogo from "../assets/tara-hand-eye-logo.png";
import {
  BarChart3,
  Briefcase,
  Calendar,
  ChevronUp,
  ClipboardCheck,
  Gift,
  Globe,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  RefreshCw,
  Settings,
  UserRound,
  UsersRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { RequireAuth, useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";

export function AppSidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[var(--sidebar-width)] shrink-0 flex-col overflow-y-auto border-r border-border bg-sidebar p-3 md:flex">
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <img
            src={taraLogo}
            alt="Tara"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="font-serif text-xl italic tracking-[0.08em] text-highlight">
            TARA
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ label, icon: Icon, to }) =>
          to ? (
            <Link
              key={label}
              to={to}
              className={`${itemBase} text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
              activeProps={{
                className: `${itemBase} bg-sidebar-accent text-sidebar-accent-foreground`,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="mt-3 h-auto w-full justify-start gap-3 border border-sidebar-border bg-background px-3 py-2 text-left hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
          aria-label="Open account menu"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials(user)}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-medium text-foreground">
              {user?.name?.trim() || user?.email || "Signed in"}
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {user?.email ?? ""}
            </span>
          </span>
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-60 rounded-lg border-sidebar-border bg-popover p-1.5 shadow-lg"
      >
        <DropdownMenuLabel className="flex items-center gap-3 px-2.5 py-2.5 font-normal">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {initials(user)}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate font-semibold text-popover-foreground">
              {user?.name?.trim() || user?.email || "Signed in"}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {user?.email ?? ""}
            </span>
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <AccountMenuItem icon={UserRound} label="Profile" />
        <AccountMenuItem icon={Inbox} label="Inbox" />
        <AccountMenuItem icon={Settings} label="Settings" />
        <DropdownMenuSeparator />
        <AccountMenuItem icon={LifeBuoy} label="Support" />
        <AccountMenuItem icon={UsersRound} label="Community" />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => void handleSignOut()}
          className="cursor-pointer px-2.5 py-2.5"
        >
          <RefreshCw className="text-muted-foreground" />
          Switch account
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => void handleSignOut()}
          className="cursor-pointer px-2.5 py-2.5 text-destructive focus:text-destructive"
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccountMenuItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <DropdownMenuItem disabled className="px-2.5 py-2.5 opacity-100">
      <Icon className="text-muted-foreground" />
      {label}
    </DropdownMenuItem>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div
        className="mx-auto flex w-full max-w-7xl gap-8 px-4"
        style={{ ["--sidebar-width" as string]: "16rem" }}
      >
        <AppSidebar />
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
