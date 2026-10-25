import axios, { type InternalAxiosRequestConfig } from "axios";
import { STORAGE_KEYS } from "@/constants";

/**
 * Utility to retrieve CSRF token from document cookies, meta tag, or session storage.
 */
export const getCsrfToken = (): string => {
  // 1. Check document.cookie for XSRF-TOKEN or csrf_token
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)(?:XSRF-TOKEN|csrf_token)=([^;]*)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }

    // 2. Check meta tag <meta name="csrf-token" content="...">
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      const content = metaTag.getAttribute("content");
      if (content) return content;
    }

    // 3. Fallback to cryptographic session-bound token
    let sessionToken = sessionStorage.getItem("app_csrf_token");
    if (!sessionToken) {
      sessionToken = (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem("app_csrf_token", sessionToken);
    }
    return sessionToken;
  }
  return "";
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request Interceptor: Attach Auth JWT and CSRF Protection
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token && token !== "null" && token !== "undefined" && token.trim().length > 0 && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Attach CSRF token on mutating HTTP methods
  const mutatingMethods = ["post", "put", "patch", "delete"];
  if (config.method && mutatingMethods.includes(config.method.toLowerCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken && config.headers) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});

// Response Interceptor: Handle unauthenticated or token expiration gracefully
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKSPACE);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj");
      // Redirect to login only if not already on the login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
