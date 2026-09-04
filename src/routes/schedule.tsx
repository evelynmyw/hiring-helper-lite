import { createFileRoute } from "@tanstack/react-router";
import { Clock, Video } from "lucide-react";

import { AppShell } from "@/components/AppSidebar";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Interview Schedule — Tara" },
      {
        name: "description",
        content:
          "This week's interview schedule with candidates, panels, stages and meeting formats.",
      },
      { property: "og:title", content: "Interview Schedule — Tara" },
      {
        property: "og:description",
        content: "This week's interviews, panels and stages at a glance.",
      },
    ],
  }),
  component: SchedulePage,
});

const DAYS = [
  {
    day: "Monday",
    date: "Sep 7",
    events: [
      { time: "09:30", candidate: "Zhang Haoran", stage: "Technical screen", panel: "Bob Smith", mode: "Video" },
      { time: "14:00", candidate: "Alice Johnson", stage: "Hiring manager", panel: "Emma Larsson", mode: "On-site" },
    ],
  },
  {
    day: "Tuesday",
    date: "Sep 8",
    events: [
      { time: "11:00", candidate: "Carol Williams", stage: "Case study", panel: "Carol W. panel", mode: "Video" },
    ],
  },
  {
    day: "Wednesday",
    date: "Sep 9",
    events: [
      { time: "10:00", candidate: "David Chen", stage: "Portfolio review", panel: "Design team", mode: "Video" },
      { time: "13:30", candidate: "Farid Haddad", stage: "System design", panel: "Alice Johnson", mode: "On-site" },
      { time: "16:00", candidate: "Grace Park", stage: "Culture fit", panel: "Evelyn R", mode: "Video" },
    ],
  },
  {
    day: "Thursday",
    date: "Sep 10",
    events: [
      { time: "15:00", candidate: "Bob Smith", stage: "Final round", panel: "Leadership", mode: "On-site" },
    ],
  },
  { day: "Friday", date: "Sep 11", events: [] },
];

function SchedulePage() {
  const total = DAYS.reduce((n, d) => n + d.events.length, 0);

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Interview <span className="flare-text">Schedule</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} interviews scheduled this week
        </p>
      </header>

      <div className="space-y-4">
        {DAYS.map((d) => (
          <section key={d.day} className="glass rounded-2xl p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-semibold">{d.day}</h2>
              <span className="text-xs text-muted-foreground">{d.date}</span>
            </div>

            {d.events.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No interviews scheduled.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {d.events.map((e) => (
                  <li
                    key={`${d.day}-${e.time}`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-border/60 px-4 py-3"
                  >
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                      <Clock className="h-3.5 w-3.5" />
                      {e.time}
                    </span>
                    <span className="text-sm font-medium">{e.candidate}</span>
                    <span className="text-xs text-muted-foreground">
                      {e.stage} · {e.panel}
                    </span>
                    <span className="gradient-badge ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-foreground">
                      <Video className="h-3 w-3" />
                      {e.mode}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </AppShell>
  );
}
