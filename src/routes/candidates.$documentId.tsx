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

type ResumeEntry =
  | { kind: "text"; text: string; strong: boolean }
  | { kind: "bullets"; items: string[] };
type ResumeBlock = { header: string | null; entries: ResumeEntry[] };

const BULLET_RE = /^[•●▪*·-]\s+/;
const YEAR_RE = /\b(19|20)\d{2}\b/;

function isSectionHeader(line: string) {
  if (line.length < 3 || line.length > 60) return false;
  const letters = line.replace(/[^A-Za-z]/g, "");
  return letters.length >= 2 && letters === letters.toUpperCase();
}

function titleCaseHeader(line: string) {
  return line
    .toLowerCase()
    .replace(/(^|[\s/])([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

function parseResume(content: string): ResumeBlock[] {
  const blocks: ResumeBlock[] = [];
  let current: ResumeBlock | null = null;
  for (const raw of content.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (isSectionHeader(line)) {
      current = { header: titleCaseHeader(line), entries: [] };
      blocks.push(current);
      continue;
    }
    if (!current) {
      current = { header: null, entries: [] };
      blocks.push(current);
    }
    if (BULLET_RE.test(line)) {
      const text = line.replace(BULLET_RE, "");
      const last = current.entries[current.entries.length - 1];
      if (last && last.kind === "bullets") last.items.push(text);
      else current.entries.push({ kind: "bullets", items: [text] });
      continue;
    }
    current.entries.push({ kind: "text", text: line, strong: YEAR_RE.test(line) });
  }
  return blocks;
}

function ResumeText({ content }: { content: string }) {
  const blocks = parseResume(content);
  return (
    <div className="mt-3 space-y-7 text-sm leading-relaxed">
      {blocks.map((block, bi) => (
        <section key={bi}>
          {block.header && (
            <h3 className="mb-3 border-b border-border pb-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              {block.header}
            </h3>
          )}
          <div className="space-y-2">
            {block.entries.map((entry, ei) =>
              entry.kind === "bullets" ? (
                <ul key={ei} className="space-y-1.5">
                  {entry.items.map((item, ii) => (
                    <li key={ii} className="relative pl-4 text-foreground/90">
                      <span className="absolute left-0 top-0 text-primary/60">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  key={ei}
                  className={cn(
                    entry.strong
                      ? "font-semibold text-foreground"
                      : "text-foreground/90",
                  )}
                >
                  {entry.text}
                </p>
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
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

       <div className="glass mt-4 rounded-lg p-5">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">{name}</h1>
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
         <div className="glass mt-6 rounded-lg p-5">
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

       <div className="glass mt-6 rounded-lg p-5">
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
          doc?.content?.trim() ? (
            <ResumeText content={doc.content} />
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No resume content available for this candidate.
            </p>
          )
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
