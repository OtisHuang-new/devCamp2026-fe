// Vị trí: src/features/LessonDetail/components/SubmissionResult/index.tsx
import React from 'react';
import AIAnalysisSection from './AIAnalysisSection';
import TestCaseResultItem from './TestCaseResultItem';
import type { SubmitResponse } from '../../../Exercise/types/submitTypes';
import { useEditorStore } from '../../../../shared/store/useEditorStore';

interface SubmissionResultProps {
  data: SubmitResponse;
}

const SubmissionResult: React.FC<SubmissionResultProps> = ({ data }) => {
  // Lấy dữ liệu Input/Expected Output gốc từ Store để ghép nối với Output của User
  const publicTestCases = useEditorStore((state) => state.publicTestCases);

  // Lấy ra danh sách kết quả chỉ tương ứng với số lượng public test cases
  const publicResults = data.results.slice(0, publicTestCases.length);

  // Tính toán trạng thái tổng thể
  const isAllPassed = data.passedCount === data.total;
  const isPublicPassed = publicResults.every((r) => r.status === 'passed');

  let statusText = '';
  let statusColor = '';
  let borderColor = '';

  if (isAllPassed) {
    statusText = 'Pass all testcases';
    statusColor = 'text-[#22C55E]'; // Xanh lá
    borderColor = 'border-[#22C55E]';
  } else if (isPublicPassed) {
    statusText = 'Fail some hidden test cases';
    statusColor = 'text-yellow-500'; // Vàng
    borderColor = 'border-yellow-500';
  } else {
    statusText = 'Fail public test case';
    statusColor = 'text-red-500'; // Đỏ
    borderColor = 'border-red-500';
  }

  return (
    <div className="w-full space-y-4 animate-fadeIn mb-10">
      {/* 1. Status Text */}
      <p className="text-sm font-medium">
        Submission result: <span className={`${statusColor} font-bold`}>{statusText}</span>
      </p>

      {/* 2. Main Result Box */}
      <div className={`border-2 ${borderColor} rounded-2xl py-6 px-4 bg-white shadow-sm space-y-6`}>
        {/* Render danh sách Test Cases, bọc trong khung cuộn để tránh phình UI */}
        <div className="max-h-[450px] overflow-y-auto custom-scrollbar pr-2 space-y-6">
          {publicResults.map((result, index) => {
            const originalCase = publicTestCases[index];
            if (!originalCase) return null; // Fallback an toàn

            return (
              <TestCaseResultItem
                key={index}
                index={index}
                input={originalCase.input}
                expectedOutput={originalCase.expected_output}
                userOutput={result.output}
                status={result.status}
              />
            );
          })}
        </div>

        {/* Phân tích sâu (Analysis Section) */}
        <AIAnalysisSection submissionId={data._id} isAllPassed={isAllPassed} />
      </div>

      {/* 3. Finish Button (Mockup) */}
      <div className="flex justify-center mt-8">
        <button className="bg-[#22C55E] hover:bg-[#16a34a] text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-md">
          Finish lesson
        </button>
      </div>
    </div>
  );
};

export default SubmissionResult;
