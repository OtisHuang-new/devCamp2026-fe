// Vị trí: src/features/auth/hooks/useForgotPassword.ts
import { useState } from 'react';
import { authApi } from '../api/authApi';

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleForgotPassword(email: string) {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await authApi.forgotPassword({ email });
      setSuccessMessage(response.message || 'Please check your email for the reset link.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Email is not registered in our system.');
      } else {
        setError(err.message || 'Failed to process request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  function resetStates() {
    setError(null);
    setSuccessMessage(null);
  }

  return { handleForgotPassword, isLoading, error, successMessage, resetStates };
}
