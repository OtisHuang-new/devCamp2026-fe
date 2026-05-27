import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

// Định nghĩa cấu trúc User bám sát Schema AuthModel từ Backend
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
  isLoading: boolean; // Tránh hiện tượng flash giao diện khi đang check token cũ
  loginState: (token: string, user: UserInfo) => void;
  logoutState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- THAY ĐỔI: Chuyển hàm loginState thành async ---
  const loginState = async (accessToken: string, userData: UserInfo) => {
    // 1. Lưu token vào localStorage ngay lập tức để axiosClient có thể sử dụng
    localStorage.setItem('access_token', accessToken);
    setToken(accessToken);

    // 2. Set tạm userData cơ bản (từ API Login trả về) để giao diện phản hồi nhanh
    setUser(userData);
    setIsLoading(false);

    // 3. Gọi ngay API /me để kéo toàn bộ data chi tiết (bao gồm current_lesson_id)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosClient.get('auth/me');
      if (response && response.status === 'success') {
        // 4. Cập nhật lại state user bằng dữ liệu ĐẦY ĐỦ từ backend
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch full profile after login:', error);
    }
  };

  // Hàm xóa trạng thái khi Đăng xuất
  const logoutState = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  // Kiểm tra token khi khởi chạy ứng dụng (Auto-login qua endpoint /me)
  useEffect(() => {
    const checkCurrentUser = async () => {
      const localToken = localStorage.getItem('access_token');

      if (!localToken) {
        setIsLoading(false);
        return;
      }

      try {
        setToken(localToken);
        // Gọi API /me đã định nghĩa ở Route phía Backend
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await axiosClient.get('auth/me');
        if (response && response.status === 'success') {
          setUser(response.data);
        } else {
          logoutState();
        }
      } catch (error) {
        console.error('Verify token failed:', error);
        logoutState();
      } finally {
        setIsLoading(false);
      }
    };

    checkCurrentUser();
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
