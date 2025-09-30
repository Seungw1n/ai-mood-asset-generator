export const SESSION_KEY = 'nano-banana-session';
export const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

export interface Session {
  isLoggedIn: boolean;
  loginTime: number;
}

export const getSession = (): Session | null => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;

  try {
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Failed to parse session data:', error);
    return null;
  }
};

export const setSession = (session: Session): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const isSessionValid = (session: Session): boolean => {
  const now = new Date().getTime();
  return session.isLoggedIn && (now - session.loginTime < SESSION_DURATION);
};