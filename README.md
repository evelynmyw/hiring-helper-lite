# Tara — AI Talent Scout (Frontend)

Tara is a recruiting assistant web app. HR users search the talent pool in plain language, screen and score applicants against a job, and manage open positions. Candidates browse open roles and apply on a public careers page.

This repo is the frontend only. All AI and data features call a separate backend API (default `http://localhost:8000`).

- **Stack:** TanStack Start (React 19, file-based routing) · Vite · Tailwind CSS v4 · shadcn/ui (Radix)
- **Auth:** Supabase (email + password)
- **Built with:** [Lovable](https://lovable.dev/projects/620bd1c7-2186-4f45-8473-e800285cdbe2). Changes pushed to `main` sync back to the Lovable editor.

---

## Quick start

**Prerequisites**

- Node.js 22.12 or later (Vite 8 requires it)
- The Tara backend running locally on port 8000

```sh
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

Open the URL Vite prints, sign in at `/auth`, and you land on the dashboard.

> **Run the app locally, not in Lovable's cloud preview.** The backend only listens on `localhost`, so a cloud preview can't reach it.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend base URL. Defaults to `http://localhost:8000` |
| `VITE_SUPABASE_URL` | Supabase project URL (browser client) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key (browser client) |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID` | Same values, used on the server side |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format everything with Prettier |

---

## Pages

### For HR (sign-in required)

| Route | Page | Data |
| --- | --- | --- |
| `/dashboard` | Recruitment overview: stats, pipeline, activity | Mock data |
| `/jobs` | List, create and edit job postings | Backend |
| `/chat` | **Candidate search.** Ask in natural language, e.g. "Find a quant analyst who knows Python and ML" | Backend |
| `/screening` | **Resume screening.** Score a job's applicants, or paste a JD to score the whole pool (advanced mode) | Backend |
| `/candidates/:documentId` | One candidate's resume and score breakdown | Backend |
| `/employees` | Employee directory | Mock data |
| `/schedule` | Interview calendar | Mock data |
| `/analytics` | Hiring analytics charts | Mock data |

If a signed-out user opens any of these, they're redirected to `/auth` and sent back after signing in.

### Public (no sign-in)

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/auth` | Sign in / sign up |
| `/apply` | Careers site: list of open positions |
| `/apply/:jobId` | Job details and application form (name, email, resume upload) |

---

## Backend API

All calls go through [`src/lib/api.ts`](src/lib/api.ts). Authenticated requests send the Supabase access token as `Authorization: Bearer <token>`. If the backend returns `401`, the user is signed out and sent to `/auth`.

| Method | Endpoint | Used by | Timeout |
| --- | --- | --- | --- |
| `POST` | `/agent/search-candidates` | Candidate search | 30 s |
| `POST` | `/agent/screen-candidates` | Resume screening | 120 s |
| `GET` `POST` | `/jobs` | Jobs page | 30 s |
| `GET` `PATCH` | `/jobs/:jobId` | Jobs page | 30 s |
| `GET` | `/documents/:documentId` | Candidate detail | 30 s |
| `GET` | `/public/jobs`, `/public/jobs/:jobId` | Careers site (no auth) | 30 s |
| `POST` | `/public/jobs/:jobId/apply` | Application form, multipart (no auth) | 60 s |

<details>
<summary><b>Request and response shapes for the two AI endpoints</b></summary>

**Candidate search:** `POST /agent/search-candidates`

```jsonc
// request
{ "query": "Find a quantitative analyst who knows Python and machine learning" }

// response: `answer` is Markdown and is rendered as Markdown, never as raw HTML
{ "query": "...", "answer": "## Top matches\n..." }
```

Each query is independent. No chat history is sent.

**Resume screening:** `POST /agent/screen-candidates`

```jsonc
// request: either score a job's applicants...
{ "job_id": "..." }
// ...or score the whole talent pool against a pasted JD (advanced mode)
{ "job_description": "<full JD text>" }

// response: candidates arrive already sorted by rank
{
  "job_id": "...",
  "job_title": "Quantitative Analyst",
  "required_skills": ["Python", "SQL"],
  "nice_to_have_skills": ["Bloomberg Terminal"],
  "candidates": [
    {
      "rank": 1,
      "name": "Zhang Haoran",
      "email": "haoran.zhang@example.com",
      "document_id": "fe19d82e-...",
      "overall_score": 68.3,
      "applied_at": "2026-09-01T10:00:00Z",
      "breakdown": [
        { "criterion": "Required Skills",     "max_points": 50, "earned_points": 33.3, "reasoning": "Matched 2/3 ..." },
        { "criterion": "Nice-to-have Skills", "max_points": 15, "earned_points": 10.0, "reasoning": "..." },
        { "criterion": "Years of Experience", "max_points": 20, "earned_points": 20.0, "reasoning": "..." },
        { "criterion": "Education",           "max_points": 15, "earned_points": 15.0, "reasoning": "..." }
      ]
    }
  ]
}
```

A candidate's display name is `name`, falling back to `email`, then to the first 8 characters of `document_id`.

</details>

---

## Project structure

```
src/
├── routes/            # One file per page (TanStack file-based routing)
│   └── __root.tsx     # App shell: header, nav, auth provider
├── components/        # App components (sidebar, Markdown renderer, theme toggle…)
│   └── ui/            # shadcn/ui primitives
├── lib/
│   ├── api.ts         # Backend client: every API call and its types
│   └── auth.ts        # Supabase sign-in / sign-up / profile helpers
├── integrations/      # Supabase and Lovable clients (generated, avoid editing)
└── routeTree.gen.ts   # Auto-generated by the router. Do not edit
drizzle/               # Supabase `profiles` table migration
supabase/              # Supabase project config
```

To add a page, create a file in `src/routes/`. For example, `src/routes/reports.tsx` becomes `/reports`. See [`src/routes/README.md`](src/routes/README.md) for naming rules.

---

## Notes for contributors

- This repo is connected to Lovable. **Don't force-push or rewrite pushed history**, because it breaks the project history on Lovable's side. Keep `main` in a working state.
- Don't add Vite plugins by hand in `vite.config.ts`. `@lovable.dev/vite-tanstack-config` already includes React, Tailwind, the router and path aliases.
- Never commit `.env`.
