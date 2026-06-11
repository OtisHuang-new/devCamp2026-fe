import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext_v2 } from '../../shared/context/hooks/useAuthContext_v2';
import { useModalStore } from '../../shared/store/useModalStore';
import { useRoadmap } from './hooks/useRoadmap';
import { useRoadmapScroll } from './hooks/useRoadmapScroll';
import HeaderInfo from './Components/HeaderInfo';
import Chapter from './Components/Chapter';
import SideLessonSection from './Components/SideLessonSection';
import ScrollToTopButton from '../../shared/Buttons/ScrollToTopButton';
import { prefetchLessonContext } from '../LessonDetail/hooks/useLessonContext';
import { useRightbarStore } from '../../shared/store/useRightbarStore';

function Roadmap() {
  const navigate = useNavigate();
  const { user } = useAuthContext_v2();
  const { openRegister } = useModalStore();

  const { chapters, rawData, isLoading } = useRoadmap(user?.current_lesson_id);

  const sideChapter = rawData.length > 0 ? rawData[0] : null;
  const mainChapters = useMemo(() => {
    return chapters.length > 1 ? chapters.slice(1) : [];
  }, [chapters]);

  const { headerRef, activeChapterIndex, showScrollTop, scrollToTop } = useRoadmapScroll(
    mainChapters.length,
    user?.current_lesson_id,
  );

  const setRightbarContent = useRightbarStore((state) => state.setContent);

  useEffect(() => {
    if (sideChapter) {
      setRightbarContent(
        <SideLessonSection
          chapterData={sideChapter}
          onLessonClick={(id) => navigate(`/lessons/${id}`)}
          isAuthenticated={!!user}
        />,
      );
    }

    return () => {
      setRightbarContent(null);
    };
  }, [sideChapter, navigate, user, setRightbarContent]);

  useEffect(() => {
    if (user?.current_lesson_id && user?._id) {
      prefetchLessonContext(user.current_lesson_id, user._id);
    }
  }, [user?.current_lesson_id, user?._id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading Roadmap...</div>;
  }

  return (
    // Thẻ main tự tạo thanh cuộn nội bộ để giữ lại cơ chế bắt sự kiện onScroll
    <main className="w-full relative pb-[200px]">
      {/* Khung giới hạn hiển thị: Căn giữa, không giãn quá max-w-5xl */}
      <div className="w-full max-w-5xl mx-auto">
        <HeaderInfo
          ref={headerRef}
          chapterTitle={
            mainChapters[activeChapterIndex]
              ? `Chapter ${activeChapterIndex + 1}: ${mainChapters[activeChapterIndex].title}`
              : ''
          }
          lessonTitle=""
          onBackClick={() => console.log('Back clicked')}
        />

        <div className="mt-8 flex flex-col gap-4 relative w-full max-w-2xl">
          {mainChapters.map((chapter, index) => (
            <Chapter
              key={chapter.id}
              chapterNumber={chapter.chapterNumber}
              chapterTitle={chapter.title}
              isFirstChapter={index === 0}
              nodes={chapter.nodes}
              isAuthenticated={!!user}
              onRequireAuth={openRegister}
            />
          ))}
        </div>

        <div className="sticky bottom-10 w-full max-w-2xl flex justify-end pointer-events-none z-50">
          <div className="pointer-events-auto">
            <ScrollToTopButton isVisible={showScrollTop} onClick={scrollToTop} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Roadmap;
