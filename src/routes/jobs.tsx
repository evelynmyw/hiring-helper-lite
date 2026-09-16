import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, MapPin, Plus, Users } from "lucide-react";

import { AppShell } from "@/components/AppSidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

type Job = {
  title: string;
  dept: string;
  location: string;
  type: string;
  applicants: number;
  stage: string;
  status: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

const JOBS: Job[] = [
  {
    title: "Quantitative Analyst",
    dept: "Trading",
    location: "Stockholm · Hybrid",
    type: "Full-time",
    applicants: 34,
    stage: "Interviewing",
    status: "Active",
    description:
      "We are looking for a Quantitative Analyst to join our trading team. You will build and validate pricing and risk models that directly support our trading strategies.",
    responsibilities: [
      "Develop and backtest quantitative trading models",
      "Analyze large market datasets using Python and SQL",
      "Collaborate with traders to improve execution strategies",
      "Monitor model performance and manage model risk",
    ],
    requirements: [
      "Strong Python skills and experience with pandas/numpy",
      "Solid foundation in statistics and machine learning",
      "2+ years of experience in a quantitative role",
      "Master's degree in a technical field preferred",
    ],
  },
  {
    title: "Backend Engineer",
    dept: "Platform",
    location: "Remote · EU",
    type: "Full-time",
    applicants: 51,
    stage: "Screening",
    status: "Active",
    description:
      "Join our platform team to design and scale the services that power Tara. You will own critical backend systems end to end, from API design to production reliability.",
    responsibilities: [
      "Design and build REST APIs and background workers",
      "Own service reliability, observability and performance",
      "Review code and mentor junior engineers",
      "Work closely with product and frontend teams",
    ],
    requirements: [
      "5+ years of backend experience (Node.js, Go or Python)",
      "Experience with PostgreSQL and message queues",
      "Familiarity with cloud infrastructure and CI/CD",
      "Strong communication skills in a remote setting",
    ],
  },
  {
    title: "Data Scientist",
    dept: "Research",
    location: "Stockholm · On-site",
    type: "Full-time",
    applicants: 27,
    stage: "Sourcing",
    status: "Active",
    description:
      "As a Data Scientist on the research team, you will turn messy data into models and insights that shape product decisions across the company.",
    responsibilities: [
      "Build predictive models for matching and ranking",
      "Design and analyze A/B experiments",
      "Present findings to stakeholders and leadership",
      "Maintain data pipelines with the data engineering team",
    ],
    requirements: [
      "Strong Python, SQL and statistics background",
      "Experience with scikit-learn or similar ML frameworks",
      "Ability to communicate results to non-technical audiences",
      "MSc or PhD in a quantitative field preferred",
    ],
  },
  {
    title: "Corporate Lawyer",
    dept: "Legal",
    location: "Stockholm · On-site",
    type: "Full-time",
    applicants: 8,
    stage: "Not published",
    status: "Draft",
    description:
      "We are seeking a senior Corporate Lawyer to lead our M&A and commercial legal work. You will advise leadership on transactions, contracts and regulatory matters.",
    responsibilities: [
      "Lead due diligence and drafting for M&A transactions",
      "Negotiate commercial contracts with partners and vendors",
      "Advise on corporate governance and compliance",
      "Manage relationships with external counsel",
    ],
    requirements: [
      "10+ years of corporate law experience, focus on M&A",
      "Qualified to practice in Sweden or another EU jurisdiction",
      "Fluent in English and Swedish",
      "Experience in a tech or high-growth environment is a plus",
    ],
  },
  {
    title: "Product Designer",
    dept: "Design",
    location: "Remote · EU",
    type: "Contract",
    applicants: 19,
    stage: "Offer",
    status: "Active",
    description:
      "We are hiring a Product Designer to shape the end-to-end experience of Tara. You will work across research, interaction design and visual polish.",
    responsibilities: [
      "Own design from discovery through delivery",
      "Run user research and usability testing",
      "Maintain and evolve our design system",
      "Partner with engineers on implementation quality",
    ],
    requirements: [
      "4+ years of product design experience",
      "Strong portfolio of shipped web products",
      "Proficiency with Figma and prototyping tools",
      "Experience designing data-dense interfaces is a plus",
    ],
  },
  {
    title: "Recruiting Coordinator",
    dept: "People",
    location: "Stockholm · Hybrid",
    type: "Part-time",
    applicants: 12,
    stage: "Closed",
    status: "Closed",
    description:
      "As a Recruiting Coordinator you keep our hiring process running smoothly — scheduling interviews, communicating with candidates and supporting the recruiting team.",
    responsibilities: [
      "Schedule and coordinate interviews across teams",
      "Manage candidate communication and follow-ups",
      "Keep the ATS data accurate and up to date",
      "Support recruiting events and employer branding",
    ],
    requirements: [
      "1+ years of coordination or administrative experience",
      "Excellent organization and communication skills",
      "Experience with an ATS is a plus",
      "Available 20–25 hours per week",
    ],
  },
];

const statusStyle: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Draft: "border border-border bg-secondary text-secondary-foreground",
  Closed: "bg-destructive/15 text-destructive",
};

function JobsPage() {
  return (
    <AppShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Open <span className="text-highlight">Jobs</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {JOBS.filter((j) => j.status === "Active").length} active
            requisitions across {new Set(JOBS.map((j) => j.dept)).size}{" "}
            departments
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New job
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {JOBS.map((job) => (
          <Dialog key={job.title}>
            <DialogTrigger asChild>
              <article className="glass cursor-pointer rounded-lg p-5 text-left transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">
                      {job.title}
                    </h2>
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
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">{job.title}</DialogTitle>
                <DialogDescription>
                  {job.dept} · {job.type} · {job.location}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 text-sm">
                <p className="leading-relaxed text-muted-foreground">
                  {job.description}
                </p>

                <div>
                  <h3 className="mb-2 font-semibold">Responsibilities</h3>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {job.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Requirements</h3>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {job.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <p className="flex items-center gap-1.5 border-t border-border pt-4 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {job.applicants} applicants · {job.stage}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </section>
    </AppShell>
  );
}
