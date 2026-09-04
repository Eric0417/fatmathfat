const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname === 'fatmathfat.onrender.com'
    ? 'https://fatmathfat-api.onrender.com'
    : '');
const TOKEN_KEY = 'mathfatfat:auth-token';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = (await response.json().catch(() => ({}))) as {
    detail?: string;
    message?: string;
  };
  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    throw new ApiError(
      data.detail || data.message || '請求失敗，請稍後再試。',
      response.status
    );
  }
  return data as T;
}
