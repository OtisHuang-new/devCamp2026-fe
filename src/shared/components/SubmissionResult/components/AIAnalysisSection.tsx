// Vị trí: src/shared/components/SubmissionResult/components/AIAnalysisSection.tsx
import { useState } from 'react';
import type { AIEvaluation } from '../../../../features/Exercise/types/submitTypes';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';
import { evaluatorApi } from '../../../../features/Exercise/api/evaluatorApi';
import { useAuthContext_v2 } from '../../../context/hooks/useAuthContext_v2';

interface AIAnalysisSectionProps {
  isAllPassed: boolean;
  evaluationData?: AIEvaluation;
  submissionId: string; // Khai báo prop mới
}

export default function AIAnalysisSection({
  isAllPassed,
  evaluationData,
  submissionId,
}: AIAnalysisSectionProps) {
  const { user } = useAuthContext_v2();

  // 1. STATE QUẢN LÝ NỘI BỘ
  const [localEval, setLocalEval] = useState<AIEvaluation | undefined>(evaluationData);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // 3. LOGIC GỌI API MANUALLY (Kiểm soát rõ ràng Promise)
  const handleReload = async () => {
    if (!user?._id || !submissionId) return;

    setIsEvaluating(true); // Chỉ hiện Loading khi bắt đầu chạy Promise
    try {
      const response = await evaluatorApi.evaluateSubmission(submissionId, {
        isExercise: true,
        userId: user._id,
      });

      if (response && response.AI_evaluation) {
        setLocalEval(response.AI_evaluation);
      }
    } catch (error) {
      console.error('Failed to reload AI Evaluation:', error);
    } finally {
      setIsEvaluating(false); // Đóng Loading khi Promise resolve/reject
    }
  };

  // --- RENDER LUỒNG 1: ĐANG CHẠY PROMISE ---
  if (isEvaluating) {
    return (
      <div className="pt-6 border-t border-gray-100 flex justify-start mb-6">
        <LoadingSpinner text="AI is evaluating your code..." iconSize="w-5 h-5" />
      </div>
    );
  }

  // --- RENDER LUỒNG 2: PROMISE ĐÃ CHẠY XONG NHƯNG DATA RỖNG ---
  if (!localEval) {
    return (
      <div className="pt-6 border-t border-gray-100 flex flex-col items-start gap-3 mb-6 animate-fadeIn">
        <span className="text-sm font-bold text-gray-500">
          No AI evaluation for this submission.
        </span>
        <button
          onClick={handleReload}
          className="text-xs font-bold bg-[#1E3A8A] text-white px-4 py-2 rounded-lg hover:bg-[#112255] transition-colors shadow-sm active:scale-95"
        >
          Reload for AI evaluation
        </button>
      </div>
    );
  }

  // --- RENDER LUỒNG 3: CÓ DATA, HIỂN THỊ UI BÌNH THƯỜNG ---
  const title1 = isAllPassed ? 'Clean Code:' : 'Error destination:';
  const title2 = isAllPassed ? 'Refactoring:' : 'How to fix:';

  return (
    <div className="grid grid-cols-2 gap-10 pt-4 border-t border-gray-100 animate-fadeIn">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">{title1}</h4>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
            {localEval.first_res || 'No detail description.'}
          </p>
        </div>
        {localEval.second_res && (
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">{title2}</h4>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {localEval.second_res}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
