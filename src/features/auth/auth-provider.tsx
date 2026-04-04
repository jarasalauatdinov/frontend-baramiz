import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  getCurrentAuthenticatedUser,
  loginWithBackend,
  logoutCurrentUser,
  registerWithBackend,
} from "@/shared/api/baramiz";
import { ApiRequestError } from "@/shared/api/client";
import { clearAuthSession, readAuthSession, writeAuthSession } from "@/shared/lib/auth-storage";
import type { AuthPayload, AuthUser } from "@/shared/types/api";

export type AuthErrorCode = "invalid_credentials" | "email_exists" | "unauthorized" | "unknown";

export class AuthActionError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "AuthActionError";
  }
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapAuthError(error: unknown): AuthActionError {
  if (!(error instanceof ApiRequestError)) {
    return new AuthActionError("unknown");
  }

  if (error.status === 409) {
    return new AuthActionError("email_exists", error.message);
  }

  if (error.status === 400 || error.status === 401) {
    return new AuthActionError("invalid_credentials", error.message);
  }

  if (error.status === 403) {
    return new AuthActionError("unauthorized", error.message);
  }

  return new AuthActionError("unknown", error.message);
}

function persistAuthSession(session: AuthPayload) {
  writeAuthSession({
    user: session.user,
    token: session.token,
    expiresAt: session.expiresAt,
  });
}

function clearPersistedAuthState(setUser: (user: AuthUser | null) => void) {
  clearAuthSession();
  setUser(null);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const existingSession = readAuthSession();

    if (!existingSession?.token) {
      setIsReady(true);
      return () => {
        isMounted = false;
      };
    }

    void (async () => {
      try {
        const nextUser = await getCurrentAuthenticatedUser();
        if (!isMounted) {
          return;
        }

        setUser(nextUser);
        persistAuthSession({
          user: nextUser,
          token: existingSession.token,
          expiresAt: existingSession.expiresAt,
        });
      } catch {
        if (isMounted) {
          clearPersistedAuthState(setUser);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async ({ email, password }: LoginInput) => {
    try {
      const payload = await loginWithBackend({
        email: email.trim().toLowerCase(),
        password,
      });

      persistAuthSession(payload);
      setUser(payload.user);
      return payload.user;
    } catch (error) {
      throw mapAuthError(error);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }: RegisterInput) => {
    try {
      const payload = await registerWithBackend({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      persistAuthSession(payload);
      setUser(payload.user);
      return payload.user;
    } catch (error) {
      throw mapAuthError(error);
    }
  }, []);

  const logout = useCallback(async () => {
    const existingSession = readAuthSession();
    clearPersistedAuthState(setUser);

    if (existingSession?.token) {
      try {
        await logoutCurrentUser(existingSession.token);
      } catch {
        return;
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      login,
      register,
      logout,
    }),
    [isReady, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
