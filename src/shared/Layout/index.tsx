// Vị trí: src/shared/components/Layout/index.tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserProfileCard from '../components/UserProfileCard';
import { useAuthContext_v2 } from '../context/hooks/useAuthContext_v2';
import { useModalStore } from '../store/useModalStore';
import { useRightbarStore } from '../store/useRightbarStore'; // Import store mới
import Login from '../../features/auth/Login';
import Register from '../../features/auth/Register';
import { StreakWidget } from './components/StreakWidget';
import { TextSelectionPopover } from '../components/TextSelectionPopover';
import { useEffect } from 'react';

interface CustomLocationState {
  autoOpenSignup?: boolean;
}

export function Layout() {
  const location = useLocation(); // Khai báo
  const navigate = useNavigate(); // Khai báo
  const { user } = useAuthContext_v2();
  const {
    isLoginOpen,
    isRegisterOpen,
    openLogin,
    openRegister,
    closeLogin,
    closeRegister,
    switchToLogin,
    switchToRegister,
  } = useModalStore();

  const rightbarContent = useRightbarStore((state) => state.content);

  useEffect(() => {
    const state = location.state as CustomLocationState | null;

    if (state && state.autoOpenSignup) {
      openRegister(); // Bật form đăng ký
      // Lập tức "tẩy xóa" tín hiệu trên URL State bằng cờ replace: true
      // Để nếu user bấm F5 (reload), form sẽ KHÔNG bị bật lên lại một cách vô duyên!
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate, openRegister]);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* CỘT 1: TRÁI (Sidebar cố định) */}
      <div className="h-full z-20 shrink-0">
        <Sidebar />
      </div>

      {/* VÙNG CUỘN CHUNG (Chứa Cột Giữa & Cột Phải) */}
      <div
        id="main-scroll-container"
        className="flex-1 h-full overflow-y-auto flex relative scroll-smooth [scrollbar-gutter:stable]"
      >
        {/* CỘT 2: GIỮA (Outlet - Tự bung chiều cao theo nội dung) */}
        <div className="flex-1 min-w-0 relative pl-[100px] pr-[40px]">
          <Outlet />
        </div>

        {/* CỘT 3: PHẢI (UserProfile + Dynamic Content) */}
        {/* Thêm sticky top-0 self-start h-screen để ghim cột này đứng yên khi cuộn */}
        <div className="w-[400px] shrink-0 px-6 pt-4 mr-[200px] flex flex-col gap-8 z-10 sticky top-0 self-start h-screen overflow-y-auto custom-scrollbar [scrollbar-gutter:stable]">
          {/* Phần trên cùng: User / Auth */}
          {/* Thêm sticky top-0 nếu bạn muốn Card này dính lại khi cuộn, tạm thời để bình thường để cuộn đồng bộ */}
          <div className="flex justify-end w-full">
            {user ? (
              <UserProfileCard userName={user.name} />
            ) : (
              <div className="flex items-center gap-3 animate-fadeIn mt-2">
                <button
                  onClick={openLogin}
                  className="text-primary font-bold px-6 py-2 border-primary border hover:bg-blue-50 rounded-full transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={openRegister}
                  className="bg-primary text-white font-bold px-5 py-2 rounded-full hover:bg-[#112255] transition-all shadow-md active:scale-95"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* SENIOR UPDATE: Gắn cứng Streak Widget ở Layout (Chỉ hiện khi đã đăng nhập) */}
          {user && (
            <div className="w-full animate-slideUp">
              <StreakWidget
                currentStreak={user.current_streak || 0}
                lastActiveAt={user.lastActiveAt} // <-- MỚI: Truyền xuống
              />
            </div>
          )}

          {/* Phần dưới: Cổng kết nối hiển thị nội dung động */}
          <div className="w-full flex-1">{rightbarContent}</div>
        </div>
      </div>

      {/* Popups */}
      <Login isOpen={isLoginOpen} onClose={closeLogin} onSwitchToRegister={switchToRegister} />
      <Register isOpen={isRegisterOpen} onClose={closeRegister} onSwitchToLogin={switchToLogin} />
      <TextSelectionPopover />
    </div>
  );
}
