// Vị trí: src/features/LessonDetail/hooks/useSubmitCode.ts
import { useState } from 'react';
import { submitApi } from '../../Exercise/api/submitApi';
import type { SubmitResponse } from '../../Exercise/types/submitTypes';
// Lưu ý: Cập nhật lại đường dẫn import useAuthContext cho khớp với dự án của bạn
import { useAuthContext } from '../../../shared/context/AuthContext';

export const useSubmitCode = () => {
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitCode = async (
    exerciseId: string,
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
      const response = await submitApi.submitCode(exerciseId, {
        exerciseId,
        userId: user._id,
        lessonId,
        src_code: code,
        language,
      });
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
