import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/components/AuthProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tara" },
      {
        name: "description",
        content: "Internal recruiting assistant: candidate search and resume scoring.",
      },
      { property: "og:title", content: "Tara" },
      {
        property: "og:description",
        content: "Internal recruiting assistant: candidate search and resume scoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <div className="relative z-10 flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 h-16 border-b border-border bg-card/95 backdrop-blur-sm">

        <div className="mx-auto flex h-full max-w-5xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">
              TARA
            </span>
          </Link>
          <MainNav />
          <ThemeToggle />

        </div>
      </header>

      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const tabColors = ["tab-gray", "tab-pink", "tab-cream", "tab-sand", "tab-peach"];

function FolderTab({
  to,
  color,
  exact,
  children,
}: {
  to: string;
  color: string;
  exact?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`folder-tab ${color}`}
      activeOptions={{ exact: exact ?? false }}
    >
      {children}
    </Link>
  );
}

function MainNav() {
  const { status } = useAuth();

  const links: { to: string; label: string; exact?: boolean }[] =
    status === "signed-in"
      ? [
          { to: "/", label: "Home", exact: true },
          { to: "/dashboard", label: "Dashboard" },
          { to: "/chat", label: "Candidate Search" },
          { to: "/screening", label: "Resume Screening" },
        ]
      : [{ to: "/", label: "Home", exact: true }];

  return (
    <nav className="folder-tabs self-end" aria-label="Main navigation">
      {links.map((link, i) => (
        <FolderTab
          key={link.to}
          to={link.to}
          exact={link.exact}
          color={tabColors[i % tabColors.length] ?? "tab-gray"}
        >
          {link.label}
        </FolderTab>
      ))}
    </nav>
  );
}

