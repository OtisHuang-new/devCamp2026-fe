import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLesson } from './hooks/useLesson';
import { useSubmitCode } from '../Exercise/hooks/useSubmitCode';
import { useSubmissionHistory } from '../Exercise/hooks/useSubmissionHistory';

import SidePanel from '../../shared/components/SidePanel';
import LessonContent from './components/LessonContent';
import ExerciseWidget from '../Exercise/components/ExerciseWidget';
import CodeToggleButton from '../../shared/components/CodeEditor/components/Buttons/CodeToggleButton';
import CodeEditor from '../../shared/components/CodeEditor';
import ScrollToTopButton from '../../shared/components/Buttons/ScrollToTopButton';
import SubmissionResult from '../../shared/components/SubmissionResult';
import { useNavigate } from 'react-router-dom';
import { useUpdateProgress } from './hooks/useUpdateProgress';
import { smoothScrollTo } from '@/shared/utils/scrollUtils';
import { Return } from '@/shared/components/Return';

import { LoadingSpinner } from '@/shared/components/Loading/LoadingSpinner';
import { TextSelectionPopover } from '../../shared/components/TextSelectionPopover';
import { useEditorStore } from '@/shared/store/useEditorStore';
import { NavigationFooter } from '@/shared/components/NavigationFooter';

import { getNextStepInfo } from '@/shared/utils/navigationUtils';

import { useOnboardingStore } from '@/shared/store/useOnboardingStore';
import { LESSON_TOP_TOUR } from '@/shared/utils/onboardingConstants';

import { OnboardingTour } from '../../shared/components/OnboardingTour';

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lesson, isLoading } = useLesson(id);
  const navigate = useNavigate();

  const isEditorOpen = useEditorStore((state) => state.isOpen);
  const setIsEditorOpen = useEditorStore((state) => state.setIsOpen);
  const toggleEditorOpen = useEditorStore((state) => state.toggleOpen);

  const initialCode = useEditorStore((state) => state.initialCode);
  const currentCode = useEditorStore((state) => state.currentCode);
  const hasUnsavedChanges = currentCode !== initialCode;

  const {
    submitCode,
    isSubmitting,
    submitResult,
    error: submitError,
    justSubmittedId,
  } = useSubmitCode(lesson?.exercise_id);

  const { history, selectedIndex, setSelectedIndex, fetchHistory } = useSubmissionHistory(
    lesson?.exercise_id,
  );

  useUpdateProgress(id, history, submitResult);

  const leftColumnRef = useRef<HTMLDivElement>(null);
  const exerciseContainerRef = useRef<HTMLDivElement>(null);

  const resultContainerRef = useRef<HTMLDivElement>(null);
  const prevIsSubmitting = useRef(isSubmitting);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExerciseBottomReached, setIsExerciseBottomReached] = useState(false); // 2. Bổ sung State

  const hasPassed = history.some((item) => item.status === 'accepted');
  const footerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null); // <-- THÊM DÒNG NÀY

  const handleExit = () => navigate('/roadmap');
  const handleNext = () => {
    if (!lesson) return;

    // Ném ID bài hiện tại vào cỗ máy tính toán
    const nextStep = getNextStepInfo(lesson._id);

    if (nextStep) {
      if (nextStep.type === 'project') {
        navigate(`/exercises/${nextStep.id}`);
      } else {
        navigate(`/lessons/${nextStep.id}`);
      }
    } else {
      // Graceful degradation: Nếu là bài cuối cùng hoặc lỡ bị lỗi cache, dội về màn Roadmap cho an toàn
      navigate('/roadmap');
    }
  };

  const handleScroll = () => {
    if (leftColumnRef.current) {
      setShowScrollTop(leftColumnRef.current.scrollTop > 50);

      // 3. SENIOR FIX: Toán học giao điểm (Intersection Math)
      if (exerciseContainerRef.current) {
        const rect = exerciseContainerRef.current.getBoundingClientRect();
        // Nút Toggle cao 44px, dính chặt đáy -> Rìa trên của nó = Chiều cao màn hình - 44px
        // Nếu Rìa dưới của Exercise <= Rìa trên của Nút -> Đã cuộn qua
        if (rect.bottom <= window.innerHeight - 44) {
          setIsExerciseBottomReached(true);
        } else {
          setIsExerciseBottomReached(false);
        }
      }
    }
  };

  const scrollToTop = () => {
    if (leftColumnRef.current) {
      smoothScrollTo(leftColumnRef.current, 0, 300);
    }
  };

  useEffect(() => {
    return () => {
      sessionStorage.setItem('exited_from_lesson', 'true');
    };
  }, []);

  useEffect(() => {
    const container = leftColumnRef.current;
    if (!container) return;

    // A. Tạm thời phế võ công 'scroll-smooth' của Tailwind bằng Inline Style
    container.style.scrollBehavior = 'auto';

    // B. Teleport tức thời lên tọa độ 0
    container.scrollTop = 0;

    // C. Bật lại tính năng cuộn mượt sau khi đã dịch chuyển xong (50ms là mức an toàn cho Frame DOM)
    const restoreTimer = setTimeout(() => {
      container.style.scrollBehavior = '';
    }, 50);

    return () => clearTimeout(restoreTimer);
  }, [id]); // Chạy Effect này mỗi khi URL ID thay đổi

  useEffect(() => {
    const container = leftColumnRef.current;
    const loader = loadingRef.current;

    // Nếu vừa bấm Submit, Lập tức Teleport tới cọc mốc Loading Spinner
    if (isSubmitting && container && loader) {
      container.style.scrollBehavior = 'auto'; // Tắt mượt
      loader.scrollIntoView({ behavior: 'auto', block: 'center' }); // Teleport giữa màn hình

      const restoreTimer = setTimeout(() => {
        container.style.scrollBehavior = ''; // Bật mượt trở lại
      }, 50);
      return () => clearTimeout(restoreTimer);
    }
  }, [isSubmitting]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        // 3. Sử dụng hàm toggle an toàn từ Store thay vì (prev) => !prev
        toggleEditorOpen();
      }
      if (e.key === 'Escape') {
        setIsEditorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsEditorOpen, toggleEditorOpen]);

  const startTour = useOnboardingStore((state) => state.startTour);

  useEffect(() => {
    // 1. Đợi data sẵn sàng
    if (isLoading || !lesson) return;

    const tourKey = 'has_seen_lesson_top_tour';

    // 2. Chặn ngay nếu đã xem (Kiểm tra vòng ngoài: Lần sau vào lại sẽ return luôn ở đây)
    if (localStorage.getItem(tourKey)) return;

    // 3. SENIOR FIX: BẬT KHIÊN KHÓA CUỘN TRONG 500ms
    // Chặn user cuộn trang làm lệch tọa độ trước khi Tooltip kịp xuất hiện
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

    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', preventScrollKeys, { passive: false });

    // 4. SENIOR FIX: Khởi tạo timer, KHÔNG set localStorage ở đây
    const timer = setTimeout(() => {
      // Tháo khiên ngay lập tức khi 500ms kết thúc
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', preventScrollKeys);

      // 5. BẢO MẬT KÉP: Kiểm tra lại trước khi bóp cò (Đề phòng Strict Mode)
      if (!localStorage.getItem(tourKey)) {
        // Anti-hijack: Check xem có Tour nào khác đang chạy không
        const { isActive } = useOnboardingStore.getState();
        if (!isActive) {
          startTour(LESSON_TOP_TOUR);

          // 6. Chỉ đánh dấu ĐÃ XEM khi Tour THỰC SỰ ĐƯỢC BẬT
          localStorage.setItem(tourKey, 'true');
        }
      }
    }, 500);

    // 7. Dọn dẹp: Strict Mode unmount sẽ hủy timer và tháo khiên an toàn tuyệt đối
    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', preventScrollKeys);
    };
  }, [isLoading, lesson, startTour]);

  useEffect(() => {
    const container = leftColumnRef.current;
    const resultEl = resultContainerRef.current;

    // Nếu vừa chuyển từ Đang chấm (true) -> Chấm xong (false) VÀ có kết quả
    if (prevIsSubmitting.current === true && isSubmitting === false && history.length > 0) {
      if (container && resultEl) {
        const timer = setTimeout(() => {
          // Trượt đến tọa độ mép trên của Khu vực Kết quả (trừ hao 20px cho đẹp)
          const targetPos = resultEl.offsetTop - 20;
          smoothScrollTo(container, targetPos, 600);
        }, 100); // Đợi 100ms để DOM vẽ xong thẻ SubmissionResult

        return () => clearTimeout(timer);
      }
    }
    prevIsSubmitting.current = isSubmitting;
  }, [isSubmitting, history.length]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-gray-500">
        Loading Lesson...
      </div>
    );
  if (!lesson)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-red-500">
        Found no Lesson, huhu @@
      </div>
    );

  // 3. SỬA HÀM NÀY:
  const handleSubmit = async (code: string) => {
    if (!lesson?.exercise_id || !id) return;

    await submitCode(lesson.exercise_id, id, code);

    // Nạp lại History sau khi nộp
    await fetchHistory();

    setIsEditorOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      <div className="w-[65%] h-full relative border-r border-gray-100">
        <div
          ref={leftColumnRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-auto flex flex-col scroll-smooth pb-[300px]"
        >
          <div className="pt-6 px-10">
            <Return text="Exit Home" to="/roadmap" />
          </div>

          <div className="px-10 py-4 flex flex-col gap-4">
            <LessonContent data={lesson} />
            <hr className="border-gray-100 my-1" />

            {lesson.exercise_id && (
              <div ref={exerciseContainerRef}>
                <ExerciseWidget exerciseId={lesson.exercise_id} />
              </div>
            )}

            {isSubmitting && (
              <div ref={loadingRef} className="w-full py-10">
                <LoadingSpinner
                  text="Evaluating your submission..."
                  iconSize="w-8 h-8"
                  textColor="text-gray-500"
                />
              </div>
            )}

            {submitError && (
              <div className="w-full text-center py-6 text-red-500 font-bold">
                Submission Error: {submitError}
              </div>
            )}

            {lesson.exercise_id && !isSubmitting && history.length > 0 ? (
              // 6. CẬP NHẬT: Bọc thẻ div có chứa Ref để làm mỏ neo cuộn trang
              <div ref={resultContainerRef}>
                <SubmissionResult
                  history={history}
                  selectedIndex={selectedIndex}
                  onSelectIndex={setSelectedIndex}
                  latestSubmitId={justSubmittedId}
                  footerRef={footerRef}
                >
                  {(showHighlight) => (
                    <NavigationFooter
                      ref={footerRef}
                      onExit={handleExit}
                      onNext={handleNext}
                      isPassed={hasPassed}
                      showHighlight={showHighlight}
                      hasUnsavedChanges={hasUnsavedChanges}
                    />
                  )}
                </SubmissionResult>
              </div>
            ) : (
              lesson.exercise_id &&
              !isSubmitting && (
                <NavigationFooter
                  ref={footerRef}
                  onExit={handleExit}
                  onNext={handleNext}
                  isPassed={hasPassed}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              )
            )}

            {/* 2. SENIOR FIX: VIDEO ĐƯỢC DỜI XUỐNG DƯỚI CÙNG LÀM TÀI LIỆU THAM KHẢO */}
            {lesson.video_url && (
              <div className="w-full mt-16 flex flex-col items-center">
                <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe
                    className="w-full h-full"
                    // 3. SENIOR FIX: Tự động chuyển đổi URL sang định dạng Embed (/preview) của Google Drive
                    src={lesson.video_url.replace(/\/view.*$/, '/preview')}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 right-10 z-50">
          <ScrollToTopButton isVisible={showScrollTop} onClick={scrollToTop} />
        </div>
      </div>

      <div className="w-[35%] h-full">
        <SidePanel
          lessonId={lesson._id}
          exerciseId={lesson.exercise_id}
          hideVideo={true}
          // 1. SENIOR UPDATE: Truyền tín hiệu Code Editor đang mở vào
          isEditorOpen={isEditorOpen}
        />
      </div>

      {!isEditorOpen && (
        <CodeToggleButton
          isOpen={isEditorOpen}
          onToggle={() => setIsEditorOpen(true)}
          showHintBubble={history.length === 0 && isExerciseBottomReached}
        />
      )}

      <div className={isEditorOpen ? 'block' : 'hidden'}>
        <CodeEditor
          exerciseId={lesson?.exercise_id || ''}
          onClose={() => setIsEditorOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>

      <TextSelectionPopover />
      <OnboardingTour />
    </div>
  );
};

export default LessonDetail;
