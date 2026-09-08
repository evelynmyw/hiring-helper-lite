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

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Build the grid ending at the current week, going back WEEKS columns,
// so Aug/Sep (and every month) are fully covered with real dates.
const WEEKS = 22;

function mondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // Mon=0 … Sun=6
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

const CURRENT_MONDAY = mondayOfCurrentWeek();

function dateAt(w: number, d: number): Date {
  const date = new Date(CURRENT_MONDAY);
  date.setDate(date.getDate() - (WEEKS - 1 - w) * 7 + d);
  return date;
}

// Deterministic demo activity: interviews per day over the last weeks.
function heatmapData() {
  const grid: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: number[] = [];
    for (let d = 0; d < 7; d++) {
      const date = dateAt(w, d);
      const future = date > new Date();
      if (future) {
        col.push(0);
        continue;
      }
      const seed = (w * 7 + d) * 2654435761;
      const r = ((seed >>> 8) % 100) / 100;
      const weekend = d >= 5;
      col.push(weekend ? (r > 0.9 ? 1 : 0) : Math.round(r * 4.4));
    }
    grid.push(col);
  }
  // current week (last column) mirrors the list view
  const counts = [2, 1, 3, 1, 0, 0, 0];
  grid[WEEKS - 1] = counts;
  return grid;
}

const GRID = heatmapData();

// Month label positioned at the first week column where that month appears.
const MONTH_TICKS: { label: string; col: number }[] = [];
{
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const m = dateAt(w, 0).getMonth();
    if (m !== lastMonth) {
      MONTH_TICKS.push({
        label: dateAt(w, 0).toLocaleString("en", { month: "short" }),
        col: w,
      });
      lastMonth = m;
    }
  }
}

const TOOLTIP_FMT = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});

function cellStyle(count: number) {
  if (count === 0) return { background: "color-mix(in oklab, var(--foreground) 7%, transparent)" };
  const pct = [0, 25, 45, 68, 92][Math.min(count, 4)];
  return { background: `color-mix(in oklab, var(--sappan-rose) ${pct}%, transparent)` };
}

function Heatmap() {
  const total = GRID.flat().reduce((a, b) => a + b, 0);

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Interview density</h2>
        <span className="text-xs text-muted-foreground">
          {total} interviews in the last {WEEKS} weeks
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex justify-between pl-10 pr-1 text-[11px] text-muted-foreground">
            {MONTH_LABELS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          <div className="mt-1.5 flex gap-1">
            <div className="flex w-9 flex-col gap-1 text-[10px] leading-none text-muted-foreground">
              {WEEKDAYS.map((d, i) => (
                <span key={d} className="flex h-3.5 items-center">
                  {i % 2 === 0 ? d : ""}
                </span>
              ))}
            </div>
            {GRID.map((col, w) => (
              <div key={w} className="flex flex-col gap-1">
                {col.map((count, d) => (
                  <span
                    key={d}
                    title={`${count} interview${count === 1 ? "" : "s"} · ${WEEKDAYS[d]}, week ${w + 1}`}
                    style={cellStyle(count)}
                    className="h-3.5 w-3.5 rounded-[3px] transition-transform hover:scale-125"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((n) => (
          <span key={n} style={cellStyle(n)} className="h-3.5 w-3.5 rounded-[3px]" />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}

function SchedulePage() {
  const total = DAYS.reduce((n, d) => n + d.events.length, 0);

  return (
    <AppShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Interview <span className="flare-text">Schedule</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} interviews scheduled this week
          </p>
        </div>
      </header>

      <div className="space-y-8">
        <Heatmap />

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
      </div>
    </AppShell>
  );
}
