import React from 'react';
import AIAnalysisSection from './AIAnalysisSection';
import TestCaseResultItem from './TestCaseResultItem';
import type { SubmitResponse } from '../../../Exercise/types/submitTypes';
import { useEditorStore } from '../../../../shared/store/useEditorStore';

interface SubmissionResultProps {
  data: SubmitResponse;
  onActionClick?: () => void;
}

const SubmissionResult: React.FC<SubmissionResultProps> = ({ data, onActionClick }) => {
  const publicTestCases = useEditorStore((state) => state.publicTestCases);
  const publicResults = data.results.slice(0, publicTestCases.length);
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
      <p className="text-sm font-medium">
        Submission result: <span className={`${statusColor} font-bold`}>{statusText}</span>
      </p>

      <div className={`border-2 ${borderColor} rounded-2xl py-6 px-4 bg-white shadow-sm space-y-6`}>
        <div className="max-h-[450px] overflow-y-auto custom-scrollbar pr-2 space-y-6">
          {publicResults.map((result, index) => {
            const originalCase = publicTestCases[index];
            if (!originalCase) return null;

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

        <AIAnalysisSection submissionId={data._id} isAllPassed={isAllPassed} />
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onActionClick}
          className={`${isAllPassed ? 'bg-[#22C55E] hover:bg-[#16a34a]' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-md`}
        >
          {isAllPassed ? 'Finish lesson' : 'Exit lesson'}
        </button>
      </div>
    </div>
  );
};

export default SubmissionResult;
