import { useState, useEffect } from 'react';
import { evaluatorApi } from '../../Exercise/api/evaluatorApi';
import type { EvaluateResponse } from '../../Exercise/types/evaluatorTypes';
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';

// --- 1. HẠ TẦNG CACHE VÀ DEDUPING ---
const pendingEvaluations = new Map<string, Promise<EvaluateResponse | null>>();
const CACHE_PREFIX = 'ai_eval_';

const getCache = (submissionId: string): EvaluateResponse | null => {
  const cached = sessionStorage.getItem(`${CACHE_PREFIX}${submissionId}`);
  return cached ? JSON.parse(cached) : null;
};

const setCache = (submissionId: string, data: EvaluateResponse) => {
  sessionStorage.setItem(`${CACHE_PREFIX}${submissionId}`, JSON.stringify(data));
};

// --- 2. HÀM LÕI (CORE FETCHER) ---
const fetchAndCacheEvaluation = async (
  submissionId: string,
  userId: string,
): Promise<EvaluateResponse | null> => {
  const cachedData = getCache(submissionId);
  if (cachedData) return cachedData; // Có cache -> Trả về ngay

  if (pendingEvaluations.has(submissionId)) {
    return pendingEvaluations.get(submissionId) as Promise<EvaluateResponse | null>; // Có promise đang chạy -> Ké kết quả
  }

  const requestPromise = (async () => {
    try {
      const response = await evaluatorApi.evaluateSubmission(submissionId, {
        isExercise: true,
        userId: userId,
      });
      if (response) {
        setCache(submissionId, response);
        return response;
      }
      return null;
    } finally {
      pendingEvaluations.delete(submissionId); // Luôn dọn dẹp hàng đợi
    }
  })();

  pendingEvaluations.set(submissionId, requestPromise);
  return requestPromise;
};

// --- 3. HOOK CHÍNH ---
export const useEvaluateSubmission = (submissionId: string | undefined) => {
  const { user } = useAuthContext_v2();

  const [evaluationData, setEvaluationData] = useState<EvaluateResponse | null>(() => {
    return submissionId ? getCache(submissionId) : null;
  });

  const [isEvaluating, setIsEvaluating] = useState<boolean>(() => {
    return submissionId ? !getCache(submissionId) : false;
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId || !user?._id) return;

    let isMounted = true; // Biến cờ bảo vệ Pure Function

    const fetchEvaluation = async () => {
      if (getCache(submissionId)) {
        setEvaluationData(getCache(submissionId));
        setIsEvaluating(false);
        setError(null);
        return;
      }

      setIsEvaluating(true);
      setError(null);

      try {
        const data = await fetchAndCacheEvaluation(submissionId, user._id);
        if (isMounted && data) {
          setEvaluationData(data);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || JSON.stringify(err) || 'Failed to fetch AI evaluation');
        }
      } finally {
        if (isMounted) {
          setIsEvaluating(false);
        }
      }
    };

    fetchEvaluation();

    return () => {
      isMounted = false; // Cleanup: Hủy cập nhật state nếu component unmount
    };
  }, [submissionId, user?._id]);

  return { isEvaluating, evaluationData, error };
};
