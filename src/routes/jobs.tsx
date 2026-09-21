import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Briefcase,
  Check,
  Link2,
  Loader2,
  MapPin,
  Plus,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createJob,
  getJob,
  listJobs,
  updateJob,
  type Job,
} from "@/lib/api";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Open Jobs — Tara" },
      {
        name: "description",
        content:
          "Browse every open requisition, department, location and applicant volume in one place.",
      },
      { property: "og:title", content: "Open Jobs — Tara" },
      {
        property: "og:description",
        content: "Every open requisition with applicant volume and status.",
      },
    ],
  }),
  component: JobsPage,
});

const statusStyle: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Draft: "border border-border bg-secondary text-secondary-foreground",
  Closed: "bg-destructive/15 text-destructive",
};

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function NewJobDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createJob({
        title: title.trim(),
        dept: dept.trim(),
        location: location.trim(),
        type,
        description: description.trim(),
        responsibilities: toLines(responsibilities),
        requirements: toLines(requirements),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      onOpenChange(false);
      setTitle("");
      setDept("");
      setLocation("");
      setDescription("");
      setResponsibilities("");
      setRequirements("");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New job</DialogTitle>
          <DialogDescription>
            Saved as a draft. Publish it from the job details when you're ready.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="job-title">Title *</Label>
            <Input
              id="job-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Backend Engineer"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="job-dept">Department</Label>
              <Input
                id="job-dept"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="Platform"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-type">Type</Label>
              <select
                id="job-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-location">Location</Label>
            <Input
              id="job-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Stockholm · Hybrid"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-desc">Description</Label>
            <Textarea
              id="job-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-resp">Responsibilities (one per line)</Label>
            <Textarea
              id="job-resp"
              rows={4}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-req">Requirements (one per line)</Label>
            <Textarea
              id="job-req"
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">
              Could not create this job, please try again.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!title.trim() || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JobDetailDialog({
  jobId,
  onClose,
}: {
  jobId: string | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const detail = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId as string),
    enabled: !!jobId,
  });

  const statusMutation = useMutation({
    mutationFn: (changes: Partial<Job>) => updateJob(jobId as string, changes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
  });

  const job = detail.data;

  async function copyApplyLink() {
    if (!job) return;
    const url = `${window.location.origin}/apply/${job.job_id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Dialog open={!!jobId} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {detail.isPending && (
          <div className="space-y-3 py-4">
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-24 animate-pulse rounded bg-muted" />
          </div>
        )}

        {detail.isError && (
          <div className="py-4">
            <p className="text-sm text-destructive">
              Could not load this job right now.
            </p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => void detail.refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {job && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{job.title}</DialogTitle>
              <DialogDescription>
                {job.dept} · {job.type} · {job.location}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 text-sm">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusStyle[job.status] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {job.status}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {job.stage}
                </span>
              </div>

              {job.description && (
                <p className="leading-relaxed text-muted-foreground">
                  {job.description}
                </p>
              )}

              {!!job.responsibilities?.length && (
                <div>
                  <h3 className="mb-2 font-semibold">Responsibilities</h3>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {job.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!!job.requirements?.length && (
                <div>
                  <h3 className="mb-2 font-semibold">Requirements</h3>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {job.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="flex items-center gap-1.5 border-t border-border pt-4 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {job.applicants} applicants
              </p>

              <div className="flex flex-wrap gap-2">
                {job.status !== "Active" && (
                  <Button
                    onClick={() => statusMutation.mutate({ status: "Active" })}
                    disabled={statusMutation.isPending}
                  >
                    Publish
                  </Button>
                )}
                {job.status !== "Closed" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      statusMutation.mutate({ status: "Closed", stage: "Closed" })
                    }
                    disabled={statusMutation.isPending}
                  >
                    Close
                  </Button>
                )}
                {job.status === "Active" && (
                  <Button variant="outline" onClick={() => void copyApplyLink()}>
                    {copied ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Link2 className="mr-2 h-4 w-4" />
                    )}
                    {copied ? "Link copied" : "Copy apply link"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() =>
                    void navigate({
                      to: "/screening",
                      search: { jobId: job.job_id },
                    })
                  }
                >
                  Screen applicants
                </Button>
              </div>

              {statusMutation.isError && (
                <p className="text-sm text-destructive">
                  Could not update this job, please try again.
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function JobsPage() {
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const jobs = useQuery({ queryKey: ["jobs"], queryFn: listJobs });
  const list = jobs.data ?? [];

  return (
    <AppShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Open <span className="text-highlight">Jobs</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {list.filter((j) => j.status === "Active").length} active requisitions
            across {new Set(list.map((j) => j.dept)).size} departments
          </p>
        </div>
        <Button onClick={() => setNewOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New job
        </Button>
      </header>

      {jobs.isPending && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass h-44 animate-pulse rounded-lg" />
          ))}
        </section>
      )}

      {jobs.isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6">
          <p className="text-sm text-destructive">
            We couldn't load your jobs right now.
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
        <p className="text-sm text-muted-foreground">
          No jobs yet. Create your first one with “New job”.
        </p>
      )}

      {list.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((job) => (
            <article
              key={job.job_id}
              onClick={() => setOpenJobId(job.job_id)}
              className="glass cursor-pointer rounded-lg p-5 text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">{job.title}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {job.dept} · {job.type}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusStyle[job.status] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {job.applicants} applicants
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                {job.stage}
              </p>
            </article>
          ))}
        </section>
      )}

      <JobDetailDialog jobId={openJobId} onClose={() => setOpenJobId(null)} />
      <NewJobDialog open={newOpen} onOpenChange={setNewOpen} />
    </AppShell>
  );
}
