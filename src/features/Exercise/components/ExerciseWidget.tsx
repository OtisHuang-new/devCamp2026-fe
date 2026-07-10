import { useExercise } from '../hooks/useExercise';
// import { useEffect } from 'react';
// import { useEditorStore } from '../../../shared/store/useEditorStore';
import { MarkdownRender } from '../../../shared/components/MarkdownRender';
import { useSyncEditorStore } from '../hooks/useSyncEditorStore';
import { TestCaseList } from './TestCaseList';

import { useOnboardingStore } from '../../../shared/store/useOnboardingStore';
import { EXERCISE_WIDGET_TOUR } from '../../../shared/utils/onboardingConstants';
import { useEffect, useRef } from 'react';

interface ExerciseWidgetProps {
  exerciseId: string;
}

function ExerciseWidget({ exerciseId }: ExerciseWidgetProps) {
  const { exercise, isLoading } = useExercise(exerciseId);

  // 2. SENIOR FIX: Khởi tạo Ref để DOM gắn mắt thần
  const containerRef = useRef<HTMLDivElement>(null);
  const startTour = useOnboardingStore((state) => state.startTour);

  useSyncEditorStore(exercise);

  useEffect(() => {
    if (isLoading || !exercise) return;

    const tourKey = 'has_seen_exercise_widget_tour';
    const hasSeen = localStorage.getItem(tourKey);
    if (hasSeen) return;

    let timerId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          timerId = setTimeout(() => {
            // BẢO MẬT KÉP: Kiểm tra lại thực tế trong Local Storage tại thời điểm này
            // Tránh việc user cuộn lên cuộn xuống liên tục làm kẹt Closure
            const hasSeenNow = localStorage.getItem(tourKey);
            if (hasSeenNow) {
              observer.disconnect(); // Nếu đã xem thì "chọc mù" mắt thần luôn
              return;
            }

            // ANTI-HIJACK: Lấy state mới nhất. Nếu hệ thống đang bật Tour khác thì không được cướp quyền
            const { isActive } = useOnboardingStore.getState();

            if (!isActive) {
              startTour(EXERCISE_WIDGET_TOUR);
              localStorage.setItem(tourKey, 'true');
              observer.disconnect(); // Đục lỗ xong thì phá hủy observer luôn để không bị lặp!
            }
          }, 1500);
        } else {
          clearTimeout(timerId); // User cuộn đi mất -> Hủy đếm ngược
        }
      },
      {
        root: null,
        threshold: 0.2,
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Dọn dẹp siêu an toàn cho Strict Mode
    return () => {
      clearTimeout(timerId);
      observer.disconnect();
    };
  }, [isLoading, exercise, startTour]);

  if (isLoading) {
    return (
      <div className="w-full py-10 flex justify-center items-center text-gray-500 font-medium animate-pulse">
        Loading exercise...
      </div>
    );
  }

  if (!exercise) return null;

  return (
    // 4. SENIOR FIX: Gắn Ref và ID mục tiêu vào thẻ div ngoài cùng
    <div ref={containerRef} id="tour-exercise-widget" className="w-full animate-fadeIn">
      {/* 2. SENIOR FIX: Bọc flex justify-between để căn lề 2 bên (Space-between) */}
      <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-4xl font-bold text-[#1E3A8A]">
          {exercise.is_project ? 'Project' : 'Exercise'}
        </h2>
      </div>

      <div className="bg-[#F8F9FA] rounded-2xl py-5 px-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 mb-6">
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {exercise.title}
          </h3>
          <span
            className={`w-fit px-3 py-1 text-white text-xs font-bold rounded-full ${
              exercise.difficulty === 'Easy'
                ? 'bg-[#22C55E]'
                : exercise.difficulty === 'Medium'
                  ? 'bg-yellow-500'
                  : 'bg-[#DB4437]'
            }`}
          >
            {exercise.difficulty}
          </span>
        </div>

        <MarkdownRender
          content={exercise.content}
          className="text-black font-medium leading-relaxed space-y-4 mb-8"
        />

        <TestCaseList testCases={exercise.test_cases} />
      </div>
    </div>
  );
}

export default ExerciseWidget;
