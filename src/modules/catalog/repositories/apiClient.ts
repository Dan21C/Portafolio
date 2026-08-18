export type ApiErrorKind = 'network_error' | 'api_error' | 'not_found' | 'validation' | 'conflict' | 'unexpected';

export interface ProblemDetailsPayload { code?: string; status?: number; traceId?: string; detail?: string; title?: string; errors?: Record<string, string[]>; }

export class CatalogApiError extends Error {
  constructor(public readonly kind: ApiErrorKind, message: string, public readonly status?: number, public readonly code?: string, public readonly traceId?: string, public readonly detail?: string, public readonly errors?: Record<string, string[]>) { super(message); this.name = 'CatalogApiError'; }
}

export class ApiClient {
  constructor(private readonly baseUrl: string, private readonly fetchImpl: typeof fetch = fetch) {}
  async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    let response: Response;
    try { response = await this.fetchImpl(`${this.baseUrl.replace(/\/$/, '')}${path}`, { headers: { Accept: 'application/json' }, signal }); }
    catch (error) { if (error instanceof DOMException && error.name === 'AbortError') throw error; throw new CatalogApiError('network_error', 'No fue posible conectar con la API.'); }
    if (response.ok) return response.json() as Promise<T>;
    let problem: ProblemDetailsPayload = {};
    try { problem = await response.json() as ProblemDetailsPayload; } catch { /* A non-JSON error still receives a safe typed error. */ }
    const kind: ApiErrorKind = response.status === 404 ? 'not_found' : response.status === 400 ? 'validation' : response.status === 409 ? 'conflict' : response.status >= 500 ? 'api_error' : 'unexpected';
    throw new CatalogApiError(kind, problem.detail ?? problem.title ?? `API request failed with status ${response.status}.`, response.status, problem.code, problem.traceId, problem.detail, problem.errors);
  }
  async post<T>(path: string, body: unknown): Promise<T> {
    let response: Response;
    try { response = await this.fetchImpl(`${this.baseUrl.replace(/\/$/, '')}${path}`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
    catch { throw new CatalogApiError('network_error', 'No fue posible conectar con la API.'); }
    if (response.ok) return response.json() as Promise<T>;
    let problem: ProblemDetailsPayload = {}; try { problem = await response.json() as ProblemDetailsPayload; } catch { /* safe fallback */ }
    const kind: ApiErrorKind = response.status === 400 ? 'validation' : response.status === 409 ? 'conflict' : response.status >= 500 ? 'api_error' : 'unexpected';
    throw new CatalogApiError(kind, problem.detail ?? problem.title ?? `API request failed with status ${response.status}.`, response.status, problem.code, problem.traceId, problem.detail, problem.errors);
  }
}
