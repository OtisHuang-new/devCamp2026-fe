// Vị trí: src/shared/store/useOnboardingStore.ts
import { create } from 'zustand';

export interface TourStep {
  targetId: string;
  content: string;
  interactable?: boolean;
  videoUrl?: string;
  positionHint?:
    | 'top-right'
    | 'bottom-center'
    | 'left-top'
    | 'right-center'
    | 'right-top'
    | 'corner-top-right'
    | 'auto';
  requireSmoothScroll?: boolean;
  disableScroll?: boolean;
  highlightShape?: 'rect' | 'circle';

  // 1. SENIOR FIX: Bổ sung API Tịnh tiến & Co giãn lỗ đục (Tính bằng Pixel)
  offsetX?: number; // Dịch chuyển sang trái/phải
  offsetY?: number; // Dịch chuyển lên/xuống
  expandW?: number; // Mở rộng/Thu hẹp chiều ngang
  expandH?: number; // Mở rộng/Thu hẹp chiều dọc
}

interface OnboardingStore {
  isActive: boolean;
  steps: TourStep[];
  currentStepIndex: number;
  startTour: (steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  isActive: false,
  steps: [],
  currentStepIndex: 0,
  startTour: (steps) => set({ isActive: true, steps, currentStepIndex: 0 }),
  nextStep: () =>
    set((state) => ({
      currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1),
    })),
  prevStep: () =>
    set((state) => ({
      currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
    })),
  endTour: () => set({ isActive: false, steps: [], currentStepIndex: 0 }),
}));
