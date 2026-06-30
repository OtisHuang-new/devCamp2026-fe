// Vị trí: src/shared/components/SubmissionResult/index.tsx
import AIAnalysisSection from './components/AIAnalysisSection';
import TestCaseResultItem from './components/TestCaseResultItem';
import type { SubmissionHistoryItem } from '../../../features/Exercise/types/submitTypes';
import { useEditorStore } from '../../store/useEditorStore';
import { formatDateTime } from '../../utils/dateFormatter';
import { useEffect, useRef, useState } from 'react'; // 1. BỔ SUNG IMPORT HOOKS

interface SubmissionResultProps {
  history: SubmissionHistoryItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onActionClick?: () => void;
  latestSubmitId?: string | null; // 2. BỔ SUNG TYPE
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

  // 3. SENIOR FIX: Setup State và Ref cho hiệu ứng Highlight
  const [showHighlight, setShowHighlight] = useState(false);
  const [prevDataId, setPrevDataId] = useState<string | null>(null); // State dùng để theo dõi thay đổi (Memoize)
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ----------------------------------------------------------------------
  // BƯỚC 1: UPDATE STATE DURING RENDER (Chuẩn React 19 Best Practice)
  // Xóa bỏ hoàn toàn tính toán khỏi useEffect để diệt lỗi Cascading Renders
  // ----------------------------------------------------------------------
  if (currentData && currentData._id !== prevDataId) {
    setPrevDataId(currentData._id); // Chốt mốc ngay lập tức để không lặp vô hạn

    const total = currentData.results.length;
    const passedCount = currentData.results.filter((r) => r.status === 'passed').length;
    const isPassAll = passedCount === total;

    // Tính toán trực tiếp State mà không cần chui vào Effect
    if (isPassAll && currentData._id === latestSubmitId) {
      setShowHighlight(true);
    } else {
      setShowHighlight(false);
    }
  }

  // ----------------------------------------------------------------------
  // BƯỚC 2: EFFECT CHỈ DÙNG CHO NHIỆM VỤ SIDE-EFFECT (Hẹn giờ & Animation)
  // ----------------------------------------------------------------------
  useEffect(() => {
    // Nếu không cần highlight thì thoát luôn, không làm gì cả
    if (!showHighlight) return;

    // Kích hoạt Engine cuộn sau 50ms
    const scrollTimer = setTimeout(() => {
      const button = buttonRef.current;
      if (!button) return;

      const scrollContainer = button.closest('.overflow-y-auto') as HTMLElement;

      if (scrollContainer) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();

        const targetScrollTop =
          scrollContainer.scrollTop +
          (buttonRect.top - containerRect.top) -
          containerRect.height / 2 +
          buttonRect.height / 2;

        const startScrollTop = scrollContainer.scrollTop;
        const distance = targetScrollTop - startScrollTop;
        const duration = 1200; // Cuộn mượt trong 1.2s
        let startTime: number | null = null;

        const animateScroll = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);

          const easeInOut =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          scrollContainer.scrollTop = startScrollTop + distance * easeInOut;

          if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      } else {
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);

    // Hẹn giờ tắt dải màu Gradient (6s)
    const highlightTimer = setTimeout(() => {
      setShowHighlight(false);
    }, 6000);

    // Dọn dẹp sạch sẽ
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(highlightTimer);
    };
  }, [showHighlight]);

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
      {/* ... (Các phần JSX phía trên của bạn giữ y nguyên không đổi) ... */}
      <div className="flex items-end justify-between">
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

      <div className="flex justify-center mt-8">
        <div className="relative group">
          {showHighlight && (
            <>
              {/* 1. SENIOR FIX: Khai báo thêm Keyframe kiểm soát vòng đời Opacity */}
              <style>{`
                @keyframes border-spin-submission {
                  0% { transform: translate(-50%, -50%) rotate(0deg); }
                  100% { transform: translate(-50%, -50%) rotate(720deg); }
                }
                @keyframes border-fade-submission {
                  0% { opacity: 0; }            /* Bắt đầu: Trong suốt */
                  10% { opacity: 1; }           /* Giây 0.35: Sáng rực rỡ */
                  80% { opacity: 1; }           /* Giữ độ sáng trong lúc quay */
                  100% { opacity: 0; }          /* Giây 3.5: Tan biến mượt mà (Fade Out) */
                }
              `}</style>

              {/* 2. SENIOR FIX: Áp dụng hiệu ứng fade kéo dài đúng 3.5s vào cái Vỏ bọc (Container) */}
              <div
                className="absolute -inset-[3px] rounded-[15px] overflow-hidden z-0 pointer-events-none"
                style={{ animation: 'border-fade-submission 3.5s ease-in-out forwards' }}
              >
                {/* Lõi Gradient: Phối màu chuẩn Tone Toast Notification */}
                <div
                  className="absolute top-1/2 left-1/2 w-[300%] h-[300%] z-[-1]"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 40%, #06b6d4 60%, #a855f7 80%, #ec4899 100%)',
                    animation: 'border-spin-submission 3s ease-in-out forwards', // Lõi chỉ cần quay 3s là đủ
                  }}
                />
              </div>
            </>
          )}

          {/* Nút bấm nổi lên trên... */}
          <button
            ref={buttonRef}
            onClick={onActionClick}
            className={`relative z-10 ${
              isAllPassed ? 'bg-[#22C55E] hover:bg-[#16a34a]' : 'bg-yellow-500 hover:bg-yellow-600'
            } text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-md`}
          >
            {isAllPassed ? 'Finish lesson' : 'Exit lesson'}
          </button>
        </div>
      </div>
    </div>
  );
}
