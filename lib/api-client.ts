// ============================================
// Centralized API Client for kamidev (Next.js)
// ============================================
// All API calls to kami-backend go through this client

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kami-backend-6ra6.onrender.com';
const API_TIMEOUT = 30000; // 30 seconds

// Types
export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
  status: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string; // Changed to string for simpler error handling
  errorDetails?: ApiError;
  ok: boolean;
}

/**
 * Helper to extract error message from ApiError
 */
function getErrorMessage(err: ApiError): string {
  return err.message || err.error || 'Unknown error';
}

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Build request headers
 */
function buildHeaders(customHeaders?: HeadersInit): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  if (customHeaders) {
    const custom = new Headers(customHeaders);
    custom.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse API response
 */
async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let data: T | undefined;
  let error: string | undefined;
  let errorDetails: ApiError | undefined;

  try {
    const json = await response.json();
    
    if (response.ok) {
      data = json as T;
    } else {
      errorDetails = {
        error: json.error || 'Unknown error',
        message: json.message,
        details: json.details,
        status: response.status,
      };
      error = getErrorMessage(errorDetails);
    }
  } catch {
    if (!response.ok) {
      errorDetails = {
        error: 'Failed to parse response',
        status: response.status,
      };
      error = getErrorMessage(errorDetails);
    }
  }

  return {
    data,
    error,
    errorDetails,
    ok: response.ok,
  };
}

/**
 * Main API client
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options?: {
      headers?: HeadersInit;
      cache?: RequestCache;
      next?: NextFetchRequestConfig;
    }
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = buildHeaders(options?.headers);

    try {
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers,
        cache: options?.cache,
        next: options?.next,
      });
      return parseResponse<T>(response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          ok: false,
          error: 'Request timeout',
        };
      }
      throw err;
    }
  },

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: {
      headers?: HeadersInit;
    }
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = buildHeaders(options?.headers);

    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      return parseResponse<T>(response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          ok: false,
          error: 'Request timeout',
        };
      }
      throw err;
    }
  },

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: {
      headers?: HeadersInit;
    }
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = buildHeaders(options?.headers);

    try {
      const response = await fetchWithTimeout(url, {
        method: 'PATCH',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      return parseResponse<T>(response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          ok: false,
          error: 'Request timeout',
        };
      }
      throw err;
    }
  },

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: {
      headers?: HeadersInit;
    }
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = buildHeaders(options?.headers);

    try {
      const response = await fetchWithTimeout(url, {
        method: 'DELETE',
        headers,
      });
      return parseResponse<T>(response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          ok: false,
          error: 'Request timeout',
        };
      }
      throw err;
    }
  },
};

// Type for Next.js fetch options
interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

export default apiClient;
