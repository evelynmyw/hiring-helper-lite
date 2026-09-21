import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { listPublicJobs } from "@/lib/api";

export const Route = createFileRoute("/apply/")({
  head: () => ({
    meta: [
      { title: "Open Positions — Tara Careers" },
      {
        name: "description",
        content: "Browse our open positions and apply in a couple of minutes.",
      },
      { property: "og:title", content: "Open Positions — Tara Careers" },
      {
        property: "og:description",
        content: "Browse our open positions and apply in a couple of minutes.",
      },
    ],
  }),
  component: ApplyListPage,
});

function ApplyListPage() {
  const jobs = useQuery({ queryKey: ["public-jobs"], queryFn: listPublicJobs });
  const list = jobs.data ?? [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Open positions</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Find a role that fits and send us your resume.
      </p>

      {jobs.isPending && (
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {jobs.isError && (
        <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/10 p-6">
          <p className="text-sm text-destructive">
            Something went wrong, please try again.
          </p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => void jobs.refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {jobs.isSuccess && list.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          No open positions right now.
        </p>
      )}

      {list.length > 0 && (
        <div className="mt-8 space-y-4">
          {list.map((job) => (
            <Link
              key={job.job_id}
              to="/apply/$jobId"
              params={{ jobId: job.job_id }}
              className="block rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <h2 className="text-base font-semibold">{job.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {job.dept} · {job.type}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
