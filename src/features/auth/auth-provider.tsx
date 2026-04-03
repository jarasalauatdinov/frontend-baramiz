import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { clearLocalValue, readLocalValue, writeLocalValue } from "@/shared/lib/storage";

const AUTH_ACCOUNTS_KEY = "baramiz.auth.accounts";
const AUTH_SESSION_KEY = "baramiz.auth.session";

export type AuthErrorCode = "invalid_credentials" | "email_exists" | "unknown";

export class AuthActionError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthActionError";
  }
}

interface AuthAccountRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
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
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(account: AuthAccountRecord): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
  };
}

function readAccounts() {
  return readLocalValue<AuthAccountRecord[]>(AUTH_ACCOUNTS_KEY) ?? [];
}

function writeAccounts(accounts: AuthAccountRecord[]) {
  writeLocalValue(AUTH_ACCOUNTS_KEY, accounts);
}

function readSession() {
  return readLocalValue<AuthUser>(AUTH_SESSION_KEY);
}

function writeSession(user: AuthUser) {
  writeLocalValue(AUTH_SESSION_KEY, user);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(readSession);

  const login = useCallback(async ({ email, password }: LoginInput) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = readAccounts().find(
      (entry) => entry.email.toLowerCase() === normalizedEmail && entry.password === password,
    );

    if (!account) {
      throw new AuthActionError("invalid_credentials");
    }

    const authUser = toAuthUser(account);
    writeSession(authUser);
    setUser(authUser);
    return authUser;
  }, []);

  const register = useCallback(async ({ name, email, password }: RegisterInput) => {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = readAccounts();

    if (accounts.some((entry) => entry.email.toLowerCase() === normalizedEmail)) {
      throw new AuthActionError("email_exists");
    }

    const nextAccount: AuthAccountRecord = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    writeAccounts([...accounts, nextAccount]);

    const authUser = toAuthUser(nextAccount);
    writeSession(authUser);
    setUser(authUser);
    return authUser;
  }, []);

  const logout = useCallback(() => {
    clearLocalValue(AUTH_SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [login, logout, register, user],
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
