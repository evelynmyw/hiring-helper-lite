import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";

import { useAuth } from "@/components/AuthProvider";

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
  const { status } = useAuth();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Find the right talent,{" "}
          <span className="text-primary">faster.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          A lightweight recruiting assistant that understands natural-language
          queries and scores every resume with a transparent breakdown.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to={status === "signed-in" ? "/dashboard" : "/auth"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <LogIn className="h-4 w-4" />
            {status === "signed-in" ? "Go to dashboard" : "Log in"}
          </Link>
        </div>
      </section>

    </main>
  );
}

