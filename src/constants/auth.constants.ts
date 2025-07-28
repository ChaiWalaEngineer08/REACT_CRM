/** where we keep auth-related literals / keys */
export const AUTH_TOKEN_KEY = 'demo-token';
export const IDLE_TIMEOUT_MS   = 30 * 60_000; // 30 min
export const WARNING_OFFSET_MS = 60_000;      // show modal 1 min before


export const DEMO_CREDENTIALS = {
    email: 'admin@demo.com',
    password: '@Passw0rd',
} as const;
