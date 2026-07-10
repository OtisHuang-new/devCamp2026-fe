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

  const [isMounted, setIsMounted] = useState(false);
  const [pos, setPos] = useState({ top: -9999, left: -9999, arrowDir: 'none', arrowPos: 20 });

  const stepData = steps[currentStepIndex];
  const isLast = currentStepIndex === steps.length - 1;
  const isFirst = currentStepIndex === 0;

  const [prevStepIndex, setPrevStepIndex] = useState(currentStepIndex);
  if (currentStepIndex !== prevStepIndex) {
    setPrevStepIndex(currentStepIndex);
    setIsMounted(false); // Fix triệt để lỗi Flying Animation mà không vi phạm Linter
  }

  // Cỗ máy tính toán vị trí thông minh (Pure logic)
  useEffect(() => {
    const tooltipEl = tooltipRef.current;
    if (!tooltipEl) return;

    const calculatePosition = () => {
      // 1. SENIOR FIX: Đồng bộ PADDING=8 với OnboardingTour bên ngoài
      const PADDING = 8;
      const MARGIN = 16;
      const tWidth = tooltipEl.offsetWidth;
      const tHeight = tooltipEl.offsetHeight;
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;

      if (tWidth === 0 || tHeight === 0) return;

      // 2. SENIOR FIX: ĐỒNG BỘ THUẬT TOÁN TỊNH TIẾN VÀ CO GIÃN TỪ STORE
      const offsetX = stepData?.offsetX || 0;
      const offsetY = stepData?.offsetY || 0;
      const expandW = stepData?.expandW || 0;
      const expandH = stepData?.expandH || 0;
      const isCircle = stepData?.highlightShape === 'circle';

      // Tạo ra một Tọa độ Nền Tảng (Base Rect) đã được tịnh tiến
      let baseTop = targetRect.top + offsetY;
      let baseLeft = targetRect.left + offsetX;
      let baseWidth = targetRect.width + expandW;
      let baseHeight = targetRect.height + expandH;

      // Nếu là hình tròn, mô phỏng lại đúng độ phình của đường kính
      if (isCircle) {
        const extraSize = Math.max(expandW, expandH);
        const diameter = Math.max(targetRect.width, targetRect.height) + extraSize;

        baseTop = targetRect.top + targetRect.height / 2 - diameter / 2 + offsetY;
        baseLeft = targetRect.left + targetRect.width / 2 - diameter / 2 + offsetX;
        baseWidth = diameter;
        baseHeight = diameter;
      }

      let top = 0,
        left = 0,
        arrowDir = 'up',
        arrowPos = 20;

      const hint = stepData?.positionHint || 'bottom-center';

      // 3. SENIOR FIX: Dùng Tọa độ Nền Tảng (base) thay vì (targetRect)
      switch (hint) {
        case 'left-top':
          left = baseLeft - PADDING - MARGIN - tWidth;
          top = baseTop;
          arrowDir = 'right';
          arrowPos = 20;
          break;
        case 'right-center':
          left = baseLeft + baseWidth + PADDING + MARGIN;
          top = baseTop + baseHeight / 2 - tHeight / 2;
          arrowDir = 'left';
          arrowPos = tHeight / 2 - 8;
          break;
        case 'right-top':
          left = baseLeft + baseWidth + PADDING + MARGIN;
          top = baseTop;
          arrowDir = 'left';
          arrowPos = 20;
          break;
        case 'corner-top-right':
          left = baseLeft + baseWidth + MARGIN + 4;
          top = baseTop - tHeight + baseHeight + 16;
          arrowDir = 'left';
          arrowPos = tHeight - 36;
          break;
        case 'top-right':
          top = baseTop - PADDING - MARGIN - tHeight;
          left = baseLeft + baseWidth - tWidth + 20;
          arrowDir = 'down';
          arrowPos = tWidth - 40;
          break;
        default: // 'bottom-center'
          top = baseTop + baseHeight + PADDING + MARGIN;
          left = baseLeft + baseWidth / 2 - tWidth / 2;
          arrowDir = 'up';
          arrowPos = tWidth / 2 - 8;
      }

      // 3. Khống chế viền màn hình (Viewport Clamping) để chống văng Tooltip
      if (left < 16) left = 16;
      if (left + tWidth > wWidth - 16) left = wWidth - tWidth - 16;
      if (top < 16) top = 16;
      if (top + tHeight > wHeight - 16) top = wHeight - tHeight - 16;

      // Lưu chung vào arrowPos
      setPos({ top, left, arrowDir, arrowPos });

      // Cho phép Transition bật lại ở Frame tiếp theo (Fix lỗi Flying Animation)
      requestAnimationFrame(() => setIsMounted(true));
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
  }, [targetRect, currentStepIndex, stepData]);

  const arrowStyle: React.CSSProperties =
    pos.arrowDir === 'up'
      ? {
          top: '-8px',
          left: `${pos.arrowPos}px`,
          borderBottom: '8px solid white',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
        }
      : pos.arrowDir === 'down'
        ? {
            bottom: '-8px',
            left: `${pos.arrowPos}px`,
            borderTop: '8px solid white',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
          }
        : pos.arrowDir === 'left'
          ? {
              top: `${pos.arrowPos}px`,
              left: '-8px',
              borderRight: '8px solid white',
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
            }
          : pos.arrowDir === 'right'
            ? {
                top: `${pos.arrowPos}px`,
                right: '-8px',
                borderLeft: '8px solid white',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
              }
            : { display: 'none' };

  return (
    <div
      ref={tooltipRef}
      // 1. SENIOR FIX: Thêm `pointer-events-auto` để bật lại tương tác chuột cho riêng Tooltip
      className={`absolute bg-white rounded-xl shadow-2xl p-5 w-[340px] z-[9999] pointer-events-auto ${isMounted ? 'transition-all duration-300 ease-out' : ''}`}
      style={{ top: pos.top, left: pos.left, opacity: pos.top === -9999 ? 0 : 1 }}
    >
      <div className="absolute w-0 h-0" style={arrowStyle} />

      {/* Nút Close góc trên phải */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <CloseButton onClick={endTour} />
      </div>

      {/* 1. SENIOR FIX: Bố cục Flexbox nằm ngang, chia tỷ lệ 70% Trái - 30% Phải */}
      <div className="flex flex-row items-center w-full mt-2 mb-4">
        <div className="w-[70%] text-left text-slate-700 font-bold text-[14px] leading-relaxed pr-2">
          {stepData?.content}
        </div>
        <div className="w-[30%] flex justify-center shrink-0">
          <img
            src={bot_showing}
            alt="Bot"
            className="w-[60px] h-[60px] object-contain drop-shadow-md"
          />
        </div>
      </div>

      {stepData?.videoUrl && (
        <div className="w-full mb-5 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
          <video src={stepData.videoUrl} autoPlay loop muted className="w-full h-auto" />
        </div>
      )}

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

        {/* 1. SENIOR FIX: Ẩn nút Next/Finish nếu Step yêu cầu click trực tiếp (interactable = true) */}
        {!stepData?.interactable ? (
          <button
            onClick={isLast ? endTour : nextStep}
            className="bg-[#1E3A8A] text-white px-4 py-1.5 rounded-lg font-bold hover:bg-[#112255] transition-colors shadow-md"
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        ) : (
          // Khối div tàng hình này giúp Flexbox space-between không bị xô lệch
          // khi nút Next biến mất, giữ cho text "1 / 3" luôn nằm ở giữa.
          <div className="w-[70px]"></div>
        )}
      </div>
    </div>
  );
}
