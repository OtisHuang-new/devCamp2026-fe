import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLesson } from './hooks/useLesson';
import { useSubmitCode } from './hooks/useSubmitCode';

import SidePanel from './components/SidePanel';
import LessonContent from './components/LessonContent';
import ExerciseWidget from '../Exercise/components/ExerciseWidget';
import CodeToggleButton from '../../shared/components/Buttons/CodeToggleButton';
import CodeEditor from '../../shared/components/CodeEditor';
import ScrollToTopButton from '../../shared/components/Buttons/ScrollToTopButton';
import SubmissionResult from './components/SubmissionResult';
import { useNavigate } from 'react-router-dom';
import { useUpdateProgress } from './hooks/useUpdateProgress';

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { lesson, isLoading } = useLesson(id);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const navigate = useNavigate();
  const {
    submitCode,
    isSubmitting,
    submitResult,
    error: submitError,
  } = useSubmitCode(lesson?.exercise_id);
  const { triggerUpdate } = useUpdateProgress();

  useEffect(() => {
    if (submitResult && submitResult.passedCount === submitResult.total) {
      triggerUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitResult]);

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
        setIsEditorOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsEditorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-gray-500">
        Đang tải bài học...
      </div>
    );
  if (!lesson)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-red-500">
        Không tìm thấy bài học!
      </div>
    );

  const handleSubmit = async (code: string) => {
    if (!lesson?.exercise_id || !id) return;

    await submitCode(lesson.exercise_id, id, code);

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
            <button
              onClick={() => navigate('/roadmap')}
              className="text-gray-500 text-sm hover:text-[#1E3A8A] flex items-center gap-2 "
            >
              <span>←</span> Return to progress
            </button>
          </div>

          <div className="px-10 py-4 flex flex-col gap-4">
            <LessonContent data={lesson} />
            <hr className="border-gray-100 my-4" />

            {lesson.exercise_id && <ExerciseWidget exerciseId={lesson.exercise_id} />}

            {isSubmitting && (
              <div className="w-full text-center py-6 text-gray-500 font-bold animate-pulse">
                Đang chấm điểm...
              </div>
            )}
            {submitError && (
              <div className="w-full text-center py-6 text-red-500 font-bold">
                Lỗi khi nộp bài: {submitError}
              </div>
            )}
            {!isSubmitting && submitResult && (
              <SubmissionResult data={submitResult} onActionClick={() => navigate('/roadmap')} />
            )}
          </div>
        </div>

        <div className="absolute bottom-10 right-10 z-50">
          <ScrollToTopButton isVisible={showScrollTop} onClick={scrollToTop} />
        </div>
      </div>

      <div className="w-[35%] h-full">
        <SidePanel videoUrl={lesson.video_url} />
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
    </div>
  );
};

export default LessonDetail;
