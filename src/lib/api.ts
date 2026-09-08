const env = import.meta.env as unknown as { VITE_API_BASE_URL?: string };

export const API_BASE = env.VITE_API_BASE_URL ?? "http://localhost:8000";

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

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token = window.localStorage.getItem("tara_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function post<T>(
  path: string,
  body: unknown,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (res.status === 401) {
      try {
        window.localStorage.removeItem("tara_token");
      } catch {
        /* ignore */
      }
      throw new Error("Your session expired. Please log in again.");
    }
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const searchCandidates = (query: string) =>
  post<SearchResponse>("/agent/search-candidates", { query }, 30_000);

export const screenCandidates = (job_description: string) =>
  post<ScreenResponse>("/agent/screen-candidates", { job_description }, 120_000);

export const displayName = (c: ScreenedCandidate) =>
  c.name?.trim() || c.email?.trim() || c.document_id.slice(0, 8);
