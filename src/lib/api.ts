const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const ADMIN_TOKEN_KEY = "morya-admin-token";

export type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  startingAt: number;
  mrp?: number | null;
  quantity?: string;
  singleSidePrice?: string;
  bothSidePrice?: string;
  offerLabel?: string;
  offerPercent?: number;
  offerActive?: boolean;
  offerStartsAt?: string | null;
  offerEndsAt?: string | null;
  isActive: boolean;
  category: {
    id: number;
    slug: string;
    name: string;
    eyebrow?: string;
  };
};

export type ApiCategory = {
  id: number;
  slug: string;
  name: string;
  eyebrow?: string;
  is_active: 0 | 1;
  sort_order: number;
};

export type ApiGalleryItem = {
  id: number;
  title: string;
  image_url: string;
  height: number;
  sort_order: number;
  is_active: 0 | 1;
};

export type ApiBlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image_url: string;
  tag?: string;
  published_at?: string;
  is_active: 0 | 1;
};

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function api<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAdminToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  }).catch(() => {
    throw new Error("API server is not running. Start it with npm run server.");
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.detail ?? payload.message ?? "Request failed");
  }

  return payload as T;
}
