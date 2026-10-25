import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePermission } from "./usePermission";
import * as AuthContextModule from "@/features/auth/context/AuthContext";
import type { User } from "@/types";

describe("usePermission", () => {
  it("returns default falsy permissions when user is null", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: null,
      workspace: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermission());
    expect(result.current.isSuperAdmin).toBe(false);
    expect(result.current.hasScope("crm:read")).toBe(false);
    expect(result.current.hasRole(["Admin"])).toBe(false);
  });

  it("grants all scopes to Owner and Admin roles via wildcard", () => {
    const adminUser: User = {
      id: "usr-1",
      name: "Admin User",
      email: "admin@omniflow.local",
      role: "Admin",
      avatarUrl: "",
      createdAt: "",
    };

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: adminUser,
      workspace: null,
      token: "tok",
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermission());
    expect(result.current.hasScope("crm:read")).toBe(true);
    expect(result.current.hasScope("campaigns:send")).toBe(true);
    expect(result.current.hasScope("random:custom:scope")).toBe(true);
    expect(result.current.hasRole(["Admin"])).toBe(true);
    expect(result.current.hasRole(["Viewer"])).toBe(false);
  });

  it("identifies super_admin flag and role correctly", () => {
    const superAdminUser: User = {
      id: "usr-2",
      name: "Super Admin",
      email: "super@omniflow.local",
      role: "super_admin",
      isSuperAdmin: true,
      avatarUrl: "",
      createdAt: "",
    };

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: superAdminUser,
      workspace: null,
      token: "tok",
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermission());
    expect(result.current.isSuperAdmin).toBe(true);
    expect(result.current.hasScope("anything")).toBe(true);
  });

  it("restricts viewer to read-only scopes", () => {
    const viewerUser: User = {
      id: "usr-3",
      name: "Viewer User",
      email: "viewer@omniflow.local",
      role: "Viewer",
      avatarUrl: "",
      createdAt: "",
    };

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: viewerUser,
      workspace: null,
      token: "tok",
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => usePermission());
    expect(result.current.isSuperAdmin).toBe(false);
    expect(result.current.hasScope("crm:read")).toBe(true);
    expect(result.current.hasScope("crm:write")).toBe(false);
    expect(result.current.hasScope("campaigns:send")).toBe(false);
  });
});
