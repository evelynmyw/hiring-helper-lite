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
import taraLogo from "@/assets/tara-logo.png";

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
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
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

const navLink =
  "relative rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="aurora-blob"
          style={{
            top: "-18%",
            left: "-12%",
            width: "60vw",
            height: "60vw",
            background: "var(--sappan-rose)",
            opacity: 0.18,
            animation: "blob-a 18s ease-in-out infinite alternate",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            top: "-10%",
            right: "-15%",
            width: "55vw",
            height: "55vw",
            background: "var(--wild-plum)",
            opacity: 0.16,
            animation: "blob-b 22s ease-in-out infinite alternate",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            bottom: "-25%",
            left: "20%",
            width: "65vw",
            height: "55vw",
            background: "var(--rose-rice)",
            opacity: 0.55,
            animation: "blob-c 26s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, transparent 20%, var(--background) 110%)",
          }}
        />

      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 h-16 border-b border-border/60 bg-background/70 backdrop-blur-md">

        <div className="mx-auto flex h-full max-w-5xl items-center gap-6 px-4">
          <img
            src={taraLogo}
            alt="Tara"
            className="h-14 w-auto"
          />
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={navLink}
              activeProps={{
                className:
                  "flare-ring bg-secondary/60 text-foreground shadow-[0_8px_24px_-14px_var(--sappan-rose)]",
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={navLink}
              activeProps={{
                className:
                  "flare-ring bg-secondary/60 text-foreground shadow-[0_8px_24px_-14px_var(--sappan-rose)]",
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/chat"
              className={navLink}
              activeProps={{
                className:
                  "flare-ring bg-secondary/60 text-foreground shadow-[0_8px_24px_-14px_var(--sappan-rose)]",
              }}
            >
              Candidate Search
            </Link>
            <Link
              to="/screening"
              className={navLink}
              activeProps={{
                className:
                  "flare-ring bg-secondary/60 text-foreground shadow-[0_8px_24px_-14px_var(--sappan-rose)]",
              }}
            >
              Resume Screening
            </Link>
            <Link
              to="/login"
              className={navLink}
              activeProps={{
                className:
                  "flare-ring bg-secondary/60 text-foreground shadow-[0_8px_24px_-14px_var(--sappan-rose)]",
              }}
            >
              Sign in
            </Link>
          </nav>
          <ThemeToggle />

        </div>
      </header>

      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      </div>
    </QueryClientProvider>
  );
}

