// Vị trí: src/shared/utils/onboardingConstants.ts
import type { TourStep } from '../store/useOnboardingStore';
import showVideo from '@Assets/show.mp4';

// TOUR 1: Màn Roadmap
export const ROADMAP_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-roadmap-first-lesson',
    content: "Let's start your journey by completing the first lesson. Click here!",
    interactable: true,
    positionHint: 'bottom-center',
    highlightShape: 'circle',

    // 2. SENIOR FIX: Đẩy lỗ đục dịch xuống dưới 6px (để bù trừ cho lớp shadow của nút bấm)
    // Bạn có thể tùy chỉnh con số này (ví dụ: 6, 8, 10) sao cho vừa mắt nhất!
    offsetY: 4,
    // Mở rộng thêm 1 chút xíu nếu thấy lỗ đục hơi sát viền nút
    expandW: 4,
    expandH: 4,
  },
];

// TOUR 2: Đầu trang Lesson Detail
export const LESSON_TOP_TOUR: TourStep[] = [
  {
    targetId: 'tour-lesson-content',
    content: 'This is the main learning area. Read carefully to master the concepts.',
    positionHint: 'right-top',
    disableScroll: true,
  },
  {
    targetId: 'tour-lesson-context',
    content:
      'Remember the job questions during onboarding? We use them to tailor the explanation just for you.',
    positionHint: 'bottom-center',
  },
  {
    targetId: 'tour-lesson-aichat',
    content: 'Highlight any text to ask AI for further explanation!',
    videoUrl: showVideo,
    positionHint: 'left-top',
  },
];

// TOUR 3: Cuối trang Lesson Detail (Thực hành)
export const EXERCISE_WIDGET_TOUR: TourStep[] = [
  {
    targetId: 'tour-exercise-widget',
    content: 'To pass this lesson, you need to complete this exercise.',
    positionHint: 'right-center',
    requireSmoothScroll: true,
  },
  {
    targetId: 'tour-code-toggle-btn',
    content: 'Click here or use shortcut to open the Code Editor and start coding!',
    interactable: true,
    positionHint: 'corner-top-right',
    highlightShape: 'circle',
    offsetY: 4,
    // Mở rộng thêm 1 chút xíu nếu thấy lỗ đục hơi sát viền nút
    expandW: 30,
    expandH: 30,
  },
];

export const getAnalysisTourSteps = (isPassed: boolean): TourStep[] => [
  {
    targetId: 'tour-ai-analysis',
    content: isPassed
      ? 'Great job passing on your first try! Check out the AI Analysis to see how you can optimize your code even further.'
      : "Don't worry about the errors! Read the AI Analysis here to understand what went wrong and how to fix it.",
    positionHint: 'right-center', // Mũi tên chỉ từ bên phải sang
    requireSmoothScroll: true,
  },
];
