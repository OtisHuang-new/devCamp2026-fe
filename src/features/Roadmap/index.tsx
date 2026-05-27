import Sidebar from '../../shared/Sidebar';
import UserProfileCard from '../../shared/UserProfileCard';
import HeaderInfo from './Components/HeaderInfo';
import Chapter from './Components/Chapter';
import Login from '../auth/Login';
import Register from '../auth/Register';

// Import Context & Data
import { useAuthContext } from '../../shared/context/AuthContext';
// import { mockRoadmapData } from './roadmapData';

import { useState, useRef, useEffect } from 'react'; // BỔ SUNG IMPORT
import { useRoadmap } from './hooks/useRoadmap'; // BỔ SUNG IMPORT TỪ HOOK VỪA TẠO

function Roadmap() {
  const { user } = useAuthContext();
  const { chapters, isLoading } = useRoadmap(user?.current_lesson_id);

  // BỔ SUNG: Khai báo State quản lý Overlay Form
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // STATE & REF cho Scroll Logic
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeChapterTitle, setActiveChapterTitle] = useState('');

  // Set default title khi data load xong
  useEffect(() => {
    if (chapters.length > 0 && !activeChapterTitle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveChapterTitle(chapters[0].title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters]);

  // LOGIC TRACKING SCROLL
  const handleScroll = () => {
    if (!headerRef.current || chapters.length === 0) return;

    // Lấy tọa độ đáy của thanh HeaderInfo
    const headerBottom = headerRef.current.getBoundingClientRect().bottom;

    // Tìm tất cả các Node Project (cúp) trên DOM
    const projectNodes = document.querySelectorAll('[data-project-marker]');

    let currentActiveTitle = chapters[0].title;

    // Duyệt qua từng Project node xem Header đã đè qua nó chưa
    for (let i = 0; i < projectNodes.length; i++) {
      const node = projectNodes[i];
      const rect = node.getBoundingClientRect();

      // Nếu ĐÁY CỦA HEADER đè qua 80% CHIỀU CAO của PROJECT BUTTON
      if (headerBottom >= rect.top + rect.height * 0.8) {
        // Nghĩa là đã qua Chapter thứ i, ta cập nhật title là Chapter i + 1 (Nếu có)
        if (chapters[i + 1]) {
          currentActiveTitle = chapters[i + 1].title;
        }
      }
    }

    // Tránh re-render liên tục nếu title không đổi
    if (currentActiveTitle !== activeChapterTitle) {
      setActiveChapterTitle(currentActiveTitle);
    }
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

        <div className="w-full max-w-2xl ml-[140px] pb-20">
          {/* Header Info (Sticky) - Phần title này sau sẽ được cập nhật động dựa theo vị trí cuộn chuột */}
          <HeaderInfo
            ref={headerRef}
            chapterTitle={activeChapterTitle}
            lessonTitle="Continue Learning" // Chữ tĩnh tạm thời, hoặc làm động sau tùy ý bạn
            onBackClick={() => console.log('Back clicked')}
          />

          {/* Roadmap Path: Vùng hiển thị các Chapter */}
          <div className="mt-8 flex flex-col gap-4 relative pb-[500px]">
            {/* Tự động render danh sách Chapter từ data */}
            {/* SỬ DỤNG MAP VỚI DATA TỪ API */}
            {chapters.map((chapter, index) => (
              <Chapter
                key={chapter.id}
                chapterNumber={chapter.chapterNumber}
                chapterTitle={chapter.title}
                isFirstChapter={index === 0}
                nodes={chapter.nodes}
                // --- 1. BỔ SUNG 2 DÒNG NÀY ---
                isAuthenticated={!!user} // Truyền trạng thái đăng nhập
                onRequireAuth={() => setIsRegisterOpen(true)} // Hàm mở form Sign Up
              />
            ))}
          </div>
        </div>

        {/* --- THÊM MỚI TẠI ĐÂY: Gắn 2 Overlay vào cuối thẻ main --- */}
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
        {/* -------------------------------------------------------- */}
      </main>
    </div>
  );
}

export default Roadmap;
