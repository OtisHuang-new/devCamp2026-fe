import { useState } from 'react';
import { authApi } from '../api/authApi';
import type { LoginRequest, RegisterRequest } from '../types/authTypes';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginState } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(data);
      // Lưu token & user vào context + local storage
      loginState(response.access_token, response.user);
      navigate('/roadmap');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      // Đăng ký xong coi như login luôn
      loginState(response.access_token, response.user);

      // Xóa dữ liệu survey tạm thời đi cho sạch Local Storage
      localStorage.removeItem('survey_job');
      localStorage.removeItem('survey_level');

      navigate('/roadmap');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, handleRegister, isLoading, error };
};
