import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext_v2 } from '../../shared/context/hooks/useAuthContext_v2';
import { useModalStore } from '../../shared/store/useModalStore';
import { useRoadmap } from './hooks/useRoadmap';
import { useRoadmapScroll } from './hooks/useRoadmapScroll';
import HeaderInfo from './Components/HeaderInfo';
import Chapter from './Components/Chapter';
import SideLessonSection from './Components/SideLessonSection';
import ScrollToTopButton from '../../shared/components/Buttons/ScrollToTopButton';
import { useRightbarStore } from '../../shared/store/useRightbarStore';
import { AuthGatekeeper } from '@/shared/components/AuthGatekeeper';
import { prefetchAIContext } from '@/shared/hooks/useAIContext';

import { useOnboardingStore } from '@/shared/store/useOnboardingStore';
import { ROADMAP_TOUR_STEPS } from '@/shared/utils/onboardingConstants';

import { fetchMeDeduped } from '../../shared/context/api/authContextApi';
import { LoadingSpinner } from '../../shared/components/Loading/LoadingSpinner';

function Roadmap() {
  const navigate = useNavigate();

  const { user, isLoading: isAuthLoading, updateUser } = useAuthContext_v2();
  const { openRegister } = useModalStore();

  const [isFromLesson] = useState(() => {
    const flag = sessionStorage.getItem('exited_from_lesson');
    if (flag) {
      sessionStorage.removeItem('exited_from_lesson');
      return true;
    }
    return false;
  });

  const [isRefreshingAuth, setIsRefreshingAuth] = useState(isFromLesson);

  const [showFadeIn, setShowFadeIn] = useState(false);

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
  const startTour = useOnboardingStore((state) => state.startTour);

  useEffect(() => {
    let isMounted = true;

    // 1. SENIOR FIX: Bọc logic vào setTimeout 0 để đẩy ra khỏi luồng đồng bộ
    // Chấm dứt hoàn toàn cảnh báo Cascading Renders của React 19.
    const timerId = setTimeout(() => {
      // Nếu chưa đăng nhập HOẶC chỉ là chuyển tab Sidebar -> KHÔNG gọi API, thoát luôn!
      if (!user || !isFromLesson) {
        if (isMounted) setIsRefreshingAuth(false);
        return;
      }

      // Gọi API lấy dữ liệu mới nhất
      fetchMeDeduped()
        .then((data) => {
          if (isMounted && data) {
            updateUser(data);
          }
        })
        .catch((err) => console.error('Failed to refresh profile:', err))
        .finally(() => {
          if (isMounted) setIsRefreshingAuth(false);
        });
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timerId); // Dọn dẹp an toàn chuẩn Strict Mode
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Đảm bảo User đã load xong
    if (!user) return;

    const tourKey = 'has_seen_roadmap_tour';
    if (localStorage.getItem(tourKey)) return;

    const timer = setTimeout(() => {
      // Bảo mật kép bên trong Timer
      if (!localStorage.getItem(tourKey)) {
        const { isActive } = useOnboardingStore.getState();

        if (!isActive) {
          startTour(ROADMAP_TOUR_STEPS);
          localStorage.setItem(tourKey, 'true');
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user, startTour]);

  useEffect(() => {
    // 3. SỬA: Nếu chưa đăng nhập thì dọn sạch Rightbar (chỉ để lại nút login)
    if (user && sideChapter) {
      setRightbarContent(
        <SideLessonSection
          chapterData={sideChapter}
          onLessonClick={(id) => navigate(`/lessons/${id}`)}
          isAuthenticated={!!user}
        />,
      );
    } else {
      setRightbarContent(null);
    }
    return () => setRightbarContent(null);
  }, [sideChapter, navigate, user, setRightbarContent]);

  useEffect(() => {
    if (user?.current_lesson_id && user?._id) {
      // 2. ĐỔI TÊN HÀM VÀ BỔ SUNG TYPE 'lesson' ĐỂ PREFETCH
      prefetchAIContext(user.current_lesson_id, user._id, 'lesson');
    }
  }, [user?.current_lesson_id, user?._id]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isAuthLoading && !isRefreshingAuth && !isLoading) {
      timer = setTimeout(() => setShowFadeIn(true), 50);
    } else {
      // 2. SENIOR FIX: Reset state bằng timer 0ms để tránh ghi đè luồng Render đồng bộ
      timer = setTimeout(() => setShowFadeIn(false), 0);
    }

    return () => clearTimeout(timer);
  }, [isAuthLoading, isRefreshingAuth, isLoading]);

  if (isFromLesson && (isAuthLoading || isRefreshingAuth || isLoading)) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col justify-center items-center">
        <LoadingSpinner
          text="Loading Roadmap..."
          iconSize="w-12 h-12"
          textColor="text-[#1E3A8A] text-lg"
        />
      </div>
    );
  }

  // LUỒNG 2: Chuyển tab trong Sidebar (Chỉ hiện spinner bên trong, giữ nguyên Layout)
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[50vh]">
        <LoadingSpinner
          text="Loading..."
          iconSize="w-10 h-10"
          textColor="text-[#1E3A8A] text-base"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="w-full flex justify-center pt-10 px-8 animate-fadeIn">
        <AuthGatekeeper
          title="Cận Learning Roadmap"
          subtitle="AI, Personalize, and Easy to Learn: Learning Roadmap"
          promptText="Let start learning with personalized AI! Log in to start learning now!"
        />
      </main>
    );
  }

  return (
    // Thẻ main tự tạo thanh cuộn nội bộ để giữ lại cơ chế bắt sự kiện onScroll
    <main
      className={`w-full relative pb-[550px] transition-opacity duration-1000 ease-out ${
        showFadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Khung giới hạn hiển thị: Căn giữa, không giãn quá max-w-5xl */}
      <div className="w-full max-w-5xl mx-auto">
        <div id="roadmap-main-learning-section">
          <HeaderInfo
            ref={headerRef}
            chapterTitle={
              mainChapters[activeChapterIndex]
                ? `Chapter ${activeChapterIndex + 1}: ${mainChapters[activeChapterIndex].title}`
                : ''
            }
            lessonTitle=""
            onBackClick={() => console.log('Back clicked')}
            // 1. TRUYỀN MỚI: Lấy theme của chapter đang Active
            theme={mainChapters[activeChapterIndex]?.theme}
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
                // 2. TRUYỀN MỚI: Truyền Theme xuống từng Chapter
                theme={chapter.theme}
              />
            ))}
          </div>
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
