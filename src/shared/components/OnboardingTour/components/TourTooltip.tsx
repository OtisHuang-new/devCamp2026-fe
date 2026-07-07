// Vị trí: src/shared/components/OnboardingTour/components/TourTooltip.tsx
import React, { useEffect, useState, useRef } from 'react';
import bot_showing from '../../../Assets/Mascots/bot_showing.svg';
import CloseButton from '../../Buttons/CloseButton'; // cái này đúng rồi nó là name export
import { useOnboardingStore } from '../../../store/useOnboardingStore';

interface TourTooltipProps {
  targetRect: { top: number; left: number; width: number; height: number };
}

export function TourTooltip({ targetRect }: TourTooltipProps) {
  const { steps, currentStepIndex, nextStep, prevStep, endTour } = useOnboardingStore();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({ top: -9999, left: -9999, arrowDir: 'up', arrowLeft: 20 });
  const stepData = steps[currentStepIndex];
  const isLast = currentStepIndex === steps.length - 1;
  const isFirst = currentStepIndex === 0;

  // Cỗ máy tính toán vị trí thông minh (Pure logic)
  useEffect(() => {
    const tooltipEl = tooltipRef.current;
    if (!tooltipEl) return;

    const calculatePosition = () => {
      const PADDING = 4;
      const MARGIN = 16;
      const tWidth = tooltipEl.offsetWidth;
      const tHeight = tooltipEl.offsetHeight;
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;

      // Nếu width/height = 0 (tức là DOM chưa kịp vẽ), đợi frame tiếp theo
      if (tWidth === 0 || tHeight === 0) return;

      let top = targetRect.top + targetRect.height + PADDING + MARGIN;
      let arrowDir = 'up';

      // Đảo đầu lên trên nếu tràn viền dưới
      if (top + tHeight > wHeight) {
        top = targetRect.top - PADDING - MARGIN - tHeight;
        arrowDir = 'down';
      }

      // 🚀 SENIOR FIX: BẮT LỖI ELEMENT KHỔNG LỒ (Chống văng Tooltip khỏi màn hình)
      // Nếu target (như Sidebar/Roadmap container) quá lớn khiến top bị âm hoặc tràn đáy
      if (top < 16 || top + tHeight > wHeight - 16) {
        top = wHeight / 2 - tHeight / 2; // Căn Tooltip vào chính giữa màn hình
        arrowDir = 'none'; // Tắt mũi tên chỉ đường vì lúc này tỷ lệ không còn ý nghĩa
      }

      let left = targetRect.left + targetRect.width / 2 - tWidth / 2;
      // Ép viền ngang an toàn
      if (left < 16) left = 16;
      if (left + tWidth > wWidth - 16) left = wWidth - tWidth - 16;

      // Tính toán chân Arrow luôn chĩa đúng tâm Component
      let arrowLeft = targetRect.left + targetRect.width / 2 - left - 10;
      if (arrowLeft < 20) arrowLeft = 20;
      if (arrowLeft > tWidth - 40) arrowLeft = tWidth - 40;

      setPos({ top, left, arrowDir, arrowLeft });
    };

    // 2. SENIOR FIX: Dùng setTimeout để đẩy lần tính toán đầu tiên vào Event Loop
    const initTimer = setTimeout(calculatePosition, 0);

    // Theo dõi Resize để tính lại nếu Text bên trong dài ra hoặc Component thay đổi
    const observer = new ResizeObserver(() => {
      calculatePosition(); // Trong Callback của Observer thì Linter cho phép thoải mái
    });
    observer.observe(tooltipEl);

    return () => {
      clearTimeout(initTimer); // Nhớ dọn dẹp timer
      observer.disconnect();
    };
  }, [targetRect, currentStepIndex]);

  const arrowStyle: React.CSSProperties =
    pos.arrowDir === 'up'
      ? {
          top: '-8px',
          left: `${pos.arrowLeft}px`,
          borderBottom: '8px solid white',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
        }
      : {
          bottom: '-8px',
          left: `${pos.arrowLeft}px`,
          borderTop: '8px solid white',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
        };

  return (
    <div
      ref={tooltipRef}
      className="absolute bg-white rounded-xl shadow-2xl p-5 w-[340px] transition-all duration-300 ease-out z-[9999]"
      style={{ top: pos.top, left: pos.left, opacity: pos.top === -9999 ? 0 : 1 }}
    >
      {/* Mũi tên trỏ flexible */}
      <div className="absolute w-0 h-0" style={arrowStyle} />

      {/* Mascot & Close */}
      <img
        src={bot_showing}
        alt="Bot"
        className="absolute -top-[50px] left-1/2 -translate-x-1/2 w-20 h-20 drop-shadow-md"
      />
      <div className="absolute top-2 right-2">
        <CloseButton onClick={endTour} />
      </div>

      {/* Content */}
      <div className="mt-8 mb-6 text-center text-slate-700 font-bold text-[15px] leading-relaxed">
        {stepData?.content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center w-full">
        <button
          onClick={prevStep}
          className={`bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition-colors ${
            isFirst ? 'invisible' : 'visible'
          }`}
        >
          Back
        </button>
        <span className="font-bold text-gray-400 text-sm tracking-widest">
          {currentStepIndex + 1} / {steps.length}
        </span>
        <button
          onClick={isLast ? endTour : nextStep}
          className="bg-[#1E3A8A] text-white px-4 py-1.5 rounded-lg font-bold hover:bg-[#112255] transition-colors shadow-md"
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
