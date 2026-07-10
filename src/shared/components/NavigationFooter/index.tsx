// Vị trí: src/shared/components/NavigationFooter/index.tsx
import { forwardRef, useState } from 'react';
import iconLeft from './assets/arrow Left forward.svg';
import iconRight from './assets/arrow right forward.svg';

// 3. SENIOR FIX: Import SystemModal và Mascot
import { SystemModal } from '../SystemModal';
import bothuhu from '@Assets/Mascots/bot_huhu.svg';
import botWrong from '../../Assets/Mascots/bot_wrong.svg';

export interface NavigationFooterProps {
  onExit: () => void;
  onNext: () => void;
  isPassed: boolean;
  className?: string;
  showHighlight?: boolean;
  // 4. SENIOR FIX: Nhận cờ thay đổi Code từ Cha
  hasUnsavedChanges?: boolean;
}

export const NavigationFooter = forwardRef<HTMLDivElement, NavigationFooterProps>(
  (
    { onExit, onNext, isPassed, className = '', showHighlight = false, hasUnsavedChanges = false },
    ref,
  ) => {
    // 5. SENIOR FIX: Quản lý trạng thái 2 Modal nội bộ
    const [showExitWarning, setShowExitWarning] = useState(false);
    const [showNextWarning, setShowNextWarning] = useState(false);

    const handleHomeClick = () => {
      if (hasUnsavedChanges) {
        setShowExitWarning(true);
      } else {
        onExit();
      }
    };

    const handleNextClick = () => {
      if (isPassed) {
        onNext();
      } else {
        setShowNextWarning(true); // Thay thế hàm alert() cũ
      }
    };

    return (
      <>
        <div
          ref={ref}
          className={`flex justify-between items-center gap-4 mt-3 border-t pt-7 px-4 ${className}`}
        >
          {/* Nút Home: Trỏ vào hàm mới handleHomeClick */}
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2 bg-transparent text-black border border-black text-xl font-semibold pr-5 pl-3 py-2.5 rounded-lg hover:bg-gray-100 active:translate-y-0 active:shadow-none transition-all"
          >
            <img src={iconLeft} alt="Home" className="w-5 h-5 object-contain" />
            Home
          </button>

          {/* Cụm Nút Next (Giữ nguyên CSS Animation của bạn) */}
          <div className="relative group">
            {showHighlight && (
              <>
                <style>{`
                  @keyframes border-spin-next {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(720deg); }
                  }
                  @keyframes border-fade-next {
                    0% { opacity: 0; }
                    10% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                  }
                `}</style>
                <div
                  className="absolute -inset-[3px] rounded-[10px] overflow-hidden z-0 pointer-events-none"
                  style={{ animation: 'border-fade-next 4s ease-in-out forwards' }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] z-[-1]"
                    style={{
                      background:
                        'conic-gradient(from 0deg, transparent 40%, #06b6d4 60%, #a855f7 80%, #ec4899 100%)',
                      animation: 'border-spin-next 3s linear infinite',
                    }}
                  />
                </div>
              </>
            )}

            <button
              onClick={handleNextClick}
              className={`relative z-10 flex items-center gap-2 font-semibold text-xl pl-5 pr-3 py-2.5 rounded-lg transition-all ${
                isPassed
                  ? 'bg-[#22C55E] text-white hover:bg-[#16a34a]'
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
            >
              Next
              <img
                src={iconRight}
                alt="Next"
                className={`w-5 h-5 object-contain transition-all ${isPassed ? 'brightness-0 invert' : 'opacity-50'}`}
              />
            </button>
          </div>
        </div>

        {/* 6. SENIOR FIX: Modal Cảnh Báo Thoát (Unsaved Changes) */}
        <SystemModal
          isOpen={showExitWarning}
          onClose={() => setShowExitWarning(false)}
          mascotSrc={bothuhu}
          mascotSize={200}
          description="Wait, don't go! You will lose your current source code if you exit now :(("
          secondaryButton={{
            label: 'Exit',
            onClick: onExit, // Cho phép thoát thật nếu cố tình bấm Exit
            isDanger: true,
          }}
          primaryButton={{
            label: 'Continue studying',
            onClick: () => setShowExitWarning(false),
          }}
        />

        {/* 7. SENIOR FIX: Modal Cảnh Báo Chưa Đạt (Not Passed) */}
        <SystemModal
          isOpen={showNextWarning}
          onClose={() => setShowNextWarning(false)}
          mascotSrc={botWrong}
          description="You have to finish the exercise before moving to the next lesson."
          primaryButton={{
            label: 'Ok I understand',
            onClick: () => setShowNextWarning(false),
          }}
        />
      </>
    );
  },
);

NavigationFooter.displayName = 'NavigationFooter';
