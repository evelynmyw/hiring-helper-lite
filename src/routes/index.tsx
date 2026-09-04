import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquareText, ClipboardCheck, Search, ArrowRight } from "lucide-react";

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

      {/* Feature cards */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/chat"
            className="group glass flare-ring rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_var(--sappan-rose)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl flare-gradient text-white shadow-lg">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Candidate search chat</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Describe the role in plain English. The assistant searches the
              resume database and explains which candidates match and why.
            </p>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Start searching
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/screening"
            className="group glass flare-ring rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_var(--sappan-rose)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl flare-gradient text-white shadow-lg">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Resume screening & scoring</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Paste a full job description. Every candidate is scored against
              the role with an explainable, criterion-by-criterion breakdown.
            </p>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Screen resumes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        <div className="glass flare-ring mt-6 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Built for local demo</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This frontend connects to a backend running on{" "}
                <code className="rounded-md bg-muted/60 px-1.5 py-0.5 text-xs font-medium">
                  localhost:8000
                </code>
                . Make sure the API is running, then choose a tool above to try
                it out.
              </p>
            </div>
            <Link
              to="/chat"
              className="flare-gradient shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Try the demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
