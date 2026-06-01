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

      loginState(response.access_token, response.user);

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
