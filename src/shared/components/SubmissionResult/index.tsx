// Vị trí: src/shared/components/SubmissionResult/index.tsx
import { useEffect, useRef, useState, type ReactNode } from 'react';
import AIAnalysisSection from './components/AIAnalysisSection';
import TestCaseResultItem from './components/TestCaseResultItem';
import type { SubmissionHistoryItem } from '../../../features/Exercise/types/submitTypes';
import { useEditorStore } from '../../store/useEditorStore';
import { scrollToElement } from '../../utils/scrollUtils';
import { SubmissionHeader } from './components/SubmissionHeader';

import { useOnboardingStore } from '@/shared/store/useOnboardingStore';
import { getAnalysisTourSteps } from '@/shared/utils/onboardingConstants';

interface SubmissionResultProps {
  history: SubmissionHistoryItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  latestSubmitId?: string | null;
  children?: (showHighlight: boolean) => ReactNode; // 2. SENIOR FIX: Dùng Render Props Pattern
  footerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function SubmissionResult({
  history,
  selectedIndex,
  onSelectIndex,
  latestSubmitId,
  children,
  footerRef,
}: SubmissionResultProps) {
  const publicTestCases = useEditorStore((state) => state.publicTestCases);
  const currentData = history[selectedIndex];

  const [showHighlight, setShowHighlight] = useState(false);
  const [prevDataId, setPrevDataId] = useState<string | null>(null);

  // 2. KHAI BÁO MỐC TỌA ĐỘ VÀ CỜ HIỆU (Chặn scroll trùng)
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrolledId = useRef<string | null>(null);

  const aiAnalysisRef = useRef<HTMLDivElement>(null);

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
    if (!currentData || currentData._id !== latestSubmitId) return;
    if (lastScrolledId.current === latestSubmitId) return;
    lastScrolledId.current = latestSubmitId;

    const total = currentData.results.length;
    const passedCount = currentData.results.filter((r) => r.status === 'passed').length;
    const isPassAll = passedCount === total;

    let scrollTimer: ReturnType<typeof setTimeout>;
    let highlightTimer: ReturnType<typeof setTimeout>;

    if (isPassAll) {
      // Pass All: Cuộn xuống Footer
      scrollTimer = setTimeout(() => {
        if (footerRef && footerRef.current) scrollToElement(footerRef.current, 'center', 600);
      }, 50);
      // 3. SENIOR FIX: Sửa thành 4000ms (4 giây)
      highlightTimer = setTimeout(() => setShowHighlight(false), 4000);
    } else {
      // Fail: Cuộn lên đầu Submission Result
      scrollTimer = setTimeout(() => {
        if (headerRef.current) scrollToElement(headerRef.current, 'top', 600);
      }, 50);
    }

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(highlightTimer);
    };
  }, [currentData, latestSubmitId, footerRef]);

  const publicResults = currentData.results.slice(0, publicTestCases.length);
  const isPublicPassed = publicResults.every((r) => r.status === 'passed');
  const passedCount = currentData.results.filter((r) => r.status === 'passed').length;
  const isAllPassed = passedCount === currentData.results.length;

  let statusText = '';
  let statusColor = '';
  let borderColor = '';
  const startTour = useOnboardingStore((state) => state.startTour);

  useEffect(() => {
    const isFirstSubmission = history.length === 1;
    if (!isFirstSubmission) return;

    const tourKey = 'has_seen_analysis_tour';
    const hasSeen = localStorage.getItem(tourKey);
    if (hasSeen) return;

    let timerId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          timerId = setTimeout(() => {
            // BẢO MẬT KÉP
            const hasSeenNow = localStorage.getItem(tourKey);
            if (hasSeenNow) {
              observer.disconnect();
              return;
            }

            const { isActive } = useOnboardingStore.getState();
            if (!isActive) {
              startTour(getAnalysisTourSteps(isAllPassed));
              localStorage.setItem(tourKey, 'true');
              observer.disconnect(); // Đã đục lỗ xong thì phá hủy!
            }
          }, 1500);
        } else {
          clearTimeout(timerId);
        }
      },
      { root: null, threshold: 0.2 },
    );

    if (aiAnalysisRef.current) {
      observer.observe(aiAnalysisRef.current);
    }

    return () => {
      clearTimeout(timerId);
      observer.disconnect();
    };
  }, [history.length, isAllPassed, startTour]);

  if (!currentData) return null;

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
        className={`border-2 ${borderColor} rounded-2xl py-5 px-4 bg-white shadow-sm space-y-6 transition-colors duration-300`}
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

        <div id="tour-ai-analysis" ref={aiAnalysisRef} className="w-fit">
          <AIAnalysisSection
            key={currentData._id}
            isAllPassed={isAllPassed}
            evaluationData={currentData.AI_evaluation}
            submissionId={currentData._id}
          />
        </div>
      </div>
      {/* SENIOR FIX: Bổ sung dòng này để render NavigationFooter và truyền cờ showHighlight xuống cho nó */}
      {children ? children(showHighlight) : null}
    </div>
  );
}
