import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tara — AI-Powered Talent Scout" },
      {
        name: "description",
        content:
          "Search and score candidates with an AI recruiting assistant. Natural-language candidate search and explainable resume screening.",
      },
      {
        property: "og:title",
        content: "Tara — AI-Powered Talent Scout",
      },
      {
        property: "og:description",
        content:
          "Search and score candidates with an AI recruiting assistant.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      {/* Animated solar flare flow backdrop */}
      <div aria-hidden className="solar-flow" />

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Find the right talent,{" "}
          <span className="flare-text">faster.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          A lightweight recruiting assistant that understands natural-language
          queries and scores every resume with a transparent breakdown.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/dashboard"
            className="glass flare-ring inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_var(--sappan-rose)]"
          >
            <LogIn className="h-4 w-4" />
            Log in
          </Link>
        </div>
      </section>

    </main>
  );
}

