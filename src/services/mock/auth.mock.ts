import {
  type AuthService,
  type LoginCredentials,
  type RegisterData,
  type ResetPasswordData,
  type AuthResponse,
} from "@/services/api/auth.service";
import { type User, type Workspace } from "@/types";

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

const DEMO_USERS: Record<string, { user: User; workspace: Workspace; passwordHash: string }> = {
  "admin@omniflow.io": {
    user: {
      id: "usr_admin_01",
      email: "admin@omniflow.io",
      name: "Marcus Vance",
      role: "super_admin",
      createdAt: "2026-01-01T00:00:00Z",
      lastLoginAt: new Date().toISOString(),
    },
    workspace: {
      id: "ws_acme_01",
      name: "Acme Growth Labs",
      slug: "acme-growth",
      planId: "plan-enterprise",
      ownerId: "usr_admin_01",
      createdAt: "2026-01-01T00:00:00Z",
    },
    passwordHash: "OmniFlow2026!",
  },
  "demo@company.com": {
    user: {
      id: "usr_demo_02",
      email: "demo@company.com",
      name: "Elena Fisher",
      role: "marketer",
      createdAt: "2026-02-15T00:00:00Z",
      lastLoginAt: new Date().toISOString(),
    },
    workspace: {
      id: "ws_starlight_02",
      name: "Starlight Media Group",
      slug: "starlight-media",
      planId: "plan-pro",
      ownerId: "usr_demo_02",
      createdAt: "2026-02-15T00:00:00Z",
    },
    passwordHash: "OmniFlow2026!",
  },
};

export class MockAuthService implements AuthService {
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(700);

    const email = credentials.email.toLowerCase().trim();
    const existing = DEMO_USERS[email];

    // For ease of evaluation, allow any valid password if it matches or if it's the demo account
    if (existing) {
      if (credentials.password !== existing.passwordHash && credentials.password.length < 6) {
        throw new Error("Invalid email or password. Please check your credentials.");
      }

      return {
        user: existing.user,
        workspace: existing.workspace,
        token: `mock_jwt_token_${existing.user.id}_${Date.now()}`,
        expiresIn: 86400 * 7,
      };
    }

    // Allow user to log in with arbitrary email for testing
    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      role: "workspace_owner",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const newWorkspace: Workspace = {
      id: `ws_${Date.now()}`,
      name: `${newUser.name}'s Workspace`,
      slug: newUser.name.toLowerCase().replace(/\s+/g, "-"),
      planId: "plan-pro",
      ownerId: newUser.id,
      createdAt: new Date().toISOString(),
    };

    return {
      user: newUser,
      workspace: newWorkspace,
      token: `mock_jwt_token_${newUser.id}_${Date.now()}`,
      expiresIn: 86400 * 7,
    };
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    await delay(800);

    const email = data.email.toLowerCase().trim();
    if (DEMO_USERS[email]) {
      throw new Error("An account with this email address already exists.");
    }

    const userId = `usr_reg_${Date.now()}`;
    const workspaceId = `ws_reg_${Date.now()}`;

    const user: User = {
      id: userId,
      email,
      name: data.fullName.trim(),
      role: "workspace_owner",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const workspace: Workspace = {
      id: workspaceId,
      name: data.workspaceName.trim(),
      slug: data.workspaceName.trim().toLowerCase().replace(/\s+/g, "-"),
      planId: "plan-pro",
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };

    return {
      user,
      workspace,
      token: `mock_jwt_token_${userId}_${Date.now()}`,
      expiresIn: 86400 * 7,
    };
  }

  public async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await delay(600);
    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}.`,
    };
  }

  public async resetPassword(_data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
    await delay(700);
    return {
      success: true,
      message: "Your password has been successfully reset. Please log in with your new password.",
    };
  }

  public async logout(): Promise<void> {
    await delay(300);
  }

  public async getCurrentUser(): Promise<{ user: User; workspace: Workspace } | null> {
    await delay(200);
    const demo = DEMO_USERS["admin@omniflow.io"];
    return { user: demo.user, workspace: demo.workspace };
  }
}

// Export singleton instance of MockAuthService
export const authService: AuthService = new MockAuthService();
