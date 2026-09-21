import { supabase } from "@/integrations/supabase/client";

const env = import.meta.env as unknown as { VITE_API_BASE_URL?: string };

export const API_BASE = env.VITE_API_BASE_URL ?? "http://localhost:8000";

/** Attach the current Supabase access token so the backend can authenticate us. */
async function authHeaders(base: Record<string, string> = {}): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
}

/** Backend rejected our token -> clear the session and send the user to sign in. */
async function handleUnauthorized(): Promise<never> {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") window.location.href = "/auth";
  throw new Error("Unauthorized");
}

/** An error carrying the HTTP status and the backend's `detail` message. */
export class ApiError extends Error {
  status: number;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.name = "ApiError";
  }
}

async function toApiError(res: Response): Promise<ApiError> {
  let detail = `Request failed with status ${res.status}`;
  try {
    const body = (await res.json()) as { detail?: unknown };
    if (typeof body.detail === "string" && body.detail.trim()) detail = body.detail;
  } catch {
    /* keep the fallback message */
  }
  return new ApiError(res.status, detail);
}

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
  applied_at?: string | null;
  breakdown: Criterion[];
};

export type ScreenResponse = {
  job_id?: string | null;
  job_title: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  candidates: ScreenedCandidate[];
};

async function request<T>(
  path: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
    });
    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) throw await toApiError(res);
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function post<T>(path: string, body: unknown, timeoutMs: number): Promise<T> {
  return request<T>(
    path,
    {
      method: "POST",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    },
    timeoutMs,
  );
}

async function patch<T>(path: string, body: unknown, timeoutMs: number): Promise<T> {
  return request<T>(
    path,
    {
      method: "PATCH",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    },
    timeoutMs,
  );
}

async function get<T>(path: string, timeoutMs: number): Promise<T> {
  return request<T>(path, { headers: await authHeaders() }, timeoutMs);
}

export const searchCandidates = (query: string) =>
  post<SearchResponse>("/agent/search-candidates", { query }, 30_000);

/** Score everyone who applied to a job. */
export const screenJobApplicants = (job_id: string) =>
  post<ScreenResponse>("/agent/screen-candidates", { job_id }, 120_000);

/** Advanced mode: score the whole talent pool against a pasted JD. */
export const screenCandidates = (job_description: string) =>
  post<ScreenResponse>("/agent/screen-candidates", { job_description }, 120_000);

export const displayName = (c: ScreenedCandidate) =>
  c.name?.trim() || c.email?.trim() || c.document_id.slice(0, 8);

/* ------------------------------- Jobs (HR) ------------------------------- */

export type Job = {
  job_id: string;
  title: string;
  dept: string;
  location: string;
  type: string;
  applicants: number;
  stage: string;
  status: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
};

export type NewJobInput = {
  title: string;
  dept?: string;
  location?: string;
  type?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
};

export const listJobs = () => get<Job[]>("/jobs", 30_000);
export const getJob = (jobId: string) => get<Job>(`/jobs/${jobId}`, 30_000);
export const createJob = (input: NewJobInput) => post<Job>("/jobs", input, 30_000);
export const updateJob = (jobId: string, changes: Partial<Job>) =>
  patch<Job>(`/jobs/${jobId}`, changes, 30_000);

/* ----------------------------- Public (no auth) --------------------------- */

export type PublicJob = {
  job_id: string;
  title: string;
  dept: string;
  location: string;
  type: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
};

/** Public requests never carry a token and never bounce the visitor to login. */
async function publicRequest<T>(
  path: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...init, signal: controller.signal });
    if (!res.ok) throw await toApiError(res);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const listPublicJobs = () => publicRequest<PublicJob[]>("/public/jobs", {}, 30_000);

export const getPublicJob = (jobId: string) =>
  publicRequest<PublicJob>(`/public/jobs/${jobId}`, {}, 30_000);

export type ApplyResponse = {
  success: boolean;
  job_id: string;
  replaced_previous: boolean;
};

export function submitApplication(
  jobId: string,
  input: { name: string; email: string; resume: File },
) {
  const form = new FormData();
  form.append("name", input.name);
  form.append("email", input.email);
  form.append("resume", input.resume);
  // No Content-Type header: the browser adds the multipart boundary.
  return publicRequest<ApplyResponse>(
    `/public/jobs/${jobId}/apply`,
    { method: "POST", body: form },
    60_000,
  );
}

/* ------------------------------- Documents ------------------------------- */

export type CandidateDocument = {
  document_id: string;
  name?: string | null;
  email?: string | null;
  content: string;
};

type RawDocument = {
  document_id?: string;
  id?: string;
  name?: string | null;
  email?: string | null;
  content?: string | null;
  text?: string | null;
  raw_text?: string | null;
};

export async function getCandidateDocument(
  documentId: string,
): Promise<CandidateDocument> {
  const raw = await get<RawDocument>(`/documents/${documentId}`, 30_000);
  return {
    document_id: raw.document_id ?? raw.id ?? documentId,
    name: raw.name ?? null,
    email: raw.email ?? null,
    content: raw.content ?? raw.text ?? raw.raw_text ?? "",
  };
}

const SCREENING_CACHE_KEY = "tara_last_screening";

export function cacheScreening(result: ScreenResponse) {
  try {
    sessionStorage.setItem(SCREENING_CACHE_KEY, JSON.stringify(result));
  } catch {
    /* ignore */
  }
}

export function readCachedCandidate(
  documentId: string,
): { candidate: ScreenedCandidate; jobTitle: string } | null {
  try {
    const raw = sessionStorage.getItem(SCREENING_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ScreenResponse;
    const candidate = parsed.candidates.find((c) => c.document_id === documentId);
    return candidate ? { candidate, jobTitle: parsed.job_title } : null;
  } catch {
    return null;
  }
}
