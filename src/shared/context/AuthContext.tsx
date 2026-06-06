import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  current_lesson_id: string | null;
  current_streak: number;
  score_avg: number;
  information: {
    job: string;
    level: number;
  };
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginState: (token: string, user: UserInfo) => void;
  logoutState: () => void;
  updateUser: (data: Partial<UserInfo>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let pendingMeRequest: Promise<unknown> | null = null;

const fetchMeDeduped = () => {
  if (pendingMeRequest) return pendingMeRequest;

  pendingMeRequest = axiosClient.get('auth/me').finally(() => {
    pendingMeRequest = null;
  });

  return pendingMeRequest;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const loginState = async (accessToken: string, userData: UserInfo) => {
    localStorage.setItem('access_token', accessToken);
    setToken(accessToken);

    setUser(userData);
    setIsLoading(false);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await fetchMeDeduped();
      if (response) {
        setUser(response);
      }
    } catch (error) {
      console.error('Failed to fetch full profile after login:', error);
    }
  };

  const logoutState = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await fetchMeDeduped();

        if (!isMounted) return;

        const userData = response.data ? response.data : response;

        if (userData && userData._id) {
          setUser(userData);
        } else {
          console.warn('API /auth/me trả về format không mong muốn:', response);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (!isMounted) return;

        console.error('Verify token failed:', error);
        const isUnauthorized = error?.status === 401 || error?.response?.status === 401;
        if (isUnauthorized) {
          logoutState();
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
};

// Hook tiện ích để lấy nhanh dữ liệu Auth ở các component con
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
