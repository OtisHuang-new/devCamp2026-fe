// Vị trí: src/shared/components/SubmissionResult/components/AIAnalysisSection.tsx
import type { AIEvaluation } from '../../../../features/Exercise/types/submitTypes';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';

interface AIAnalysisSectionProps {
  isAllPassed: boolean;
  evaluationData?: AIEvaluation;
}

export default function AIAnalysisSection({ isAllPassed, evaluationData }: AIAnalysisSectionProps) {
  // Nếu chưa có data (AI đang chấm hoặc lỗi), ta hiện trạng thái chờ
  if (!evaluationData) {
    return (
      <div className="pt-6 border-t border-gray-100 flex justify-start mb-6">
        {/* 2. SỬ DỤNG COMPONENT MỚI */}
        <LoadingSpinner text="AI is evaluating your code..." iconSize="w-5 h-5" />
      </div>
    );
  }

  // Nếu đã có data thì render bình thường
  const title1 = isAllPassed ? 'Clean Code:' : 'Error destination:';
  const title2 = isAllPassed ? 'Refactoring:' : 'How to fix:';

  return (
    <div className="grid grid-cols-2 gap-10 pt-4 border-t border-gray-100 animate-fadeIn">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">{title1}</h4>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
            {evaluationData.first_res || 'No detail description.'}
          </p>
        </div>
        {evaluationData.second_res && (
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">{title2}</h4>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {evaluationData.second_res}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
