// Vị trí: src/shared/components/SubmissionResult/index.tsx
import AIAnalysisSection from './components/AIAnalysisSection';
import TestCaseResultItem from './components/TestCaseResultItem';
import type { SubmissionHistoryItem } from '../../../features/Exercise/types/submitTypes';
import { useEditorStore } from '../../store/useEditorStore';

interface SubmissionResultProps {
  history: SubmissionHistoryItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onActionClick?: () => void;
}

export default function SubmissionResult({
  history,
  selectedIndex,
  onSelectIndex,
  onActionClick,
}: SubmissionResultProps) {
  const publicTestCases = useEditorStore((state) => state.publicTestCases);

  // Lấy dữ liệu của Version đang được chọn
  const currentData = history[selectedIndex];

  if (!currentData) return null;

  const publicResults = currentData.results.slice(0, publicTestCases.length);
  const passedCount = currentData.results.filter((r) => r.status === 'passed').length;
  const total = currentData.results.length;

  const isAllPassed = passedCount === total;
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

  // Hàm phụ trợ fomat ngày tháng cho đẹp: "17:29 - 16/06/2026"
  function formatDate(isoString: string) {
    const d = new Date(isoString);
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const date = d.toLocaleDateString('vi-VN');
    return `${time} - ${date}`;
  }

  return (
    <div className="w-full space-y-4 animate-fadeIn mb-10">
      {/* KHU VỰC 1: DROPDOWN CHỌN VERSION */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Submission result: <span className={`${statusColor} font-bold`}>{statusText}</span>
        </p>

        {/* Dropdown HTML tiêu chuẩn, dễ xài, bo góc đẹp */}
        <select
          value={selectedIndex}
          onChange={(e) => onSelectIndex(Number(e.target.value))}
          className="bg-gray-100 border border-gray-300 text-sm font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-[#1E3A8A]"
        >
          {history.map((item, index) => (
            <option key={item._id} value={index}>
              {index === 0 ? 'Latest: ' : `Version ${history.length - index}: `}
              {formatDate(item.createdAt)}
            </option>
          ))}
        </select>
      </div>

      {/* KHU VỰC 2: HIỂN THỊ KẾT QUẢ */}
      <div
        className={`border-2 ${borderColor} rounded-2xl py-6 px-4 bg-white shadow-sm space-y-6 transition-colors duration-300`}
      >
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
                error={result.error}
              />
            );
          })}
        </div>

        <AIAnalysisSection isAllPassed={isAllPassed} evaluationData={currentData.AI_evaluation} />
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
}
