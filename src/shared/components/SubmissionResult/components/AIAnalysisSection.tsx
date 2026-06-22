// Vị trí: src/shared/components/SubmissionResult/components/AIAnalysisSection.tsx
import { useState } from 'react';
import type { AIEvaluation } from '../../../../features/Exercise/types/submitTypes';
import { evaluatorApi } from '../../../../features/Exercise/api/evaluatorApi';
import { useAuthContext_v2 } from '../../../context/hooks/useAuthContext_v2';
import { AIFeatureBox } from '../../AIFeatureBox'; // <-- MỚI

// Import bot mascot (Sửa đường dẫn nếu cần)
import bot_showing from '../../../../shared/Assets/Mascots/bot_showing.svg';

interface AIAnalysisSectionProps {
  isAllPassed: boolean;
  evaluationData?: AIEvaluation;
  submissionId: string;
}

export default function AIAnalysisSection({
  isAllPassed,
  evaluationData,
  submissionId,
}: AIAnalysisSectionProps) {
  const { user } = useAuthContext_v2();

  const [localEval, setLocalEval] = useState<AIEvaluation | undefined>(evaluationData);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleReload = async () => {
    if (!user?._id || !submissionId) return;

    setIsEvaluating(true);
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
      setIsEvaluating(false);
    }
  };

  const TITLE = 'AI Analysis';

  // Để đồng bộ layout ngăn cách với các testcase phía trên, bọc thẻ cha bằng mt-6 pt-6
  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      {/* RENDER 1: ĐANG CHẠY PROMISE */}
      {isEvaluating ? (
        <AIFeatureBox
          title={TITLE}
          variant="loading"
          className="w-fit min-w-[300px]"
          icon={<img src={bot_showing} alt="AI Bot" className="w-12 h-12 opacity-50 shrink-0" />}
        >
          <span className="text-[#1E3A8A] font-medium italic text-[15px] mt-2 block">
            AI is evaluating your code...
          </span>
        </AIFeatureBox>
      ) : /* RENDER 2: PROMISE CHẠY XONG NHƯNG KO CÓ DATA */
      !localEval ? (
        <AIFeatureBox
          title={TITLE}
          variant="default"
          className="w-fit min-w-[300px]"
          icon={
            <img src={bot_showing} alt="AI Bot" className="w-12 h-12 opacity-50 shrink-0 mt-1" />
          }
        >
          <div className="flex flex-col items-start gap-3 mt-1">
            <span className="text-sm font-bold text-gray">
              No AI evaluation for this submission.
            </span>
            <button
              onClick={handleReload}
              className="text-xs font-bold bg-[#1E3A8A] text-white px-4 py-2 rounded-lg hover:bg-[#112255] transition-colors shadow-sm active:scale-95"
            >
              Reload for AI evaluation
            </button>
          </div>
        </AIFeatureBox>
      ) : (
        /* RENDER 3: CÓ DATA, HIỂN THỊ UI BÌNH THƯỜNG */
        <AIFeatureBox
          title={TITLE}
          variant="default"
          // 1. SENIOR FIX: Truyền w-[60%] vào chính vỏ bọc.
          // Kèm theo min-w-[300px] để đảm bảo trên màn hình quá nhỏ nó không bị bóp nghẹt.
          // Thẻ div mặc định luôn căn trái (left-aligned) nên không cần thêm class căn lề.
          className="w-[80%] min-w-[300px] "
          icon={<img src={bot_showing} alt="AI Bot" className="w-12 h-12 shrink-0 mt-1" />}
        >
          {/* 2. SENIOR FIX: Xóa cái w-60% sai cú pháp ở đây đi, trả nó về bình thường */}
          <div className="mt-1">
            <div className="space-y-4">
              <div>
                <h4 className="text-[15px] font-bold text-slate-800 mb-1">
                  {isAllPassed ? 'Clean Code:' : 'Error destination:'}
                </h4>
                <p className="text-[15px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                  {localEval.first_res || 'No detail description.'}
                </p>
              </div>
              {localEval.second_res && (
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800 mb-1">
                    {isAllPassed ? 'Refactoring:' : 'How to fix:'}
                  </h4>
                  <p className="text-[15px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                    {localEval.second_res}
                  </p>
                </div>
              )}
            </div>
          </div>
        </AIFeatureBox>
      )}
    </div>
  );
}
