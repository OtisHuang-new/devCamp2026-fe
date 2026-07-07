// Vị trí: src/shared/utils/onboardingConstants.ts
import type { TourStep } from '../store/useOnboardingStore';

export const ROADMAP_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'onboarding-sidebar-section', // Đổi target trỏ về Sidebar
    content: 'Đây là thanh điều hướng chính, bạn có thể chuyển đổi giữa các tính năng tại đây.',
  },
  {
    targetId: 'roadmap-streak-widget-section',
    content: 'You can see your streak here!',
  },
];
