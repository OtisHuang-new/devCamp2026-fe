// Vị trí: src/shared/components/OnboardingTour/index.tsx
import { useEffect, useState } from 'react';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { TourTooltip } from './components/TourTooltip';

export function OnboardingTour() {
  const { isActive, steps, currentStepIndex } = useOnboardingStore();
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // 1. SENIOR FIX: Update State During Render để tránh Lỗi Cascading Render Linter
  const [prevActive, setPrevActive] = useState(isActive);
  if (isActive !== prevActive) {
    setPrevActive(isActive);
    if (!isActive || steps.length === 0) {
      setRect(null); // Reset thẳng tay khi Tour bị đóng
    }
  }

  // 2. SENIOR FIX: EFFECT CHỈ LÀM ĐÚNG VIỆC CỦA NÓ: Auto-Scroll & Tính toán Animation Frame
  useEffect(() => {
    // Nếu Tour đã tắt thì Effect này ngưng hoạt động
    if (!isActive || steps.length === 0) return;

    const targetId = steps[currentStepIndex]?.targetId;

    // Auto Cuộn trang từ từ đến Component (Chỉ khi chuyển Step mới)
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    // 1. SENIOR FIX: Không gọi updateRect() trực tiếp nữa!
    // Dùng requestAnimationFrame để đẩy nó sang Frame kế tiếp (Bất đồng bộ)
    animationFrameId = requestAnimationFrame(updateRect);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive, currentStepIndex, steps]);

  if (!isActive || !rect) return null;

  const PADDING = 4; // Margin-1 quanh Component

  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-auto animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Lỗ đục Mask */}
      <div
        className="absolute pointer-events-none transition-all duration-300 ease-out"
        style={{
          top: rect.top - PADDING,
          left: rect.left - PADDING,
          width: rect.width + PADDING * 2,
          height: rect.height + PADDING * 2,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
          borderRadius: '12px',
        }}
      />

      {/* Tooltip Giao diện */}
      <TourTooltip targetRect={rect} />
    </div>
  );
}
