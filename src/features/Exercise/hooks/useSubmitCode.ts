// Vị trí mới: src/features/Exercise/hooks/useSubmitCode.ts

import { useState, useEffect } from 'react';
import { submitApi } from '../api/submitApi';
import type { PostSubmitResponse } from '../types/submitTypes';
import { evaluatorApi } from '../api/evaluatorApi';
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';

export function useSubmitCode(exerciseId?: string) {
  const { user } = useAuthContext_v2();

  const cacheKey = user?._id && exerciseId ? `submission_${user._id}_${exerciseId}` : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. SỬA: Thay SubmitResponse bằng PostSubmitResponse
  const [submitResult, setSubmitResult] = useState<PostSubmitResponse | null>(() => {
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
      // HÀNH ĐỘNG 1: Gọi API Nộp bài (Bắt buộc thành công)
      const response = await submitApi.submitCode(exId, {
        exercise_id: exId,
        user_id: user._id,
        lesson_id,
        src_code: code,
        language,
      });

      // HÀNH ĐỘNG 2: Gọi AI đánh giá (Graceful Degradation - Lỗi thì bỏ qua)
      try {
        // Truyền response._id (chính là submissionId) vào API AI
        await evaluatorApi.evaluateSubmission(response._id, {
          isExercise: true,
          userId: user._id, // User ID đã được check tồn tại ở đầu hàm
        });
      } catch (aiError: unknown) {
        // Chỉ Log ra console, KHÔNG throw lỗi để luồng nộp bài vẫn đi tiếp
        console.warn(
          'AI Evaluation bị bỏ qua do lỗi (nhưng bài nộp đã thành công):',
          aiError instanceof Error ? aiError.message : String(aiError),
        );
      }

      if (cacheKey) {
        sessionStorage.setItem(cacheKey, JSON.stringify(response));
      }

      setSubmitResult(response);
    } catch (err: unknown) {
      // Chỉ những lỗi nghiêm trọng của HÀNH ĐỘNG 1 mới rớt xuống đây
      setError(err instanceof Error ? err.message : 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submitCode, isSubmitting, submitResult, error };
}
