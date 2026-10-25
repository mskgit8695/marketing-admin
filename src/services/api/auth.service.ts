import { type User, type Workspace } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  workspaceName: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  workspace?: Workspace;
  token: string;
  expiresIn?: number;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<{ success: boolean; message: string }>;
  resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<{ user: User; workspace: Workspace } | null>;
}
