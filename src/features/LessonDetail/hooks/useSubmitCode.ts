import { useState, useEffect } from 'react';
import { submitApi } from '../../Exercise/api/submitApi';
import type { SubmitResponse } from '../../Exercise/types/submitTypes';
import { useAuthContext } from '../../../shared/context/AuthContext';

export const useSubmitCode = (exerciseId?: string) => {
  const { user } = useAuthContext();

  const cacheKey = user?._id && exerciseId ? `submission_${user._id}_${exerciseId}` : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(() => {
    if (!cacheKey) return null;
    const cached = sessionStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    const syncCache = async () => {
      if (cacheKey) {
        const cached = sessionStorage.getItem(cacheKey);
        setSubmitResult(cached ? JSON.parse(cached) : null);
      } else {
        setSubmitResult(null);
      }
    };

    syncCache();
  }, [cacheKey]);

  const submitCode = async (
    exId: string,
    lessonId: string,
    code: string,
    language: string = 'python-3.14',
  ) => {
    if (!user?._id) {
      setError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitApi.submitCode(exId, {
        exerciseId: exId,
        userId: user._id,
        lessonId,
        src_code: code,
        language,
      });

      if (cacheKey) {
        sessionStorage.setItem(cacheKey, JSON.stringify(response));
      }

      setSubmitResult(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitCode, isSubmitting, submitResult, error };
};
