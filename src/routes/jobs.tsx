import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, MapPin, Plus, Users } from "lucide-react";

import { AppShell } from "@/components/AppSidebar";

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

const JOBS = [
  {
    title: "Quantitative Analyst",
    dept: "Trading",
    location: "Stockholm · Hybrid",
    type: "Full-time",
    applicants: 34,
    stage: "Interviewing",
    status: "Active",
  },
  {
    title: "Backend Engineer",
    dept: "Platform",
    location: "Remote · EU",
    type: "Full-time",
    applicants: 51,
    stage: "Screening",
    status: "Active",
  },
  {
    title: "Data Scientist",
    dept: "Research",
    location: "Stockholm · On-site",
    type: "Full-time",
    applicants: 27,
    stage: "Sourcing",
    status: "Active",
  },
  {
    title: "Corporate Lawyer",
    dept: "Legal",
    location: "Stockholm · On-site",
    type: "Full-time",
    applicants: 8,
    stage: "Not published",
    status: "Draft",
  },
  {
    title: "Product Designer",
    dept: "Design",
    location: "Remote · EU",
    type: "Contract",
    applicants: 19,
    stage: "Offer",
    status: "Active",
  },
  {
    title: "Recruiting Coordinator",
    dept: "People",
    location: "Stockholm · Hybrid",
    type: "Part-time",
    applicants: 12,
    stage: "Closed",
    status: "Closed",
  },
];

const statusStyle: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Draft: "bg-muted text-muted-foreground",
  Closed: "bg-destructive/15 text-destructive",
};

function JobsPage() {
  return (
    <AppShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Open <span className="flare-text">Jobs</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {JOBS.filter((j) => j.status === "Active").length} active
            requisitions across {new Set(JOBS.map((j) => j.dept)).size}{" "}
            departments
          </p>
        </div>
        <button
          type="button"
          className="glass flare-ring inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          New job
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {JOBS.map((job) => (
          <article key={job.title} className="glass flare-ring rounded-2xl p-5">
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
    </AppShell>
  );
}
