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

const ROW_ONE = [
  "PRODUCT DESIGNER",
  "FRONTEND ENGINEER",
  "DATA ANALYST",
  "HR MANAGER",
];

const ROW_TWO = [
  "ACCOUNT EXECUTIVE",
  "UX RESEARCHER",
  "GROWTH MARKETER",
  "OPERATIONS LEAD",
];

function MarqueeRow({
  words,
  direction,
  startIndex,
}: {
  words: string[];
  direction: "left" | "right";
  startIndex: number;
}) {
  const items = [...words, ...words];
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none overflow-hidden whitespace-nowrap"
    >
      <div
        className={`flex w-max items-baseline gap-8 pr-8 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {items.map((word, i) => (
          <span key={i} className="flex items-baseline gap-8">
            <span className="landing-ink text-sm font-medium tracking-widest">
              ({String(startIndex + (i % words.length)).padStart(2, "0")})
            </span>
            <span
              className={`text-[clamp(3rem,9vw,7.5rem)] font-extrabold uppercase leading-none tracking-tight ${
                i % 2 === 0 ? "landing-ink" : "landing-ink-outline"
              }`}
            >
              {word}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function LandingPage() {
  const { status } = useAuth();

  return (
    <main className="landing-bg flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden">
      <MarqueeRow words={ROW_ONE} direction="left" startIndex={1} />

      <section className="flex flex-1 flex-col items-center justify-center px-4 py-14 text-center">
        <p className="landing-ink text-sm font-medium tracking-[0.25em]">
          (05) — TARA
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Find the right talent,{" "}
          <span className="landing-ink">faster.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          A lightweight recruiting assistant that understands natural-language
          queries and scores every resume with a transparent breakdown.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to={status === "signed-in" ? "/dashboard" : "/auth"}
            className="landing-ink inline-flex items-center justify-center gap-2 rounded-lg border border-current bg-transparent px-8 py-3 text-sm font-semibold transition-colors hover:bg-foreground/5"
          >
            <LogIn className="h-4 w-4" />
            {status === "signed-in" ? "Go to dashboard" : "Log in"}
          </Link>
        </div>
      </section>

      <MarqueeRow words={ROW_TWO} direction="right" startIndex={5} />
    </main>
  );
}
