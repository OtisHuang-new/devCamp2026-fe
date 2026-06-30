// Vị trí mới: src/features/Exercise/hooks/useEvaluateSubmission.ts

import { useState, useEffect } from 'react';
import { evaluatorApi } from '../api/evaluatorApi';
import type { EvaluateResponse } from '../types/evaluatorTypes';
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';

// --- 1. HẠ TẦNG CACHE VÀ DEDUPING ---
const pendingEvaluations = new Map<string, Promise<EvaluateResponse | null>>();
const CACHE_PREFIX = 'ai_eval_';

function getCache(submissionId: string): EvaluateResponse | null {
  const cached = sessionStorage.getItem(`${CACHE_PREFIX}${submissionId}`);
  return cached ? JSON.parse(cached) : null;
}

function setCache(submissionId: string, data: EvaluateResponse) {
  sessionStorage.setItem(`${CACHE_PREFIX}${submissionId}`, JSON.stringify(data));
}

// --- 2. HÀM LÕI (CORE FETCHER) ---
async function fetchAndCacheEvaluation(submissionId: string): Promise<EvaluateResponse | null> {
  const cachedData = getCache(submissionId);
  if (cachedData) return cachedData; // Có cache -> Trả về ngay

  if (pendingEvaluations.has(submissionId)) {
    return pendingEvaluations.get(submissionId) as Promise<EvaluateResponse | null>;
  }

  const requestPromise = (async () => {
    try {
      // 2. Gọi API sạch không có data body
      const response = await evaluatorApi.evaluateSubmission(submissionId);
      if (response) {
        setCache(submissionId, response);
        return response;
      }
      return null;
    } finally {
      pendingEvaluations.delete(submissionId);
    }
  })();

  pendingEvaluations.set(submissionId, requestPromise);
  return requestPromise;
}

// --- 3. HOOK CHÍNH ---
export function useEvaluateSubmission(submissionId: string | undefined) {
  const { user } = useAuthContext_v2();

  // SENIOR FIX: Rút ID ra thành một biến chuỗi (Primitive) ngay từ đầu
  const userId = user?._id;

  const [evaluationData, setEvaluationData] = useState<EvaluateResponse | null>(() => {
    return submissionId ? getCache(submissionId) : null;
  });

  const [isEvaluating, setIsEvaluating] = useState<boolean>(() => {
    return submissionId ? !getCache(submissionId) : false;
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Chỉ sử dụng biến chuỗi userId, Linter sẽ không đòi theo dõi cả cục Object user nữa
    if (!submissionId || !userId) return;

    let isMounted = true;

    async function fetchEvaluation() {
      if (getCache(submissionId!)) {
        setEvaluationData(getCache(submissionId!));
        setIsEvaluating(false);
        setError(null);
        return;
      }

      setIsEvaluating(true);
      setError(null);

      try {
        const data = await fetchAndCacheEvaluation(submissionId!);
        if (isMounted && data) {
          setEvaluationData(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch AI evaluation');
        }
      } finally {
        if (isMounted) {
          setIsEvaluating(false);
        }
      }
    }

    fetchEvaluation();

    return () => {
      isMounted = false;
    };
  }, [submissionId, userId]); // Dùng userId làm dependency an toàn

  return { isEvaluating, evaluationData, error };
}
