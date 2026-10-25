import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "./AuthGuard";
import * as AuthContextModule from "@/features/auth/context/AuthContext";
import type { User } from "@/types";

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner when authentication is initializing", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: null,
      workspace: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(screen.getByText("Verifying workspace session...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to /login", () => {
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

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <div>Dashboard Content</div>
              </AuthGuard>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("renders protected content when user is authenticated", () => {
    const user: User = {
      id: "u-1",
      name: "Standard User",
      email: "user@example.com",
      role: "Marketing Manager",
      avatarUrl: "",
      createdAt: "",
    };

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user,
      workspace: null,
      token: "valid-jwt",
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthGuard>
          <div>Protected Dashboard</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Dashboard")).toBeInTheDocument();
  });

  it("blocks non-super-admin from requireSuperAdmin routes", () => {
    const regularUser: User = {
      id: "u-2",
      name: "Regular Admin",
      email: "reg@example.com",
      role: "Admin",
      isSuperAdmin: false,
      avatarUrl: "",
      createdAt: "",
    };

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: regularUser,
      workspace: null,
      token: "valid-jwt",
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route
            path="/admin/dashboard"
            element={
              <AuthGuard requireSuperAdmin>
                <div>Super Admin Console</div>
              </AuthGuard>
            }
          />
          <Route path="/dashboard" element={<div>Workspace Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Workspace Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Super Admin Console")).not.toBeInTheDocument();
  });

  it("allows super_admin into requireSuperAdmin routes", () => {
    const superAdmin: User = {
      id: "u-3",
      name: "Root Admin",
      email: "root@example.com",
      role: "super_admin",
      isSuperAdmin: true,
      avatarUrl: "",
      createdAt: "",
    };

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: superAdmin,
      workspace: null,
      token: "valid-jwt",
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AuthGuard requireSuperAdmin>
          <div>Super Admin Console</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(screen.getByText("Super Admin Console")).toBeInTheDocument();
  });
});
