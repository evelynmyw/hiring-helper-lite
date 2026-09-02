/**
 * Runtime configuration for the recruiting assistant.
 *
 * The backend URL is read from the `VITE_API_BASE` environment variable.
 * In local development it defaults to `http://localhost:8000`.
 *
 * To connect to a real backend, create a `.env` file in the project root:
 *   VITE_API_BASE=https://your-backend.example.com
 *
 * Vite only exposes env vars prefixed with `VITE_` to the client bundle.
 */
const rawBase = import.meta.env["VITE_API_BASE"] as string | undefined;

const fallbackBase = "http://localhost:8000";

function normalizeBase(url: string): string {
  return url.replace(/\/$/, "");
}

export const API_BASE = normalizeBase(rawBase?.trim() || fallbackBase);

/**
 * Helpful runtime guard: if the app is running in production and no custom
 * backend URL was provided, warn the user instead of silently using localhost.
 */
if (import.meta.env.PROD && !rawBase?.trim()) {
  console.warn(
    `[config] VITE_API_BASE is not set. Falling back to ${fallbackBase}. ` +
      "Set VITE_API_BASE in your environment to connect to a real backend."
  );
}
