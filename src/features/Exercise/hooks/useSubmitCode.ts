// Vị trí mới: src/features/Exercise/hooks/useSubmitCode.ts

import { useState, useEffect } from 'react';
import { submitApi } from '../api/submitApi';
import type { SubmitResponse } from '../types/submitTypes';
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';

export function useSubmitCode(exerciseId?: string) {
  const { user } = useAuthContext_v2();

  const cacheKey = user?._id && exerciseId ? `submission_${user._id}_${exerciseId}` : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(() => {
    if (!cacheKey) return null;
    const cached = sessionStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    async function syncCache() {
      if (cacheKey) {
        const cached = sessionStorage.getItem(cacheKey);
        setSubmitResult(cached ? JSON.parse(cached) : null);
      } else {
        setSubmitResult(null);
      }
    }

    syncCache();
  }, [cacheKey]);

  async function submitCode(
    exId: string,
    lesson_id: string,
    code: string,
    language: string = 'python-3.14',
  ) {
    if (!user?._id) {
      setError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitApi.submitCode(exId, {
        exercise_id: exId,
        user_id: user._id,
        lesson_id,
        src_code: code,
        language,
      });

      if (cacheKey) {
        sessionStorage.setItem(cacheKey, JSON.stringify(response));
      }

      setSubmitResult(response);
    } catch (err: unknown) {
      // SENIOR CATCH: Dùng unknown thay vì any, sau đó check instanceof Error
      setError(err instanceof Error ? err.message : 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submitCode, isSubmitting, submitResult, error };
}
