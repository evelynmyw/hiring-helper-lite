import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RequireAuth } from "@/components/AuthProvider";
import {
  getCandidateDocument,
  readCachedCandidate,
  type CandidateDocument,
  type ScreenedCandidate,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/candidates/$documentId")({
  head: () => ({
    meta: [
      { title: "Candidate Resume — Tara" },
      {
        name: "description",
        content:
          "Full resume content for a screened candidate, alongside the AI score breakdown.",
      },
      { property: "og:title", content: "Candidate Resume — Tara" },
      {
        property: "og:description",
        content: "Full resume text and explainable scoring for one candidate.",
      },
    ],
  }),
  component: GuardedCandidatePage,
});

function scoreTone(score: number) {
  if (score > 60) return "text-success";
  if (score >= 35) return "text-warning";
  return "text-destructive";
}

function CandidatePage() {
  const { documentId } = Route.useParams();
  const [doc, setDoc] = useState<CandidateDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState<{
    candidate: ScreenedCandidate;
    jobTitle: string;
  } | null>(null);

  useEffect(() => {
    setCached(readCachedCandidate(documentId));
    let active = true;
    setLoading(true);
    setError(null);
    getCandidateDocument(documentId)
      .then((d) => active && setDoc(d))
      .catch(() => active && setError("Couldn't load this resume, please try again."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [documentId]);

  const name =
    doc?.name?.trim() ||
    cached?.candidate.name?.trim() ||
    doc?.email?.trim() ||
    cached?.candidate.email?.trim() ||
    documentId.slice(0, 8);
  const email = doc?.email?.trim() || cached?.candidate.email?.trim();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link
        to="/screening"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to screening
      </Link>

      <div className="glass flare-ring mt-4 rounded-2xl p-5">
        <h1 className="flare-text text-3xl font-bold tracking-tight">{name}</h1>
        {email && <p className="mt-1 text-sm text-muted-foreground">{email}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          Document ID: {documentId}
        </p>
        {cached && (
          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span
              className={cn(
                "text-2xl font-bold",
                scoreTone(cached.candidate.overall_score),
              )}
            >
              {cached.candidate.overall_score.toFixed(1)}
              <span className="text-sm font-medium text-muted-foreground">/100</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Rank #{cached.candidate.rank} for {cached.jobTitle}
            </span>
          </div>
        )}
      </div>

      {cached && (
        <div className="glass mt-6 rounded-2xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Score breakdown
          </h2>
          <div className="mt-3 space-y-3">
            {cached.candidate.breakdown.map((b) => (
              <div key={b.criterion} className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">{b.criterion}</span>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {b.earned_points} / {b.max_points}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                  {b.reasoning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass flare-ring mt-6 rounded-2xl p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Full resume
        </h2>
        {loading && (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading resume…
          </div>
        )}
        {!loading && error && (
          <p className="mt-3 rounded-xl border border-destructive/40 bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
        {!loading && !error && (
          <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
            {doc?.content?.trim() || "No resume content available for this candidate."}
          </pre>
        )}
      </div>
    </div>
  );
}

function GuardedCandidatePage() {
  return (
    <RequireAuth>
      <CandidatePage />
    </RequireAuth>
  );
}
