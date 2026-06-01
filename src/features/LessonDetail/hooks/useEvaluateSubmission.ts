import { useState, useEffect } from 'react';
import { evaluatorApi } from '../../Exercise/api/evaluatorApi';
import type { EvaluateResponse } from '../../Exercise/types/evaluatorTypes';
import { useAuthContext } from '../../../shared/context/AuthContext';

export const useEvaluateSubmission = (submissionId: string | undefined) => {
  const { user } = useAuthContext();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationData, setEvaluationData] = useState<EvaluateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId || !user?._id) return;

    const fetchEvaluation = async () => {
      setIsEvaluating(true);
      setError(null);

      try {
        const response = await evaluatorApi.evaluateSubmission(submissionId, {
          isExercise: true,
          userId: user._id,
        });
        setEvaluationData(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.message || JSON.stringify(err) || 'Failed to fetch AI evaluation');
      } finally {
        setIsEvaluating(false);
      }
    };

    fetchEvaluation();
  }, [submissionId, user?._id]);

  return { isEvaluating, evaluationData, error };
};
