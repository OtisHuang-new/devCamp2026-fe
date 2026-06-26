// Vị trí: src/features/auth/hooks/useResetPassword.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useModalStore } from '../../../shared/store/useModalStore';
import { useToastStore } from '../../../shared/store/useToastStore';
import type { ResetPasswordRequest } from '../types/authTypes';

export function useResetPassword(token: string | undefined) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const openLogin = useModalStore((state) => state.openLogin);
  const addToast = useToastStore((state) => state.addToast);

  async function handleResetPassword(data: ResetPasswordRequest) {
    if (!token) {
      setError('Invalid or missing security token.');
      return;
    }

    // 1. FRONTEND VALIDATION KÉP: Chặn ngay lập tức nếu pass không khớp
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authApi.resetPassword(token, data);

      // 2. UX CHUYỂN HƯỚNG MƯỢT MÀ
      navigate('/roadmap'); // Đá về roadmap
      openLogin(); // Bật form login lên
      addToast('changed password successful', 6000, false); // Hiện thông báo 6 giây với tick xanh

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Passwords do not match.');
      } else if (err.response?.status === 401) {
        setError('Token has expired. Please request a new password reset.');
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return { handleResetPassword, isLoading, error, setError };
}
