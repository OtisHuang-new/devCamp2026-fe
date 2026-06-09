import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { fetchMeDeduped } from './api/authContextApi';
import type { UserInfo } from './types/contextTypes';

// vỏ hộp cục wifi bọc ở main.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const loginState = async (accessToken: string, userData: UserInfo) => {
    localStorage.setItem('access_token', accessToken);
    setToken(accessToken);

    setUser(userData);
    setIsLoading(false);

    try {
      const response = await fetchMeDeduped();

      if (response) {
        setUser(response);
      }
    } catch (error) {
      console.error('Failed to fetch full profile after login:', error);
    }
  };

  function logoutState() {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }

  const updateUser = (data: Partial<UserInfo>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  useEffect(() => {
    let isMounted = true;

    const checkCurrentUser = async () => {
      const localToken = localStorage.getItem('access_token');

      if (!localToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        if (isMounted) setToken(localToken);

        const response = await fetchMeDeduped();

        if (!isMounted) return;

        if (response && response._id) {
          setUser(response);
        } else {
          console.warn('API /auth/me trả về format không mong muốn:', response);
        }
      } catch (error: unknown) {
        if (!isMounted) return;

        console.error('Verify token failed:', error);

        if (axios.isAxiosError(error)) {
          const isUnauthorized = error?.status === 401 || error?.response?.status === 401;
          if (isUnauthorized) {
            logoutState();
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        loginState,
        logoutState,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
