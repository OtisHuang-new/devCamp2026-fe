// Vị trí: src/shared/components/SubmissionResult/index.tsx
import { useEffect, useRef, useState } from 'react';
import AIAnalysisSection from './components/AIAnalysisSection';
import TestCaseResultItem from './components/TestCaseResultItem';
import type { SubmissionHistoryItem } from '../../../features/Exercise/types/submitTypes';
import { useEditorStore } from '../../store/useEditorStore';
// 1. IMPORT CÔNG CỤ VÀ COMPONENT ĐÃ TÁCH
import { scrollToElement } from '../../utils/scrollUtils';
import { SubmissionHeader } from './components/SubmissionHeader';
import { SubmissionAction } from './components/SubmissionAction';

interface SubmissionResultProps {
  history: SubmissionHistoryItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onActionClick?: () => void;
  latestSubmitId?: string | null;
}

export default function SubmissionResult({
  history,
  selectedIndex,
  onSelectIndex,
  onActionClick,
  latestSubmitId,
}: SubmissionResultProps) {
  const publicTestCases = useEditorStore((state) => state.publicTestCases);
  const currentData = history[selectedIndex];

  const [showHighlight, setShowHighlight] = useState(false);
  const [prevDataId, setPrevDataId] = useState<string | null>(null);

  // 2. KHAI BÁO MỐC TỌA ĐỘ VÀ CỜ HIỆU (Chặn scroll trùng)
  const headerRef = useRef<HTMLDivElement>(null);
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const lastScrolledId = useRef<string | null>(null);

  if (currentData && currentData._id !== prevDataId) {
    setPrevDataId(currentData._id);

    const total = currentData.results.length;
    const passedCount = currentData.results.filter((r) => r.status === 'passed').length;
    const isPassAll = passedCount === total;

    if (isPassAll && currentData._id === latestSubmitId) {
      setShowHighlight(true);
    } else {
      setShowHighlight(false);
    }
  }

  // 3. LOGIC CUỘN TRANG PHÂN NHÁNH
  useEffect(() => {
    // Nếu không phải là submit mới nhất, bỏ qua
    if (!currentData || currentData._id !== latestSubmitId) return;
    // Chặn hiện tượng cuộn lại nhiều lần khi user bấm chọn lịch sử cũ rồi đổi lại lịch sử mới
    if (lastScrolledId.current === latestSubmitId) return;

    lastScrolledId.current = latestSubmitId; // Đánh dấu đã cuộn

    const total = currentData.results.length;
    const passedCount = currentData.results.filter((r) => r.status === 'passed').length;
    const isPassAll = passedCount === total;

    let scrollTimer: ReturnType<typeof setTimeout>;
    let highlightTimer: ReturnType<typeof setTimeout>;

    if (isPassAll) {
      // TRƯỜNG HỢP 1: Pass All -> Cuộn vào giữa Nút Submit
      scrollTimer = setTimeout(() => {
        if (actionBtnRef.current) scrollToElement(actionBtnRef.current, 'center', 600);
      }, 50);

      highlightTimer = setTimeout(() => setShowHighlight(false), 6000);
    } else {
      // TRƯỜNG HỢP 2: Sai 1 phần -> Cuộn lên đầu dòng chữ "Submission result"
      scrollTimer = setTimeout(() => {
        if (headerRef.current) scrollToElement(headerRef.current, 'top', 600);
      }, 50);
    }

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(highlightTimer);
    };
  }, [currentData, latestSubmitId]);

  if (!currentData) return null;

  const publicResults = currentData.results.slice(0, publicTestCases.length);
  const passedCount = currentData.results.filter((r) => r.status === 'passed').length;
  const isAllPassed = passedCount === currentData.results.length;
  const isPublicPassed = publicResults.every((r) => r.status === 'passed');

  let statusText = '';
  let statusColor = '';
  let borderColor = '';

  if (isAllPassed) {
    statusText = 'Pass all testcases';
    statusColor = 'text-[#22C55E]';
    borderColor = 'border-[#22C55E]';
  } else if (isPublicPassed) {
    statusText = 'Fail some hidden test cases';
    statusColor = 'text-yellow-500';
    borderColor = 'border-yellow-500';
  } else {
    statusText = 'Fail public test case';
    statusColor = 'text-red-500';
    borderColor = 'border-red-500';
  }

  return (
    <div className="w-full space-y-4 animate-fadeIn mb-10">
      <SubmissionHeader
        ref={headerRef}
        statusText={statusText}
        statusColor={statusColor}
        history={history}
        selectedIndex={selectedIndex}
        onSelectIndex={onSelectIndex}
      />

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

        <AIAnalysisSection
          key={currentData._id}
          isAllPassed={isAllPassed}
          evaluationData={currentData.AI_evaluation}
          submissionId={currentData._id}
        />
      </div>

      <SubmissionAction
        ref={actionBtnRef}
        isAllPassed={isAllPassed}
        showHighlight={showHighlight}
        onActionClick={onActionClick}
      />
    </div>
  );
}
