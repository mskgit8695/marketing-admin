import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type User, type Workspace } from "@/types";
import { authApi } from "@/services/api/auth.api";
import { type LoginCredentials, type RegisterData } from "@/services/api/auth.service";
import { APP_CONFIG, STORAGE_KEYS } from "@/constants";
import { storage } from "@/services/storage/local-storage";
import { apiClient } from "@/services/api/client";

interface AuthContextValue {
  user: User | null;
  workspace: Workspace | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => {
    return storage.get<User | null>(STORAGE_KEYS.AUTH_USER, null);
  });
  const [token, setToken] = useState<string | null>(() => {
    return storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
  });
  const [workspace, setWorkspace] = useState<Workspace | null>(() => {
    return storage.get<Workspace | null>(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj", null);
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = storage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
        const savedUser = storage.get<User | null>(STORAGE_KEYS.AUTH_USER, null);

        if (savedToken && savedToken !== "mock_jwt_token_initial_demo") {
          apiClient.setAuthToken(savedToken);
          setUser(savedUser);
          setToken(savedToken);

          // Verify/refresh user state from server
          try {
            const remoteSession = await authApi.getCurrentUser();
            if (remoteSession?.user) {
              setUser(remoteSession.user);
              storage.set(STORAGE_KEYS.AUTH_USER, remoteSession.user);
              if (remoteSession.workspace) {
                setWorkspace(remoteSession.workspace);
                storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj", remoteSession.workspace);
              }
            }
          } catch {
            // Keep saved user session offline if network glitch
          }
        } else if (APP_CONFIG.useMock) {
          // Only auto-seed mock session if VITE_USE_MOCK is explicitly true
          const defaultSession = await authApi.getCurrentUser();
          if (defaultSession) {
            setUser(defaultSession.user);
            setWorkspace(defaultSession.workspace);
            setToken("mock_jwt_token_initial_demo");
            apiClient.setAuthToken("mock_jwt_token_initial_demo");
            storage.set(STORAGE_KEYS.AUTH_USER, defaultSession.user);
            storage.set(STORAGE_KEYS.AUTH_TOKEN, "mock_jwt_token_initial_demo");
            storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE, defaultSession.workspace.id);
            storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj", defaultSession.workspace);
          }
        } else {
          // Live backend: Clean unauthenticated state
          setUser(null);
          setToken(null);
          setWorkspace(null);
          apiClient.clearAuthToken();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      setToken(response.token);
      apiClient.setAuthToken(response.token);

      storage.set(STORAGE_KEYS.AUTH_USER, response.user);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, response.token);

      if (response.workspace) {
        setWorkspace(response.workspace);
        storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE, response.workspace.id);
        storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj", response.workspace);
      } else {
        // Fetch full profile and active workspace from /api/auth/me
        try {
          const remoteSession = await authApi.getCurrentUser();
          if (remoteSession?.workspace) {
            setWorkspace(remoteSession.workspace);
            storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE, remoteSession.workspace.id);
            storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj", remoteSession.workspace);
          }
          if (remoteSession?.user) {
            setUser(remoteSession.user);
            storage.set(STORAGE_KEYS.AUTH_USER, remoteSession.user);
          }
        } catch (e) {
          console.warn("[AuthContext] Unable to load remote workspace details:", e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      if (response?.user) {
        setUser(response.user);
        storage.set(STORAGE_KEYS.AUTH_USER, response.user);
      }

      if (response?.token) {
        setToken(response.token);
        apiClient.setAuthToken(response.token);
        storage.set(STORAGE_KEYS.AUTH_TOKEN, response.token);
      }

      if (response?.workspace) {
        setWorkspace(response.workspace);
        storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE, response.workspace.id);
        storage.set(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj", response.workspace);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setWorkspace(null);
      setToken(null);
      apiClient.clearAuthToken();

      storage.remove(STORAGE_KEYS.AUTH_USER);
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.ACTIVE_WORKSPACE);
      storage.remove(STORAGE_KEYS.ACTIVE_WORKSPACE + "_obj");

      // Invalidate and purge all tenant cached data from memory
      queryClient.clear();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
