export type AdminApiErrorCode = 'network_error' | 'unauthorized' | 'forbidden' | 'validation' | 'not_found' | 'conflict' | 'concurrency' | 'rate_limited' | 'unexpected' | string;
export interface ProblemDetailsPayload { status?: number; code?: string; detail?: string; traceId?: string; errors?: Record<string, string[]>; }

export class AdminApiError extends Error {
  constructor(public status: number, public code: AdminApiErrorCode, public detail: string, public traceId?: string, public fieldErrors?: Record<string, string[]>, public retryAfter?: number) { super(detail); this.name = 'AdminApiError'; }
}

const rawBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
export const adminApiConfigured = import.meta.env.VITE_USE_API === 'true' && Boolean(rawBaseUrl);
const baseUrl = rawBaseUrl?.replace(/\/$/, '') ?? '';
let unauthorizedHandler: (() => void) | undefined;
export const setUnauthorizedHandler = (handler?: () => void) => { unauthorizedHandler = handler; };

export interface ApiRequestOptions extends RequestInit { skipUnauthorizedHandler?: boolean; }

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipUnauthorizedHandler, ...init } = options; const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  let response: Response;
  try { response = await fetch(`${baseUrl}${path}`, { ...init, headers, credentials: 'include' }); }
  catch { throw new AdminApiError(0, 'network_error', 'No pudimos conectar con el servidor.'); }
  if (response.status === 401 && !skipUnauthorizedHandler) unauthorizedHandler?.();
  if (!response.ok) {
    let problem: ProblemDetailsPayload = {}; try { problem = await response.json() as ProblemDetailsPayload; } catch { /* non-JSON response */ }
    const code = normalizeCode(response.status, problem.code); const retry = Number(response.headers.get('Retry-After'));
    throw new AdminApiError(response.status, code, problem.detail ?? defaultDetail(response.status), problem.traceId, problem.errors, Number.isFinite(retry) ? retry : undefined);
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

const normalizeCode = (status: number, code?: string): AdminApiErrorCode => code ?? ({ 400: 'validation', 401: 'unauthorized', 403: 'forbidden', 404: 'not_found', 409: 'conflict', 429: 'rate_limited' }[status] ?? 'unexpected');
const defaultDetail = (status: number) => status === 401 ? 'Tu sesión no es válida.' : status === 403 ? 'No tienes permisos para realizar esta acción.' : status === 429 ? 'Has realizado demasiados intentos. Intenta nuevamente en unos minutos.' : 'No pudimos completar la operación.';
