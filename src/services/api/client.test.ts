import { describe, it, expect, beforeEach } from "vitest";
import { ApiClient } from "./client";
import { STORAGE_KEYS } from "@/constants";

describe("ApiClient", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("stores and clears authentication token in localStorage", () => {
    const client = new ApiClient();

    client.setAuthToken("test-jwt-token-123");
    expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe("test-jwt-token-123");

    client.clearAuthToken();
    expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
  });

  it("provides getAxiosInstance and exposes HTTP methods", () => {
    const client = new ApiClient({ baseURL: "http://localhost:5000/api", timeout: 5000 });
    const instance = client.getAxiosInstance();

    expect(instance.defaults.baseURL).toBe("http://localhost:5000/api");
    expect(instance.defaults.timeout).toBe(5000);
    expect(typeof client.get).toBe("function");
    expect(typeof client.post).toBe("function");
    expect(typeof client.put).toBe("function");
    expect(typeof client.delete).toBe("function");
  });
});
