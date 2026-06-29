import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  authService,
  LoginCredentials,
  mapAuthUserToStorage,
} from "../services/authService";
import { storageService, UserInfo } from "../services/storageService";
import { DEMO_TOKEN } from "../utils/apiHelpers";

const DEMO_USER: UserInfo = {
  id: "demo-user",
  username: "admin",
  email: "admin@kwetugarage.com",
  first_name: "Admin",
  last_name: "Kwetu",
  role: "admin",
  is_active: true,
};

type AuthContextValue = {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  handleUnauthorized: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const [isLoggedIn, storedToken, storedUser] = await Promise.all([
      storageService.isLoggedIn(),
      storageService.getToken(),
      storageService.getUserInfo(),
    ]);
    if (isLoggedIn && storedToken) {
      setToken(storedToken);
      setUser(storedUser);
    } else {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Toujours afficher la page de connexion au lancement de l'application en nettoyant la session stockée
        await storageService.clearAuth();
      } catch (err) {
        console.error("Erreur lors du nettoyage de session au démarrage:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    await storageService.setToken(response.token);
    await storageService.setUserInfo(mapAuthUserToStorage(response.user));
    await storageService.setLoggedIn(true);
    setToken(response.token);
    setUser(mapAuthUserToStorage(response.user));
  }, []);

  const loginDemo = useCallback(async () => {
    await storageService.setToken(DEMO_TOKEN);
    await storageService.setUserInfo(DEMO_USER);
    await storageService.setLoggedIn(true);
    setToken(DEMO_TOKEN);
    setUser(DEMO_USER);
  }, []);

  const clearSession = useCallback(async () => {
    await storageService.clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    const currentToken = await storageService.getToken();
    if (currentToken !== DEMO_TOKEN) {
      try {
        await authService.logout();
      } catch {
        // ignore
      }
    }
    await clearSession();
  }, [clearSession]);

  const handleUnauthorized = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        isDemo: token === DEMO_TOKEN,
        isLoading,
        login,
        loginDemo,
        logout,
        refreshSession,
        handleUnauthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
