// src/utils/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function doFetch<T = any>(path: string, opts: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  try {
    const res = await fetch(url, { credentials: "include", ...opts });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const body = (() => { try { return JSON.parse(text); } catch { return text; } })();
      console.error(`API error ${res.status} ${url}:`, body);
      throw new Error(`API ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("fetch error:", url, err);
    throw err;
  }
}

export async function apiGet<T = any>(path: string, token?: string) {
  return doFetch<T>(path, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
}

export async function apiPost<T = any>(path: string, body?: any, token?: string) {
  return doFetch<T>(path, {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body ?? {}),
  });
}
