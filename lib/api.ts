/*
  Thin fetch wrapper around the Laravel API: handles the Sanctum CSRF
  cookie dance, the credentialed cookie session, and the guest cart token
  so callers just await apiGet/apiPost/etc.
*/

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001").replace(/\/$/, "");

const GUEST_TOKEN_KEY = "cs_guest_token";

export class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;
    constructor(message: string, status: number, errors?: Record<string, string[]>) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
    /** The first validation message, if this was a 422. */
    get fieldError(): string | undefined {
        if (!this.errors) return undefined;
        const first = Object.values(this.errors)[0];
        return first?.[0];
    }
}

export function getGuestToken(): string | null {
    try {
        let token = localStorage.getItem(GUEST_TOKEN_KEY);
        if (!token) {
            token = crypto.randomUUID();
            localStorage.setItem(GUEST_TOKEN_KEY, token);
        }
        return token;
    } catch {
        return null;
    }
}

export function clearGuestToken() {
    try {
        localStorage.removeItem(GUEST_TOKEN_KEY);
    } catch {
        /* ignore */
    }
}

function readCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

let csrfCookiePromise: Promise<void> | null = null;
function ensureCsrfCookie(): Promise<void> {
    if (!csrfCookiePromise) {
        csrfCookiePromise = fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" })
            .then(() => undefined)
            .catch((e) => {
                csrfCookiePromise = null;
                throw e;
            });
    }
    return csrfCookiePromise;
}

export type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

/** Low-level request. Prefer apiGet/apiPost/apiPatch/apiDelete below. */
export async function apiFetch<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
    const method = (options.method || "GET").toUpperCase();

    if (!SAFE_METHODS.has(method)) {
        await ensureCsrfCookie();
    }

    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    if (options.body !== undefined) headers.set("Content-Type", "application/json");

    if (!SAFE_METHODS.has(method)) {
        const xsrf = readCookie("XSRF-TOKEN");
        if (xsrf) headers.set("X-XSRF-TOKEN", xsrf);
    }

    const guestToken = getGuestToken();
    if (guestToken) headers.set("X-Guest-Token", guestToken);

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        method,
        headers,
        credentials: "include",
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    if (res.status === 204) return undefined as T;

    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

    if (!res.ok) {
        const message = (payload && typeof payload.message === "string" && payload.message) || res.statusText || "Something went wrong.";
        throw new ApiError(message, res.status, payload?.errors);
    }

    return payload as T;
}

export const apiGet = <T = unknown>(path: string) => apiFetch<T>(path);
export const apiPost = <T = unknown>(path: string, body?: unknown) => apiFetch<T>(path, { method: "POST", body });
export const apiPatch = <T = unknown>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PATCH", body });
export const apiDelete = <T = unknown>(path: string) => apiFetch<T>(path, { method: "DELETE" });
