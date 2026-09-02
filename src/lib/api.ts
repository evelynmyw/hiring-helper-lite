// Backend base URL.
// Local dev: create a `.env` file with `VITE_API_BASE=http://localhost:8000`.
// Remote/tunnel: set VITE_API_BASE to the public https URL of your backend.
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:8000";


export type SearchResponse = { query: string; answer: string };

export type Criterion = {
  criterion: string;
  max_points: number;
  earned_points: number;
  reasoning: string;
};

export type ScreenedCandidate = {
  rank: number;
  name?: string | null;
  email?: string | null;
  document_id: string;
  overall_score: number;
  breakdown: Criterion[];
};

export type ScreenResponse = {
  job_title: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  candidates: ScreenedCandidate[];
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return (await res.json()) as T;
}

export const searchCandidates = (query: string) =>
  post<SearchResponse>("/agent/search-candidates", { query });

export const screenCandidates = (job_description: string) =>
  post<ScreenResponse>("/agent/screen-candidates", { job_description });

export const displayName = (c: ScreenedCandidate) =>
  c.name?.trim() || c.email?.trim() || c.document_id.slice(0, 8);
