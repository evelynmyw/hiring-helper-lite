import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, getPublicJob, submitApplication } from "@/lib/api";

export const Route = createFileRoute("/apply/$jobId")({
  head: () => ({
    meta: [
      { title: "Apply — Tara Careers" },
      {
        name: "description",
        content: "Read the role description and submit your application with your resume.",
      },
      { property: "og:title", content: "Apply — Tara Careers" },
      {
        property: "og:description",
        content: "Read the role description and submit your application with your resume.",
      },
    ],
  }),
  component: ApplyJobPage,
});

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = [".pdf", ".docx", ".txt"];

function validateFile(file: File): string | null {
  const name = file.name.toLowerCase();
  if (!ALLOWED.some((ext) => name.endsWith(ext)))
    return "Please upload a .pdf, .docx or .txt file.";
  if (file.size > MAX_BYTES) return "Your file is larger than 5 MB.";
  return null;
}

function friendlyError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 404) return "This position is no longer open.";
    if (e.status === 429) return "Too many applications, please try again later.";
    if (e.status === 413 || e.status === 415 || e.status === 422) return e.message;
    return "Something went wrong, please try again.";
  }
  return "Something went wrong, please try again.";
}

function ApplyJobPage() {
  const { jobId } = Route.useParams();
  const job = useQuery({
    queryKey: ["public-job", jobId],
    queryFn: () => getPublicJob(jobId),
    retry: false,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [gone, setGone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ replaced: boolean } | null>(null);

  const jobMissing =
    job.isError && job.error instanceof ApiError && job.error.status === 404;

  async function submit() {
    setFormError(null);
    setFieldError(null);

    if (!name.trim()) return setFieldError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setFieldError("Please enter a valid email address.");
    if (!file) return setFieldError("Please attach your resume.");
    const fileIssue = validateFile(file);
    if (fileIssue) return setFieldError(fileIssue);

    setSubmitting(true);
    try {
      const res = await submitApplication(jobId, {
        name: name.trim(),
        email: email.trim(),
        resume: file,
      });
      setDone({ replaced: res.replaced_previous });
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) setGone(true);
      setFormError(friendlyError(e));
    } finally {
      setSubmitting(false);
    }
  }

  if (job.isPending) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-40 animate-pulse rounded bg-muted" />
      </main>
    );
  }

  if (jobMissing) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold">This position is no longer open.</h1>
        <Link to="/apply" className="mt-4 inline-block text-sm text-primary hover:underline">
          See all open positions
        </Link>
      </main>
    );
  }

  if (job.isError || !job.data) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <p className="text-sm text-destructive">
          Something went wrong, please try again.
        </p>
        <Button variant="outline" className="mt-3" onClick={() => void job.refetch()}>
          Retry
        </Button>
      </main>
    );
  }

  const data = job.data;

  if (done) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">
          Thanks, your application has been received.
        </h1>
        {done.replaced && (
          <p className="mt-2 text-sm text-muted-foreground">
            We replaced your earlier resume for this role with this one.
          </p>
        )}
        <Link to="/apply" className="mt-6 inline-block text-sm text-primary hover:underline">
          See other open positions
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <Link to="/apply" className="text-sm text-primary hover:underline">
        ← All open positions
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight">{data.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {data.dept} · {data.type}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        {data.location}
      </p>

      {data.description && (
        <p className="mt-6 leading-relaxed text-muted-foreground">{data.description}</p>
      )}

      {!!data.responsibilities?.length && (
        <section className="mt-6">
          <h2 className="mb-2 font-semibold">Responsibilities</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {data.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {!!data.requirements?.length && (
        <section className="mt-6">
          <h2 className="mb-2 font-semibold">Requirements</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {data.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Apply for this role</h2>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="applicant-name">Full name *</Label>
            <Input
              id="applicant-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="applicant-email">Email *</Label>
            <Input
              id="applicant-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="applicant-resume">Resume * (.pdf, .docx or .txt, max 5 MB)</Label>
            <Input
              id="applicant-resume"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                const picked = e.target.files?.[0] ?? null;
                setFile(picked);
                setFieldError(picked ? validateFile(picked) : null);
              }}
            />
          </div>

          {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
          {formError && (
            <div className="text-sm text-destructive">
              <p>{formError}</p>
              {gone && (
                <Link to="/apply" className="mt-1 inline-block underline">
                  See all open positions
                </Link>
              )}
            </div>
          )}

          <Button onClick={() => void submit()} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitting ? "Submitting your application…" : "Submit application"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Processing your resume takes a few seconds — please stay on this page.
          </p>
        </div>
      </section>
    </main>
  );
}
