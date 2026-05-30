// Vị trí: src/shared/CodeEditor/components/TestResultView.tsx
import React, { useState } from 'react';
import DiffViewer from './DiffViewer';

export interface TestResultProps {
  input: string;
  expectedOutput: string;
  yourOutput: string | null;
  error: string | null;
  status: 'Idle' | 'Running' | 'Accepted' | 'Wrong Answer' | 'Error';
}

const TestResultView: React.FC<TestResultProps> = ({
  input,
  expectedOutput,
  yourOutput,
  error,
  status,
}) => {
  const [isComparing, setIsComparing] = useState(false);

  // Màn hình chờ
  if (status === 'Idle')
    return <div className="text-gray-500 font-bold text-center mt-10">Run code to see results</div>;
  if (status === 'Running')
    return (
      <div className="text-[#22C55E] font-bold text-center mt-10 animate-pulse">
        Running Testcases...
      </div>
    );

  const isAccepted = status === 'Accepted';

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      {/* Trạng thái tổng quan của Case */}
      <div className={`font-bold text-xl mb-2 ${isAccepted ? 'text-[#22C55E]' : 'text-red-500'}`}>
        {status}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-400">Input</label>
        <div className="w-full bg-[#2A2A2A] text-white font-mono text-sm p-3 rounded-lg min-h-[40px] whitespace-pre-wrap">
          {input}
        </div>
      </div>

      {/* Bắt lỗi Runtime Error (Nếu có) */}
      {error ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-red-400">Runtime Error</label>
          <div className="w-full bg-[#2A2A2A] text-red-400 font-mono text-sm p-3 rounded-lg min-h-[40px] whitespace-pre-wrap">
            {error}
          </div>
        </div>
      ) : (
        <>
          {/* Your Output (Kèm chức năng DiffViewer) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400">Your Output</label>
            {isComparing ? (
              <DiffViewer expected={expectedOutput} actual={yourOutput || ''} />
            ) : (
              <div
                className={`w-full bg-[#2A2A2A] font-mono text-sm p-3 rounded-lg min-h-[40px] whitespace-pre-wrap ${isAccepted ? 'text-[#22C55E]' : 'text-red-400'}`}
              >
                {yourOutput}
              </div>
            )}
          </div>

          {/* Expected Output */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400">Expected Output</label>
            <div className="w-full bg-[#2A2A2A] text-[#22C55E] font-mono text-sm p-3 rounded-lg min-h-[40px] whitespace-pre-wrap">
              {expectedOutput}
            </div>
          </div>
        </>
      )}

      {/* Nút Toggle Compare (Chỉ hiện khi code chạy ra kết quả chứ không bị lỗi Runtime) */}
      {!error && (
        <div className="flex justify-end mt-2">
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              isComparing
                ? 'bg-[#22C55E] text-white'
                : 'bg-[#2A2A2A] text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            {isComparing ? 'Hide diff' : 'Compare different'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TestResultView;
