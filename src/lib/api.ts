import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || "https://app.company.com/login";

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  retries?: number;
  retryDelay?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  clearToken() {
    delete this.defaultHeaders["Authorization"];
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, String(value));
      });
    }
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) return undefined as T;

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const error: ApiError = {
        message: body?.message || `Request failed with status ${response.status}`,
        errors: body?.errors,
        status: response.status,
      };

      if (response.status === 401) {
        this.clearToken();
        toast.error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (response.status === 422) {
        const firstError = body?.errors ? Object.values(body.errors).flat()[0] : body?.message;
        toast.error(String(firstError) || "Validation error");
      } else if (response.status >= 500) {
        toast.error("Server error. Please try again later.");
      }

      throw error;
    }

    return body as T;
  }

  private async requestWithRetry<T>(
    url: string,
    options: RequestInit,
    retries: number,
    retryDelay: number
  ): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.defaultHeaders, ...(options.headers || {}) },
      });

      // Handle 429 Too Many Requests with Retry-After
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : retryDelay * Math.pow(2, attempt);

        if (attempt < retries) {
          toast.warning(`Rate limited. Retrying in ${Math.ceil(waitMs / 1000)}s...`);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }

        toast.error("Too many requests. Please wait a moment and try again.");
        throw {
          message: "Rate limit exceeded",
          status: 429,
        } as ApiError;
      }

      return this.handleResponse<T>(response);
    }

    throw { message: "Max retries exceeded", status: 0 } as ApiError;
  }

  async get<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { params, retries = 0, retryDelay = 1000, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    return this.requestWithRetry<T>(url, { ...fetchOptions, method: "GET" }, retries, retryDelay);
  }

  async post<T>(endpoint: string, data?: unknown, options: ApiOptions = {}): Promise<T> {
    const { params, retries = 0, retryDelay = 1000, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    return this.requestWithRetry<T>(
      url,
      { ...fetchOptions, method: "POST", body: data ? JSON.stringify(data) : undefined },
      retries,
      retryDelay
    );
  }

  async put<T>(endpoint: string, data?: unknown, options: ApiOptions = {}): Promise<T> {
    const { params, retries = 0, retryDelay = 1000, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    return this.requestWithRetry<T>(
      url,
      { ...fetchOptions, method: "PUT", body: data ? JSON.stringify(data) : undefined },
      retries,
      retryDelay
    );
  }

  async patch<T>(endpoint: string, data?: unknown, options: ApiOptions = {}): Promise<T> {
    const { params, retries = 0, retryDelay = 1000, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    return this.requestWithRetry<T>(
      url,
      { ...fetchOptions, method: "PATCH", body: data ? JSON.stringify(data) : undefined },
      retries,
      retryDelay
    );
  }

  async delete<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { params, retries = 0, retryDelay = 1000, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    return this.requestWithRetry<T>(url, { ...fetchOptions, method: "DELETE" }, retries, retryDelay);
  }

  async upload<T>(endpoint: string, formData: FormData, options: ApiOptions = {}): Promise<T> {
    const { params, retries = 0, retryDelay = 1000, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const headers = { ...this.defaultHeaders };
    delete headers["Content-Type"]; // Let browser set multipart boundary
    return this.requestWithRetry<T>(
      url,
      { ...fetchOptions, method: "POST", body: formData, headers },
      retries,
      retryDelay
    );
  }
}

export const api = new ApiClient(API_BASE_URL);

// ── Typed resource endpoints ──

export const transactionsApi = {
  list: (page = 1, perPage = 25, filters?: Record<string, string>) =>
    api.get<PaginatedResponse<unknown>>("/transactions", {
      params: { page, per_page: perPage, ...filters },
    }),
  show: (id: string) => api.get<{ data: unknown }>(`/transactions/${id}`),
  update: (id: string, data: unknown) => api.patch<{ data: unknown }>(`/transactions/${id}`, data),
  tags: (id: string, tags: unknown[]) => api.put<{ data: unknown }>(`/transactions/${id}/tags`, { tags }),
};

export const reconciliationApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.upload<{ data: { id: string; headers: string[]; preview: unknown[] } }>(
      "/reconciliation/upload",
      form
    );
  },
  mapColumns: (uploadId: string, mapping: Record<string, string>) =>
    api.post<{ data: unknown }>(`/reconciliation/${uploadId}/map`, { mapping }),
  correlate: (uploadId: string) =>
    api.post<{ data: unknown[] }>(`/reconciliation/${uploadId}/correlate`, undefined, {
      retries: 2,
      retryDelay: 2000,
    }),
  confirm: (uploadId: string, matches: { bankLineId: string; transactionId: string }[]) =>
    api.post<{ data: unknown }>(`/reconciliation/${uploadId}/confirm`, { matches }),
  addMissing: (uploadId: string, bankLineIds: string[]) =>
    api.post<{ data: unknown }>(`/reconciliation/${uploadId}/add-missing`, { bank_line_ids: bankLineIds }),
};

export const reportsApi = {
  summary: (month: string) => api.get<{ data: unknown }>("/reports/summary", { params: { month } }),
  byTag: (month: string) => api.get<{ data: unknown[] }>("/reports/by-tag", { params: { month } }),
  export: (month: string, format = "xlsx") =>
    api.get<Blob>(`/reports/export`, { params: { month, format } }),
};

export const aiApi = {
  ocrReceipt: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.upload<{ data: unknown }>("/ai/ocr", form, { retries: 3, retryDelay: 3000 });
  },
  suggestMatches: (bankLines: unknown[]) =>
    api.post<{ data: unknown[] }>("/ai/suggest-matches", { bank_lines: bankLines }, {
      retries: 3,
      retryDelay: 3000,
    }),
};

export const notificationsApi = {
  getSettings: () => api.get<{ data: unknown }>("/notification-settings"),
  updateSettings: (data: unknown) => api.put<{ data: unknown }>("/notification-settings", data),
};

export type { PaginatedResponse, ApiError };
