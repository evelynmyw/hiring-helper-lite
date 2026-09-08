import { API_BASE } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
};

export type AuthResponse = {
  access_token: string;
  token_type?: string;
  user: AuthUser;
};

const TOKEN_KEY = "tara_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}

async function readMessage(res: Response, fallback: string) {
  try {
    const body = (await res.json()) as { detail?: unknown; message?: unknown };
    const detail = body.detail ?? body.message;
    if (typeof detail === "string" && detail.trim()) return detail;
  } catch {
    /* ignore */
  }
  return fallback;
}

async function authPost(path: string, body: unknown): Promise<AuthResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError(0, "Cannot reach the server. Is the backend running?");
  }

  if (!res.ok) {
    const fallback =
      res.status === 401
        ? "Invalid email or password"
        : res.status === 409
          ? "Email already registered"
          : `Request failed with status ${res.status}`;
    throw new AuthError(res.status, await readMessage(res, fallback));
  }

  return (await res.json()) as AuthResponse;
}

export const login = (email: string, password: string) =>
  authPost("/auth/login", { email, password });

export const register = (email: string, name: string, password: string) =>
  authPost("/auth/register", { email, name, password });

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      clearToken();
      return null;
    }
    if (!res.ok) return null;
    return (await res.json()) as AuthUser;
  } catch {
    return null;
  }
}

export async function logoutRequest() {
  const token = getToken();
  clearToken();
  if (!token) return;
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    /* logout is best-effort */
  }
}

export function initials(user: AuthUser | null): string {
  const source = user?.name?.trim() || user?.email?.trim() || "?";
  return source.charAt(0).toUpperCase();
}
