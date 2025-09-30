import { useState, useEffect, useCallback } from 'react';
import { getSession, setSession, clearSession, isSessionValid, Session } from '../utils/session';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkSession = useCallback((): boolean => {
    const session = getSession();

    if (session && isSessionValid(session)) {
      setIsAuthenticated(true);
      return true;
    }

    logout();
    return false;
  }, []);

  const login = useCallback(() => {
    const session: Session = {
      isLoggedIn: true,
      loginTime: new Date().getTime(),
    };
    setSession(session);
    setIsAuthenticated(true);
    window.location.hash = '#/dashboard';
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setIsAuthenticated(false);
    window.location.hash = '#/login';
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    isAuthenticated,
    login,
    logout,
    checkSession,
  };
};