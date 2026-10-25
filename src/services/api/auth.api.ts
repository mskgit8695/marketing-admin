import { apiClient } from "./client";
import {
  type AuthService,
  type LoginCredentials,
  type RegisterData,
  type ResetPasswordData,
  type AuthResponse,
} from "./auth.service";
import { type User, type Workspace } from "@/types";
import { authService as mockAuthService } from "@/services/mock/auth.mock";
import { APP_CONFIG, STORAGE_KEYS } from "@/constants";
import { storage } from "@/services/storage/local-storage";

export interface WorkspaceSwitchResponse {
  token: string;
  refreshToken?: string;
  workspace: Workspace;
  user?: User;
}

export class RealAuthService implements AuthService {
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (APP_CONFIG.useMock) {
      return mockAuthService.login(credentials);
    }
    try {
      // Backend schema strictly accepts only { email, password }
      const payload = {
        email: credentials.email.trim(),
        password: credentials.password,
      };

      const raw = await apiClient.post<any>("/auth/login", payload);
      const authData = (raw && "data" in raw && raw.data) ? raw.data : raw;
      const token = authData?.token || authData?.accessToken;
      const user = authData?.user;
      const workspace = authData?.workspace;

      if (token) {
        apiClient.setAuthToken(token);
      }
      return {
        user,
        token: token || "",
        workspace,
      };
    } catch (err: unknown) {
      // Graceful fallback to mock service if backend is offline in development
      const isNetworkError =
        (err as { code?: string; status?: number })?.code === "ERR_NETWORK" ||
        (err as { status?: number })?.status === 502 ||
        (err as { status?: number })?.status === 503;
      if (isNetworkError) {
        console.warn("[Auth] Backend unreachable, falling back to mock authentication.");
        return mockAuthService.login(credentials);
      }
      throw err;
    }
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    if (APP_CONFIG.useMock) {
      return mockAuthService.register(data);
    }
    try {
      // Backend expects { name, email, password }
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
      };

      const raw = await apiClient.post<any>("/auth/register", payload);
      const res = raw?.data || raw;

      if (res?.token) {
        apiClient.setAuthToken(res.token);
      }

      return {
        user: res?.user,
        token: res?.token || "",
        workspace: res?.workspace,
      };
    } catch (err: unknown) {
      const isNetworkError = (err as { code?: string })?.code === "ERR_NETWORK";
      if (isNetworkError) {
        console.warn("[Auth] Backend unreachable, falling back to mock registration.");
        return mockAuthService.register(data);
      }
      throw err;
    }
  }

  public async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (APP_CONFIG.useMock) {
      return mockAuthService.forgotPassword(email);
    }
    try {
      return await apiClient.post<{ success: boolean; message: string }>("/auth/forgot-password", { email });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAuthService.forgotPassword(email);
      }
      throw err;
    }
  }

  public async resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
    if (APP_CONFIG.useMock) {
      return mockAuthService.resetPassword(data);
    }
    try {
      return await apiClient.post<{ success: boolean; message: string }>("/auth/reset-password", data);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAuthService.resetPassword(data);
      }
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      if (!APP_CONFIG.useMock) {
        await apiClient.post("/auth/logout").catch(() => {});
      }
    } finally {
      apiClient.clearAuthToken();
    }
  }

  public async getCurrentUser(): Promise<{ user: User; workspace: Workspace; workspaces?: Workspace[] } | null> {
    if (APP_CONFIG.useMock) {
      return mockAuthService.getCurrentUser();
    }
    try {
      const raw = await apiClient.get<any>("/auth/me");
      const result = (raw && "data" in raw && (raw.data?.user || raw.data?.workspace)) ? raw.data : raw;
      return result;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ERR_NETWORK") {
        return mockAuthService.getCurrentUser();
      }
      return null;
    }
  }

  public async switchWorkspace(workspaceId: string): Promise<WorkspaceSwitchResponse> {
    if (APP_CONFIG.useMock) {
      const current = storage.get<Workspace[]>("mock_workspaces", []);
      const matched = current.find((w) => w.id === workspaceId);
      const ws = matched || {
        id: workspaceId,
        name: "Switched Workspace",
        slug: "switched-workspace",
        planId: "plan-pro",
        ownerId: "mock_owner",
        createdAt: new Date().toISOString(),
      };
      return {
        token: `mock_jwt_switched_${workspaceId}`,
        workspace: ws,
      };
    }

    const response = await apiClient.post<WorkspaceSwitchResponse>("/workspaces/switch", {
      workspaceId,
    });

    if (response?.token) {
      apiClient.setAuthToken(response.token);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refreshToken) {
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
    }

    return response;
  }

  public async getWorkspaces(): Promise<Workspace[]> {
    if (APP_CONFIG.useMock) {
      return [
        {
          id: "ws-1",
          name: "Acme Growth Labs",
          slug: "acme-growth",
          planId: "plan-pro",
          ownerId: "user-1",
          createdAt: "2026-01-15T10:00:00Z",
        },
        {
          id: "ws-2",
          name: "Starlight Media Group",
          slug: "starlight-media",
          planId: "plan-enterprise",
          ownerId: "user-1",
          createdAt: "2026-03-20T14:30:00Z",
        },
      ];
    }
    try {
      const result = await apiClient.get<Workspace[]>("/workspaces");
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  }

  public async inviteWorkspaceMember(workspaceId: string, email: string, role: string): Promise<{ success: boolean; message: string }> {
    if (APP_CONFIG.useMock) {
      return { success: true, message: `Invitation sent to ${email}` };
    }
    return apiClient.post<{ success: boolean; message: string }>("/workspaces/invite", {
      workspaceId,
      email,
      role,
    });
  }

  public async updateMemberRole(workspaceId: string, memberId: string, role: string): Promise<boolean> {
    if (APP_CONFIG.useMock) {
      return true;
    }
    await apiClient.patch(`/workspaces/${workspaceId}/members/${memberId}/role`, { role });
    return true;
  }
}

export const authApi = new RealAuthService();
