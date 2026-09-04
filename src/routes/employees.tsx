import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { AppShell } from "@/components/AppSidebar";

export const Route = createFileRoute("/employees")({
  head: () => ({
    meta: [
      { title: "Employee Directory — Tara" },
      {
        name: "description",
        content:
          "Internal employee directory with team, role, location and hiring-panel availability.",
      },
      { property: "og:title", content: "Employee Directory — Tara" },
      {
        property: "og:description",
        content: "Team directory with roles, locations and interview panels.",
      },
    ],
  }),
  component: EmployeesPage,
});

const PEOPLE = [
  { name: "Evelyn R", role: "Head of Talent", team: "People", location: "Stockholm", panel: true },
  { name: "Alice Johnson", role: "Engineering Manager", team: "Platform", location: "Remote", panel: true },
  { name: "Bob Smith", role: "Senior Quant", team: "Trading", location: "Stockholm", panel: true },
  { name: "Carol Williams", role: "Data Scientist", team: "Research", location: "Gothenburg", panel: false },
  { name: "David Chen", role: "Product Designer", team: "Design", location: "Remote", panel: false },
  { name: "Emma Larsson", role: "Recruiter", team: "People", location: "Stockholm", panel: true },
  { name: "Farid Haddad", role: "Backend Engineer", team: "Platform", location: "Malmö", panel: false },
  { name: "Grace Park", role: "Legal Counsel", team: "Legal", location: "Stockholm", panel: false },
];

function EmployeesPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Employee <span className="flare-text">Directory</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {PEOPLE.length} teammates · {PEOPLE.filter((p) => p.panel).length} on
          the interview panel
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PEOPLE.map((p) => (
          <article
            key={p.name}
            className="glass flare-ring flex items-start gap-4 rounded-2xl p-5"
          >
            <span className="flare-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
              {p.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">{p.name}</h2>
              <p className="text-xs text-muted-foreground">{p.role}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {p.team} · {p.location}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {p.panel && (
                  <span className="gradient-success rounded-full px-2.5 py-1 text-[11px] font-medium text-white">
                    Interview panel
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {p.name.split(" ")[0]?.toLowerCase()}@nordmatch.io
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
