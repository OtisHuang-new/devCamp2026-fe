import Sidebar from '../../shared/Sidebar';
import UserProfileCard from '../../shared/UserProfileCard';
import HeaderInfo from './Components/HeaderInfo';
import Chapter from './Components/Chapter';
import Login from '../auth/Login';
import Register from '../auth/Register';

// Import Context & Data
import { useAuthContext } from '../../shared/context/AuthContext';

import { useState, useRef, useEffect, useMemo } from 'react'; // BỔ SUNG IMPORT
import { useRoadmap } from './hooks/useRoadmap'; // BỔ SUNG IMPORT TỪ HOOK VỪA TẠO

import { useNavigate } from 'react-router-dom';
import SideLessonSection from './Components/SideLessonSection';
import ScrollToTopButton from './Components/ScrollToTopButton';

function Roadmap() {
  const { user } = useAuthContext();
  const { chapters, rawData, isLoading } = useRoadmap(user?.current_lesson_id);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const navigate = useNavigate();

  // Chapter đầu tiên (index 0) làm Side Lesson
  const sideChapter = rawData.length > 0 ? rawData[0] : null;
  // Các Chapter còn lại (từ index 1) làm Main Roadmap
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainChapters: any[] = useMemo(() => {
    return chapters.length > 1 ? chapters.slice(1) : [];
  }, [chapters]);

  // STATE & REF cho Scroll Logic
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const hasScrolledToCurrent = useRef(false);

  useEffect(() => {
    // --- 2. THÊM ĐIỀU KIỆN: Chỉ chạy nếu CHƯA từng cuộn ---
    if (mainChapters.length > 0 && user?.current_lesson_id && !hasScrolledToCurrent.current) {
      const targetNode = document.getElementById(`roadmap-node-${user.current_lesson_id}`);
      if (targetNode) {
        // behavior 'auto' sẽ Teleport (chớp mắt là tới) không có hiệu ứng cuộn
        targetNode.scrollIntoView({ behavior: 'auto', block: 'center' });

        // --- 3. ĐÁNH DẤU LÀ ĐÃ CUỘN XONG ---
        hasScrolledToCurrent.current = true;
      }
    }
  }, [mainChapters, user?.current_lesson_id]);

  // LOGIC TRACKING SCROLL
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
      {/* 1. Sidebar cố định */}
      <Sidebar />

      {/* 2. Main Content Area */}
      {/* BỔ SUNG: Gắn sự kiện onScroll vào thẻ main */}
      <main
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-col h-screen overflow-y-auto relative scroll-smooth"
      >
        {/* UserProfileCard */}
        <div className="fixed top-3 right-10 z-50">
          {user ? (
            // Nếu đã đăng nhập: Hiển thị Profile Card
            <UserProfileCard userName={user.name} />
          ) : (
            // Nếu CHƯA đăng nhập: Hiển thị 2 nút Login / Sign up
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

        {/* --- 4. BỐ CỤC LẠI LAYOUT: CHIA 2 CỘT TRÁI/PHẢI --- */}
        <div className="w-full flex gap-12 ml-[140px] pr-10 pb-20">
          {/* CỘT PHẢI: Khu vực chứa Roadmap chính */}
          <div className="flex-1 max-w-2xl">
            {/* Header Info (Sticky) */}
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

            {/* Roadmap Path */}
            <div className="mt-8 flex flex-col gap-4 relative pb-[500px]">
              {/* Lặp qua mainChapters thay vì chapters */}
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

          {sideChapter && (
            <div className="w-[350px] pt-[80px]">
              {/* Thêm sticky để Side Lesson luôn trôi theo màn hình khi user cuộn xuống */}
              <div className="sticky top-[80px]">
                <SideLessonSection
                  chapterData={sideChapter}
                  onLessonClick={(id) => navigate(`/lessons/${id}`)}
                />
              </div>
            </div>
          )}
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
