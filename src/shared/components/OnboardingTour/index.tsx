// Vị trí: src/shared/components/OnboardingTour/index.tsx
import { useEffect, useState } from 'react';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { TourTooltip } from './components/TourTooltip';
import { scrollToElement } from '../../utils/scrollUtils';

export function OnboardingTour() {
  const { isActive, steps, currentStepIndex, endTour, nextStep } = useOnboardingStore();

  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const [isPreparingScroll, setIsPreparingScroll] = useState(false);

  // 1. SENIOR FIX: ĐỒNG BỘ TRẠNG THÁI NGAY LÚC RENDER (Chống 1-frame Glitch)
  const [prevActive, setPrevActive] = useState(isActive);
  const [prevStepIndex, setPrevStepIndex] = useState(currentStepIndex);

  const [isGoingBack, setIsGoingBack] = useState(false);

  if (isActive !== prevActive || currentStepIndex !== prevStepIndex) {
    // Xác định hành động "Back": Vẫn đang trong cùng Tour nhưng index giảm
    const backward = isActive === prevActive && currentStepIndex < prevStepIndex;
    setIsGoingBack(backward);

    setPrevActive(isActive);
    setPrevStepIndex(currentStepIndex);

    if (!isActive || steps.length === 0) {
      setRect(null);
      setIsPreparingScroll(false);
    } else {
      const nextStepData = steps[currentStepIndex];
      // 2. SENIOR FIX: Nếu đi lùi (backward) -> Hủy bỏ hoàn toàn cờ Cinematic Scroll
      if (nextStepData?.requireSmoothScroll && !backward) {
        setIsPreparingScroll(true);
      } else {
        setIsPreparingScroll(false);
      }
    }
  }

  // 2. SENIOR FIX: EFFECT CHỈ LÀM ĐÚNG VIỆC CỦA NÓ
  useEffect(() => {
    if (!isActive || steps.length === 0) return;

    const stepData = steps[currentStepIndex];
    const targetId = stepData?.targetId;
    const el = document.getElementById(targetId);

    const preventDefault = (e: Event) => e.preventDefault();
    const preventScrollKeys = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (
        ['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(
          keyboardEvent.code,
        )
      ) {
        e.preventDefault();
      }
    };

    let timerId: ReturnType<typeof setTimeout>;

    if (stepData.requireSmoothScroll && !isGoingBack) {
      // Bật khiên cản tương tác vật lý
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      window.addEventListener('keydown', preventScrollKeys, { passive: false });

      if (el) {
        scrollToElement(el, 'center', 800);
      }

      // Đếm đúng 800ms thì tắt màng đen và nhả phím cho User
      timerId = setTimeout(() => {
        setIsPreparingScroll(false);
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
        window.removeEventListener('keydown', preventScrollKeys);
      }, 800);
    } else {
      // Chế độ cũ HOẶC đang "Đi lùi" -> Fallback về Scroll bình thường không hiệu ứng
      if (el && !stepData.disableScroll) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    let animationFrameId: number;
    const updateRect = () => {
      const target = document.getElementById(targetId);
      if (target) {
        const newRect = target.getBoundingClientRect();
        setRect((prev) => {
          if (
            !prev ||
            prev.top !== newRect.top ||
            prev.left !== newRect.left ||
            prev.width !== newRect.width ||
            prev.height !== newRect.height
          ) {
            return {
              top: newRect.top,
              left: newRect.left,
              width: newRect.width,
              height: newRect.height,
            };
          }
          return prev;
        });
      }
      animationFrameId = requestAnimationFrame(updateRect);
    };

    animationFrameId = requestAnimationFrame(updateRect);

    const handleTargetClick = () => {
      setTimeout(() => {
        if (currentStepIndex === steps.length - 1) {
          endTour();
        } else {
          nextStep();
        }
      }, 0);
    };

    if (stepData?.interactable && el) {
      el.addEventListener('click', handleTargetClick, true);
    }

    return () => {
      clearTimeout(timerId); // Dọn timer an toàn
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', preventScrollKeys);

      cancelAnimationFrame(animationFrameId);
      if (stepData?.interactable && el) {
        el.removeEventListener('click', handleTargetClick, true);
      }
    };
  }, [isActive, currentStepIndex, steps, endTour, nextStep, isGoingBack]);

  if (!isActive || !rect) return null;

  const PADDING = 8;
  const stepData = steps[currentStepIndex];

  // 3. SENIOR FIX: LÕI TOÁN HỌC TÍNH TOÁN HÌNH DÁNG VÀ TỊNH TIẾN LỖ ĐỤC
  const isCircle = stepData?.highlightShape === 'circle';

  // Đọc cấu hình tịnh tiến (Fallback về 0 nếu không cấu hình để không làm vỡ các Tour cũ)
  const offsetX = stepData?.offsetX || 0;
  const offsetY = stepData?.offsetY || 0;
  const expandW = stepData?.expandW || 0;
  const expandH = stepData?.expandH || 0;

  // Áp dụng Tịnh tiến và Co giãn vào Tọa độ gốc
  let holeTop = rect.top - PADDING + offsetY;
  let holeLeft = rect.left - PADDING + offsetX;
  let holeWidth = rect.width + PADDING * 2 + expandW;
  let holeHeight = rect.height + PADDING * 2 + expandH;
  let holeRadius = '12px'; // Mặc định là bo góc vuông

  // Nếu là Hình Tròn: Ưu tiên đường kính lớn nhất để bo tròn hoàn hảo
  if (isCircle) {
    const extraSize = Math.max(expandW, expandH); // Lấy mức giãn nở lớn nhất
    const diameter = Math.max(rect.width, rect.height) + PADDING * 2 + extraSize;

    // Tính toán lại tâm (Center) và áp dụng khoảng dịch chuyển offset
    holeTop = rect.top + rect.height / 2 - diameter / 2 + offsetY;
    holeLeft = rect.left + rect.width / 2 - diameter / 2 + offsetX;
    holeWidth = diameter;
    holeHeight = diameter;
    holeRadius = '50%';
  }

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none transition-opacity duration-300">
      {/* MÀN ĐEN MỜ */}
      {isPreparingScroll && (
        <div
          className="absolute inset-0 bg-black/30 pointer-events-auto transition-opacity duration-300 z-50"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {/* VỎ BỌC ĐỤC LỖ */}
      <div
        className={`w-full h-full ${isPreparingScroll ? 'opacity-0' : 'opacity-100 transition-opacity duration-500 ease-in-out'}`}
      >
        {/* HIỆU ỨNG THỊ GIÁC: Đục lỗ bằng Shadow Động */}
        <div
          className="absolute pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: holeTop,
            left: holeLeft,
            width: holeWidth,
            height: holeHeight,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            borderRadius: holeRadius, // Áp dụng hình tròn hoặc hình vuông tùy cờ hiệu
          }}
        />

        {/* 6. SENIOR FIX: 4 BỨC TƯỜNG CẢN CLICK ĐƯỢC NÂNG CẤP THEO TỌA ĐỘ MỚI */}
        <div
          className="absolute bg-transparent pointer-events-auto"
          style={{ top: 0, left: 0, right: 0, height: holeTop }}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="absolute bg-transparent pointer-events-auto"
          style={{ top: holeTop + holeHeight, left: 0, right: 0, bottom: 0 }}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="absolute bg-transparent pointer-events-auto"
          style={{ top: holeTop, left: 0, width: holeLeft, height: holeHeight }}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="absolute bg-transparent pointer-events-auto"
          style={{ top: holeTop, left: holeLeft + holeWidth, right: 0, height: holeHeight }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* KHỐI TRUNG TÂM */}
        {!stepData?.interactable && (
          <div
            className="absolute bg-transparent pointer-events-auto"
            style={{ top: holeTop, left: holeLeft, width: holeWidth, height: holeHeight }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        <TourTooltip targetRect={rect} />
      </div>
    </div>
  );
}
