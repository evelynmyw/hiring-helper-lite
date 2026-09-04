import { createFileRoute } from "@tanstack/react-router";
import { Clock, Percent, Target, Users } from "lucide-react";

import { AppShell } from "@/components/AppSidebar";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Hiring Analytics — Recruiting Assistant" },
      {
        name: "description",
        content:
          "Track time-to-hire, offer acceptance, sourcing channels and monthly application volume.",
      },
      { property: "og:title", content: "Hiring Analytics — Recruiting Assistant" },
      {
        property: "og:description",
        content: "Time-to-hire, conversion and sourcing channel performance.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const KPIS = [
  { label: "Time to hire", value: "24d", icon: Clock, note: "-3d vs last quarter" },
  { label: "Offer acceptance", value: "78%", icon: Percent, note: "+6pts" },
  { label: "Screen → interview", value: "38%", icon: Target, note: "stable" },
  { label: "Active candidates", value: "148", icon: Users, note: "+23 this week" },
];

const MONTHS = [
  { month: "Apr", applications: 62 },
  { month: "May", applications: 88 },
  { month: "Jun", applications: 74 },
  { month: "Jul", applications: 103 },
  { month: "Aug", applications: 121 },
  { month: "Sep", applications: 148 },
];

const SOURCES = [
  { source: "Referrals", pct: 34 },
  { source: "LinkedIn", pct: 27 },
  { source: "Career site", pct: 21 },
  { source: "Agencies", pct: 11 },
  { source: "Events", pct: 7 },
];

function AnalyticsPage() {
  const max = Math.max(...MONTHS.map((m) => m.applications));

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Hiring <span className="flare-text">Analytics</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Funnel efficiency and sourcing performance over the last 6 months
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map(({ label, value, icon: Icon, note }) => (
          <div key={label} className="glass flare-ring rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold">Applications per month</h2>
          <div className="mt-6 flex h-52 items-end gap-4">
            {MONTHS.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {m.applications}
                </span>
                <div
                  className="flare-gradient w-full rounded-t-lg"
                  style={{ height: `${(m.applications / max) * 100}%` }}
                />
                <span className="text-xs font-medium">{m.month}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-base font-semibold">Sourcing channels</h2>
          <div className="mt-5 space-y-4">
            {SOURCES.map((s) => (
              <div key={s.source}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.source}</span>
                  <span className="text-muted-foreground">{s.pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="flare-gradient h-full rounded-full"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
