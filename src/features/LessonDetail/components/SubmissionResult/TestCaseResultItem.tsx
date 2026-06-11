// Vị trí: src/features/LessonDetail/components/SubmissionResult/TestCaseResultItem.tsx
import React, { useState } from 'react';
import DiffViewer from '../../../../shared/components/CodeEditor/components/DiffViewer';

interface TestCaseResultItemProps {
  index: number;
  input: string;
  expectedOutput: string;
  userOutput: string;
  status: string;
}

const TestCaseResultItem: React.FC<TestCaseResultItemProps> = ({
  index,
  input,
  expectedOutput,
  userOutput,
  status,
}) => {
  const [showDiff, setShowDiff] = useState(false);
  const isPassed = status === 'passed';

  return (
    <div className="space-y-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
      <h4 className="font-bold text-slate-800">Test Case {index + 1}</h4>

      <div>
        <label className="text-sm font-bold text-slate-700 block mb-1">Test input</label>
        <div className="w-full border border-slate-200 rounded-lg p-3 bg-gray-50 text-slate-600 font-mono text-sm whitespace-pre-wrap">
          {input}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-1">Your output</label>
          {showDiff && !isPassed ? (
            <div className="border border-slate-200 rounded-lg bg-gray-50 overflow-hidden">
              <DiffViewer expected={expectedOutput} actual={userOutput} />
            </div>
          ) : (
            <div
              className={`w-full border border-slate-200 rounded-lg p-3 bg-gray-50 font-mono text-sm font-bold whitespace-pre-wrap ${isPassed ? 'text-[#22C55E]' : 'text-red-500'}`}
            >
              {userOutput}
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-1">Expected output</label>
          <div className="w-full border border-slate-200 rounded-lg p-3 bg-gray-50 text-[#22C55E] font-mono text-sm font-bold whitespace-pre-wrap">
            {expectedOutput}
          </div>
        </div>
      </div>

      {!isPassed && (
        <button
          onClick={() => setShowDiff(!showDiff)}
          className="bg-gray-200 text-slate-700 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-gray-300 transition-colors"
        >
          {showDiff ? 'Hide different' : 'Show different'}
        </button>
      )}
    </div>
  );
};

export default TestCaseResultItem;
