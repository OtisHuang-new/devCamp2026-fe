import Sidebar from '../../shared/Sidebar';
import UserProfileCard from '../../shared/UserProfileCard';
import HeaderInfo from './Components/HeaderInfo';
import Chapter from './Components/Chapter';
import Login from '../auth/Login';
import Register from '../auth/Register';
import { useAuthContext_v2 } from '../../shared/context/hooks/useAuthContext_v2';
import { useState, useRef, useEffect, useMemo } from 'react'; // BỔ SUNG IMPORT
import { useRoadmap } from './hooks/useRoadmap'; // BỔ SUNG IMPORT TỪ HOOK VỪA TẠO
import { useNavigate, useLocation } from 'react-router-dom';
import SideLessonSection from './Components/SideLessonSection';
import ScrollToTopButton from '../../shared/Buttons/ScrollToTopButton';
import { prefetchLessonContext } from '../LessonDetail/hooks/useLessonContext';

function Roadmap() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuthContext_v2();
  const { chapters, rawData, isLoading } = useRoadmap(user?.current_lesson_id);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(() => {
    const shouldOpen = location.state?.openRegister || false;

    // Pure function: Nếu có mở, dùng history API xóa state trên URL ngầm
    // để lỡ người dùng ấn F5 thì popup không bị tự động bật lại
    if (shouldOpen) {
      window.history.replaceState({}, '');
    }
    return shouldOpen;
  });

  const sideChapter = rawData.length > 0 ? rawData[0] : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainChapters: any[] = useMemo(() => {
    return chapters.length > 1 ? chapters.slice(1) : [];
  }, [chapters]);

  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const hasScrolledToCurrent = useRef(false);

  useEffect(() => {
    if (user?.current_lesson_id && user?._id) {
      prefetchLessonContext(user.current_lesson_id, user._id);
    }
    if (mainChapters.length > 0 && user?.current_lesson_id && !hasScrolledToCurrent.current) {
      const targetNode = document.getElementById(`roadmap-node-${user.current_lesson_id}`);
      if (targetNode) {
        targetNode.scrollIntoView({ behavior: 'auto', block: 'center' });

        hasScrolledToCurrent.current = true;
      }
    }
  }, [mainChapters, user?.current_lesson_id, user?._id]);

  const handleScroll = () => {
    if (!headerRef.current || mainChapters.length === 0 || !mainRef.current) return;

    if (mainRef.current.scrollTop > 50) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }

    const headerBottom = headerRef.current.getBoundingClientRect().bottom;
    const projectNodes = document.querySelectorAll('[data-project-marker]');
    let currentIndex = 0;

    for (let i = 0; i < projectNodes.length; i++) {
      const node = projectNodes[i];
      const rect = node.getBoundingClientRect();
      if (headerBottom >= rect.top + rect.height * 0.8) {
        if (mainChapters[i + 1]) currentIndex = i + 1;
      }
    }
    if (currentIndex !== activeChapterIndex) setActiveChapterIndex(currentIndex);
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading)
    return <div className="flex justify-center items-center h-screen">Loading Roadmap...</div>;

  return (
    <div className="flex w-full min-h-screen bg-white">
      <Sidebar />

      <main
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth"
      >
        <div className="w-full flex gap-12 ml-[140px] pr-10 pb-20">
          <div className="flex-1 max-w-2xl">
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

            <div className="mt-8 flex flex-col gap-4 relative pb-[500px]">
              {mainChapters.map((chapter, index) => (
                <Chapter
                  key={chapter.id}
                  chapterNumber={chapter.chapterNumber}
                  chapterTitle={chapter.title}
                  isFirstChapter={index === 0}
                  nodes={chapter.nodes}
                  isAuthenticated={!!user}
                  onRequireAuth={() => setIsRegisterOpen(true)}
                />
              ))}
            </div>

            <div className="sticky bottom-10 w-full flex justify-end pointer-events-none z-50">
              <div className="pointer-events-auto">
                <ScrollToTopButton isVisible={showScrollTop} onClick={scrollToTop} />
              </div>
            </div>
          </div>

          <div className="w-[350px] flex flex-col gap-6 mt-3 sticky top-3 h-fit z-40">
            {/* 2.1: Khối Auth & Profile (Nằm sát trên cùng, căn lề phải 100%) */}
            <div className="flex justify-end w-full z-50">
              {user ? (
                <UserProfileCard userName={user.name} />
              ) : (
                <div className="flex items-center gap-3 mt-1.5 animate-fadeIn">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-primary font-bold px-6 py-2 border-primary border hover:bg-blue-50 rounded-full transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-primary text-white font-bold px-5 py-2 rounded-full hover:bg-[#112255] transition-all shadow-md active:scale-95"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {sideChapter && (
              <div className="w-full">
                <SideLessonSection
                  chapterData={sideChapter}
                  onLessonClick={(id) => navigate(`/lessons/${id}`)}
                  isAuthenticated={!!user} // Truyền cờ xác thực vào đây
                />
              </div>
            )}
          </div>
        </div>

        <Login
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
        <Register
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      </main>
    </div>
  );
}

export default Roadmap;
