import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/AppSidebar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Recruitment Dashboard — Tara" },
      {
        name: "description",
        content:
          "Monitor your hiring pipeline, open roles, candidate flow and team performance at a glance.",
      },
      {
        property: "og:title",
        content: "Recruitment Dashboard — Tara",
      },
      {
        property: "og:description",
        content: "Monitor your hiring pipeline and team performance.",
      },
    ],
  }),
  component: DashboardPage,
});

const STATS = [
  { label: "Open Jobs", value: "12", icon: Briefcase, delta: "+2 this week" },
  { label: "Candidates", value: "148", icon: Users, delta: "+23 this week" },
  { label: "Interviews", value: "9", icon: Clock, delta: "3 today" },
  { label: "Hires (30d)", value: "4", icon: CheckCircle2, delta: "+1 vs last" },
];

const PIPELINE = [
  { stage: "Applied", count: 148, pct: 100 },
  { stage: "Screened", count: 82, pct: 55 },
  { stage: "Interview", count: 31, pct: 21 },
  { stage: "Offer", count: 9, pct: 6 },
  { stage: "Hired", count: 4, pct: 3 },
];

const ROLES = [
  { title: "Quantitative Analyst", dept: "Trading", applicants: 34, status: "Active" },
  { title: "Backend Engineer", dept: "Platform", applicants: 51, status: "Active" },
  { title: "Corporate Lawyer", dept: "Legal", applicants: 8, status: "Draft" },
  { title: "Data Scientist", dept: "Research", applicants: 27, status: "Active" },
];

const ACTIVITY = [
  { who: "Zhang Haoran", what: "scored 68.3 on Quantitative Analyst", when: "12m ago" },
  { who: "Alice Johnson", what: "moved to Interview stage", when: "1h ago" },
  { who: "Bob Smith", what: "submitted an application", when: "3h ago" },
  { who: "Carol Williams", what: "received an offer", when: "Yesterday" },
];

function DashboardPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Recruitment <span className="text-primary">Dashboard</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your hiring pipeline and team performance
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, delta }) => (
          <div key={label} className="glass rounded-lg p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {delta}
            </p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="glass rounded-lg p-6 lg:col-span-2">
          <h2 className="text-base font-semibold">Hiring pipeline</h2>
          <div className="mt-5 space-y-4">
            {PIPELINE.map(({ stage, count, pct }) => (
              <div key={stage}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-lg p-6">
          <h2 className="text-base font-semibold">Recent activity</h2>
          <ul className="mt-5 space-y-4">
            {ACTIVITY.map((a) => (
              <li key={a.who} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {a.who.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.what}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass mt-6 rounded-lg p-6">
        <h2 className="text-base font-semibold">Open roles</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 pr-4 font-medium">Department</th>
                <th className="py-2 pr-4 font-medium">Applicants</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.title} className="border-t border-border/60">
                  <td className="py-3 pr-4 font-medium">{r.title}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.dept}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.applicants}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        r.status === "Active"
                          ? "bg-success/15 text-success"
                          : "border border-border bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
