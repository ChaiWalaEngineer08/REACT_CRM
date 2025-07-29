/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
// import axios from "axios";

import { AUTH_TOKEN_KEY } from "../constants/auth.constants"; // DEMO_CREDENTIALS gone
import { api } from "../api/clients";

/* ------------------------------------------------------------------ */
/*  Config                                                            */
/* ------------------------------------------------------------------ */
const IDLE_TIMEOUT_MS   = 30 * 60_000; // 30 min
const WARNING_OFFSET_MS = 60_000;      // warn 60 s before logout

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export type LoginResult = "ok";        // async throws on bad creds

type AuthCtx = {
  isAuth: boolean;
  warning: boolean;
  login(email: string, pw: string): Promise<LoginResult>;
  logout(): void;
  extendSession(): void;               // reset idle timer
};

const AuthContext = createContext<AuthCtx | null>(null);
export const useAuth = () => useContext(AuthContext)!;

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: ReactNode }) {
  /* ---------- auth state ------------------------------------------- */
  const [isAuth, setAuth] = useState(
    () => localStorage.getItem(AUTH_TOKEN_KEY) === "true",
  );
  const [expiresAt, setExp] = useState<number | null>(() => {
    const v = localStorage.getItem("expiresAt");
    return v ? +v : null;
  });
  const [warning, setWarning] = useState(false);

  /* ---------- helper refs ------------------------------------------ */
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /* ---------- kick / extend session -------------------------------- */
  const kickTimers = useCallback(() => {
    const next = Date.now() + IDLE_TIMEOUT_MS;
    localStorage.setItem("expiresAt", String(next));   // cross-tab sync
    setExp(next);
    setWarning(false);
  }, []);

  /* ---------- login ------------------------------------------------ */
  const login = async (email: string, pw: string): Promise<LoginResult> => {
  try {
    const { data } = await api.post<{ token: string }>('/login', {
      email,
      password: pw,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem(AUTH_TOKEN_KEY, "true");
    setAuth(true);
    kickTimers();
    return "ok";
  } catch (err: any) {
    const code = err.response?.data?.error;

    if (code === 'email_not_found') {
      throw new Error('EMAIL_NOT_FOUND');
    } else if (code === 'incorrect_password') {
      throw new Error('INCORRECT_PASSWORD');
    } else {
      throw new Error('GENERIC_LOGIN_FAILURE');
    }
  }
};


  /* ---------- logout ----------------------------------------------- */
  const logout = useCallback(() => {
    clearTimers();
    localStorage.removeItem("token");         // ← clear JWT
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("expiresAt");
    setAuth(false);
    setExp(null);
    setWarning(false);
  }, []);

  /* ---------- activity listener (idle reset) ----------------------- */
  useEffect(() => {
    if (!isAuth) return;

    const onActivity = () => kickTimers();
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];
    events.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true }),
    );
    return () =>
      events.forEach((e) => window.removeEventListener(e, onActivity));
  }, [isAuth, kickTimers]);

  /* ---------- cross-tab expiry sync -------------------------------- */
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === "expiresAt") setExp(e.newValue ? +e.newValue : null);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  /* ---------- watchdog (warn + auto-logout) ------------------------ */
  useEffect(() => {
    clearTimers();
    if (!isAuth || !expiresAt) return;

    const now      = Date.now();
    const warnIn   = Math.max(expiresAt - WARNING_OFFSET_MS - now, 0);
    const logoutIn = Math.max(expiresAt - now, 0);

    timers.current.push(
      window.setTimeout(() => setWarning(true), warnIn),
      window.setTimeout(() => logout(), logoutIn),
    );

    return clearTimers;
  }, [isAuth, expiresAt, logout]);

  /* ------------------------------------------------------------------ */
  return (
    <AuthContext.Provider
      value={{ isAuth, warning, login, logout, extendSession: kickTimers }}
    >
      {children}
    </AuthContext.Provider>
  );
}
