import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, Search } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recruiting Assistant — AI-Powered Talent Scout" },
      {
        name: "description",
        content:
          "Search and score candidates with an AI recruiting assistant. Natural-language candidate search and explainable resume screening.",
      },
      {
        property: "og:title",
        content: "Recruiting Assistant — AI-Powered Talent Scout",
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
    <main className="relative flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 pb-16 pt-16 text-center sm:pt-24">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Find the right talent,{" "}
          <span className="flare-text">faster.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          A lightweight recruiting assistant that understands natural-language
          queries and scores every resume with a transparent breakdown.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/chat"
            className="flare-gradient inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_-18px_var(--sappan-rose)] transition-opacity hover:opacity-90"
          >
            <Search className="h-4 w-4" />
            Search candidates
          </Link>
          <Link
            to="/screening"
            className="glass flare-ring inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_var(--sappan-rose)]"
          >
            <ClipboardCheck className="h-4 w-4" />
            Screen resumes
          </Link>
        </div>
      </section>

    </main>
  );
}
