import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  displayName,
  cacheScreening,
  screenCandidates,
  type ScreenResponse,
  type ScreenedCandidate,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/screening")({
  head: () => ({
    meta: [
      { title: "Resume Screening — Tara" },
      {
        name: "description",
        content:
          "Paste a job description and score every candidate in the database with an explainable point-by-point breakdown.",
      },
      { property: "og:title", content: "Resume Screening — Tara" },
      {
        property: "og:description",
        content: "Explainable candidate scoring against any job description.",
      },
    ],
  }),
  component: GuardedScreeningPage,
});

function scoreTone(score: number) {
  if (score > 60) return "text-success";
  if (score >= 35) return "text-warning";
  return "text-destructive";
}
function barTone(score: number) {
  if (score > 60) return "bg-success";
  if (score >= 35) return "bg-warning";
  return "bg-destructive";
}

function CandidateCard({ c }: { c: ScreenedCandidate }) {
  return (
    <div className="glass rounded-lg p-5">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {c.rank}
            </span>
            <Link
              to="/candidates/$documentId"
              params={{ documentId: c.document_id }}
              className="truncate text-base font-semibold hover:underline"
            >
              {displayName(c)}
            </Link>
          </div>
          {c.email && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{c.email}</p>
          )}
          <Link
            to="/candidates/$documentId"
            params={{ documentId: c.document_id }}
            className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View full resume
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="text-right">
          <div className={cn("text-3xl font-bold leading-none", scoreTone(c.overall_score))}>
            {c.overall_score.toFixed(1)}
            <span className="text-sm font-medium text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", barTone(c.overall_score))}
          style={{ width: `${Math.min(100, Math.max(0, c.overall_score))}%` }}
        />
      </div>

      <Accordion type="single" collapsible className="mt-3">
        <AccordionItem value="breakdown" className="border-none">
          <AccordionTrigger className="py-2 text-sm">
            Score breakdown ({c.breakdown.length} criteria)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {c.breakdown.map((b) => (
                <div key={b.criterion} className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium">{b.criterion}</span>
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {b.earned_points} / {b.max_points}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${b.max_points ? (b.earned_points / b.max_points) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {b.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ScreeningPage() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScreenResponse | null>(null);

  async function run() {
    if (!jd.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await screenCandidates(jd.trim());
      cacheScreening(res);
      setResult(res);
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <BackButton />
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">Resume screening</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Paste a job description. Every candidate in the database is scored against it
        with a transparent, point-by-point breakdown.
      </p>

      <div className="glass mt-6 rounded-lg p-4">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={12}
          placeholder="Paste the full job description here — responsibilities, required skills, years of experience, education…"
          className="w-full resize-y rounded-lg bg-transparent p-2 text-base leading-relaxed outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            Scoring can take 30–60 seconds.
          </span>
          <Button
            onClick={run}
            disabled={loading || !jd.trim()}
            className="rounded-lg font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Analyzing…" : "Screen Candidates"}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="glass mt-6 rounded-lg p-6 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-3 text-sm font-medium">
            Analyzing candidates against this role…
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Parsing the job description, then scoring each resume on skills,
            experience and education. This usually takes 30–60 seconds.
          </p>
        </div>
      )}


      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/15 p-4 text-sm text-destructive backdrop-blur">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="glass rounded-lg p-5">

            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Parsed role
            </p>
            <h2 className="mt-1 text-lg font-semibold">{result.job_title}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Required skills
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.required_skills.length ? (
                    result.required_skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-success"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Nice-to-have skills
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.nice_to_have_skills.length ? (
                    result.nice_to_have_skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Ranked candidates ({result.candidates.length})
            </h2>
            {result.candidates.map((c) => (
              <CandidateCard key={c.document_id} c={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function GuardedScreeningPage() {
  return (
    <RequireAuth>
      <ScreeningPage />
    </RequireAuth>
  );
}
