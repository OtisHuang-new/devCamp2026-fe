// Vị trí: src/features/LessonDetail/components/SubmissionResult/AIAnalysisSection.tsx
import React from 'react';
import { useEvaluateSubmission } from '../../hooks/useEvaluateSubmission';

interface AIAnalysisSectionProps {
  submissionId: string;
  isAllPassed: boolean;
}

const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({ submissionId, isAllPassed }) => {
  // Tự động gọi API khi component được mount
  const { isEvaluating, evaluationData, error } = useEvaluateSubmission(submissionId);

  // Trạng thái 1: Đang chờ AI phân tích (Skeleton Loading)
  if (isEvaluating) {
    return (
      <div className="pt-6 border-t border-gray-100">
        {/* --- DÒNG CHỮ THÔNG BÁO --- */}
        <div className="flex items-center gap-2.5 mb-6 animate-pulse">
          <svg
            className="animate-spin h-5 w-5 text-[#22C55E]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="font-bold text-slate-700 text-sm">AI is evaluating your code...</span>
        </div>
        {/* ------------------------- */}

        {/* Khung Skeleton mờ ở dưới */}
        <div className="grid grid-cols-2 gap-10 animate-pulse opacity-50">
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <div className="h-8 bg-gray-100 rounded-lg w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái 2: Lỗi API
  if (error) {
    return (
      <div className="pt-4 border-t border-gray-100 animate-fadeIn">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          <span className="font-bold">Lỗi phân tích AI: </span>
          {error}
        </div>
      </div>
    );
  }

  // Trạng thái 3: Có kết quả thành công
  if (evaluationData) {
    // Thay đổi tiêu đề linh hoạt dựa trên kết quả bài làm
    const title1 = isAllPassed ? 'Clean Code:' : 'Error destination:';
    const title2 = isAllPassed ? 'Refactoring:' : 'How to fix:';

    const { first_res, second_res } = evaluationData.AI_evaluation;

    return (
      <div className="grid grid-cols-2 gap-10 pt-4 border-t border-gray-100 animate-fadeIn">
        {/* Kết quả trả về từ AI */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">{title1}</h4>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {first_res || 'No detail description.'}
            </p>
          </div>
          {second_res && (
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">{title2}</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {second_res}
              </p>
            </div>
          )}
        </div>

        {/* Giữ nguyên Mockup bên phải */}
        <div className="flex flex-col items-end gap-2 text-right">
          <select className="bg-gray-100 border-none text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer mb-2">
            <option>Analyze further</option>
          </select>
          <p className="text-xs text-slate-600">Time Complexity: $O(n \log n)$</p>
          <p className="text-xs text-slate-600">Space Complexity: $O(n)$</p>
          <p className="text-[10px] text-slate-400 italic mt-2 leading-tight">
            Use memory efficiently, however,
            <br /> unnecessary temporary variables can be reduced.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AIAnalysisSection;
