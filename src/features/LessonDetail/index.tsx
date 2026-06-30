import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLesson } from './hooks/useLesson';
import { useSubmitCode } from '../Exercise/hooks/useSubmitCode';
import { useSubmissionHistory } from '../Exercise/hooks/useSubmissionHistory';

import SidePanel from '../../shared/components/SidePanel';
import LessonContent from './components/LessonContent';
import ExerciseWidget from '../Exercise/components/ExerciseWidget';
import CodeToggleButton from '../../shared/components/Buttons/CodeToggleButton';
import CodeEditor from '../../shared/components/CodeEditor';
import ScrollToTopButton from '../../shared/components/Buttons/ScrollToTopButton';
import SubmissionResult from '../../shared/components/SubmissionResult';
import { useNavigate } from 'react-router-dom';
import { useUpdateProgress } from './hooks/useUpdateProgress';

import { Return } from '@/shared/components/Return';

import { LoadingSpinner } from '@/shared/components/Loading/LoadingSpinner';
import { TextSelectionPopover } from '../../shared/components/TextSelectionPopover';
import { useEditorStore } from '@/shared/store/useEditorStore';

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lesson, isLoading } = useLesson(id);
  const navigate = useNavigate();

  const isEditorOpen = useEditorStore((state) => state.isOpen);
  const setIsEditorOpen = useEditorStore((state) => state.setIsOpen);
  const toggleEditorOpen = useEditorStore((state) => state.toggleOpen);

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = () => {
    if (leftColumnRef.current) {
      setShowScrollTop(leftColumnRef.current.scrollTop > 50);
    }
  };
  const scrollToTop = () => {
    leftColumnRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          className="w-full h-full overflow-y-auto flex flex-col scroll-smooth pb-[100px]"
        >
          <div className="pt-6 px-10">
            <Return text="Return to progress" />
          </div>

          <div className="px-10 py-4 flex flex-col gap-4">
            <LessonContent data={lesson} />
            <hr className="border-gray-100 my-1" />

            {lesson.exercise_id && <ExerciseWidget exerciseId={lesson.exercise_id} />}

            {isSubmitting && (
              <div className="w-full py-10">
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
            {!isSubmitting && history.length > 0 && (
              <SubmissionResult
                history={history}
                selectedIndex={selectedIndex}
                onSelectIndex={setSelectedIndex}
                onActionClick={() => navigate('/roadmap')}
                latestSubmitId={justSubmittedId}
              />
            )}
          </div>
        </div>

        <div className="absolute bottom-10 right-10 z-50">
          <ScrollToTopButton isVisible={showScrollTop} onClick={scrollToTop} />
        </div>
      </div>

      <div className="w-[35%] h-full">
        <SidePanel
          videoUrl={lesson.video_url}
          lessonId={lesson._id}
          exerciseId={lesson.exercise_id}
        />
      </div>

      {!isEditorOpen && (
        <CodeToggleButton isOpen={isEditorOpen} onToggle={() => setIsEditorOpen(true)} />
      )}

      <div className={isEditorOpen ? 'block' : 'hidden'}>
        <CodeEditor
          exerciseId={lesson?.exercise_id || ''}
          onClose={() => setIsEditorOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>

      <TextSelectionPopover />
    </div>
  );
};

export default LessonDetail;
