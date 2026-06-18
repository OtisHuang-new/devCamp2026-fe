// Vị trí: src/shared/components/SubmissionResult/index.tsx
import AIAnalysisSection from './components/AIAnalysisSection';
import TestCaseResultItem from './components/TestCaseResultItem';
import type { SubmissionHistoryItem } from '../../../features/Exercise/types/submitTypes';
import { useEditorStore } from '../../store/useEditorStore';
import { formatDateTime } from '../../utils/dateFormatter';

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

  return (
    <div className="w-full space-y-4 animate-fadeIn mb-10">
      {/* KHU VỰC 1: DROPDOWN CHỌN VERSION */}
      {/* 1. SỬA: Đổi items-center thành items-end để căn mọi thứ xuống đáy */}
      <div className="flex items-end justify-between">
        {/* 2. SỬA: Thêm mb-1.5 (margin-bottom khoảng 6px) để đường chân chữ cân bằng hoàn hảo với chữ bên trong Dropdown */}
        <p className="text-sm font-medium">
          Submission result: <span className={`${statusColor} font-bold`}>{statusText}</span>
        </p>

        <div className="flex flex-col items-end gap-1.5">
          <label className="text-xs font-bold text-slate-500">Choose your version:</label>
          <select
            value={selectedIndex}
            onChange={(e) => onSelectIndex(Number(e.target.value))}
            className="bg-gray-100 border border-gray-300 text-sm font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-[#1E3A8A]"
          >
            {history.map((item, index) => (
              <option key={item._id} value={index}>
                {formatDateTime(item.createdAt)}
              </option>
            ))}
          </select>
        </div>
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
