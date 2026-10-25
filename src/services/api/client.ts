import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { APP_CONFIG, STORAGE_KEYS, ROUTES } from "@/constants";
import { getCsrfToken } from "@/lib/api";
import { toast } from "sonner";

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
}

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorPayload {
  code?: string;
  message: string;
  details?: unknown[];
}

export class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor(config: ApiClientConfig = {}) {
    this.client = axios.create({
      baseURL: config.baseURL || APP_CONFIG.apiBaseUrl,
      timeout: config.timeout || 15000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: unknown, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private setupInterceptors(): void {
    // ==========================================
    // 1. Request Interceptor
    // ==========================================
    this.client.interceptors.request.use((req: InternalAxiosRequestConfig) => {
      const isAuthRoute =
        req.url?.includes("/auth/login") ||
        req.url?.includes("/auth/register") ||
        req.url?.includes("/auth/forgot-password") ||
        req.url?.includes("/auth/reset-password");

      if (!isAuthRoute) {
        let token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          token = token.trim();
          if (token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1).trim();
          }
          if (token && token !== "null" && token !== "undefined" && req.headers) {
            req.headers.Authorization = `Bearer ${token}`;
          }
        }

        let activeWorkspace = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKSPACE);
        if (activeWorkspace) {
          activeWorkspace = activeWorkspace.trim();
          if (activeWorkspace.startsWith('"') && activeWorkspace.endsWith('"')) {
            activeWorkspace = activeWorkspace.slice(1, -1).trim();
          }
          if (activeWorkspace && activeWorkspace !== "null" && activeWorkspace !== "undefined" && req.headers) {
            req.headers["X-Workspace-Id"] = activeWorkspace;
          }
        }
      }

      // Attach CSRF protection token for state-mutating requests
      const method = req.method?.toLowerCase();
      if (method && ["post", "put", "patch", "delete"].includes(method)) {
        const csrfToken = getCsrfToken();
        if (csrfToken && req.headers) {
          req.headers["X-CSRF-Token"] = csrfToken;
        }
      }

      return req;
    });

    // ==========================================
    // 2. Response Interceptor
    // ==========================================
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Auto-unwrap standard response envelope { success: true, data: T } or { data: T }
        if (
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data
        ) {
          return response.data.data;
        }
        return response.data;
      },
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.error?.message ||
          errorData?.message ||
          error.message ||
          "An unexpected server error occurred";

        // ----------------------------------------------------
        // Handle 401 Unauthorized (Token Refresh Flow)
        // ----------------------------------------------------
        if (status === 401 && !originalRequest._retry) {
          // If on auth routes, do NOT redirect to login; let caller reject and display error
          if (
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register")
          ) {
            return Promise.reject(new Error(errorMessage));
          }

          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

          // If no refresh token or refresh itself failed, redirect to login
          if (!refreshToken || originalRequest.url?.includes("/auth/refresh")) {
            this.handleLogoutRedirect();
            return Promise.reject(new Error(errorMessage));
          }

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((newToken) => {
                if (originalRequest.headers && newToken) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshResponse = await axios.post<{ success?: boolean; data?: { token: string; refreshToken?: string }; token?: string; refreshToken?: string }>(
              `${APP_CONFIG.apiBaseUrl}/auth/refresh`,
              { token: refreshToken, refreshToken },
              { withCredentials: true }
            );

            const newToken =
              refreshResponse.data?.data?.token ||
              refreshResponse.data?.token;
            const newRefreshToken =
              refreshResponse.data?.data?.refreshToken ||
              refreshResponse.data?.refreshToken;

            if (newToken) {
              localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
              if (newRefreshToken) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
              }

              this.processQueue(null, newToken);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return this.client(originalRequest);
            } else {
              throw new Error("Invalid token refresh payload");
            }
          } catch (refreshErr) {
            this.processQueue(refreshErr, null);
            this.handleLogoutRedirect();
            return Promise.reject(refreshErr);
          } finally {
            this.isRefreshing = false;
          }
        }

        // ----------------------------------------------------
        // Handle 402 Payment Required (Quota Exceeded)
        // ----------------------------------------------------
        if (status === 402) {
          toast.error("Plan Limit Reached", {
            description: errorMessage || "You have reached your subscription quota. Please upgrade your plan.",
            duration: 6000,
          });

          // Dispatch global custom event caught by QuotaUpgradeHandler
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("omniflow:quota-exceeded", {
                detail: {
                  message: errorMessage,
                  details: errorData?.error?.details || errorData?.details,
                },
              })
            );
          }
        }

        // ----------------------------------------------------
        // Handle 403 Forbidden (RBAC Scope Violation)
        // ----------------------------------------------------
        if (status === 403) {
          toast.error("Access Restricted (RBAC)", {
            description: errorMessage || "You do not have permission for this action (insufficient role scope).",
          });
        }

        // ----------------------------------------------------
        // Global Error Normalization
        // ----------------------------------------------------
        const normalizedError = Object.assign(new Error(errorMessage), {
          status,
          message: errorMessage,
          code: errorData?.error?.code || errorData?.code,
          details: errorData?.error?.details || errorData?.details,
          data: errorData,
        });

        return Promise.reject(normalizedError);
      }
    );
  }

  private handleLogoutRedirect(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKSPACE);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj");
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = ROUTES.LOGIN;
    }
  }

  public setAuthToken(token: string): void {
    let cleanToken = token ? token.trim() : "";
    if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
      cleanToken = cleanToken.slice(1, -1).trim();
    }
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, cleanToken);
  }

  public clearAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKSPACE);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj");
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get(url, config);
    return res as unknown as T;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post(url, data, config);
    return res as unknown as T;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put(url, data, config);
    return res as unknown as T;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.patch(url, data, config);
    return res as unknown as T;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete(url, config);
    return res as unknown as T;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Singleton API Client ready for production integration
export const apiClient = new ApiClient();
