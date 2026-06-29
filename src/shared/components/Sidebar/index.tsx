// Vị trí: src/features/Sidebar/index.tsx

import { useLocation, useNavigate } from 'react-router-dom';

import NameBrandPrime from '../../Assets/Brand/NameBrandPrime';
import SidebarButton from './components/Button';

import logo_dark from '@Assets/Brand/Assets/logo_dark.svg';
import icon_learning from './Assets/icon_learning_primary.svg';
import icon_exercise from './Assets/icon_exercise_primary.svg';
import type { MainNavItems } from './types/sideBarTypes';
import { useAudioStore } from '@/shared/store/useAudioStore';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. SENIOR FIX: Logic điều hướng (Pure logic, không side-effect vì chạy trong event handler)
  function handleBrandClick() {
    if (location.pathname === '/roadmap') {
      window.location.reload(); // Đang ở nhà -> F5 tải lại
    } else {
      navigate('/roadmap'); // Đang ở chỗ khác -> Điều hướng mượt về nhà
    }
  }

  const mainNavItems: MainNavItems[] = [
    { id: 'Learning', label: 'Learning', icon: icon_learning, path: '/roadmap' },
    { id: 'Exercise', label: 'Exercise', icon: icon_exercise, path: '/exercises' },
  ];

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col pb-10 shadow-xl shrink-0">
      <NameBrandPrime
        logoSrc={logo_dark}
        brandName="Cận Code Team"
        className="mb-20 px-6"
        onClick={handleBrandClick} // 2. SENIOR FIX: Truyền hàm click vào đây
      />

      <nav className="flex flex-col gap-3 px-4">
        {mainNavItems.map((item) => {
          const isActive: boolean = location.pathname.startsWith(item.path);

          return (
            <SidebarButton
              key={item.id}
              label={item.label}
              iconPath={item.icon}
              isActive={isActive}
              onClick={() => navigate(item.path)}
            />
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <AudioToggleButton />
      </div>
    </aside>
  );
}

export function AudioToggleButton() {
  const { isPlaying, togglePlay } = useAudioStore();

  return (
    <button
      onClick={togglePlay}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium text-sm w-full
        ${isPlaying ? 'bg-[#1A2E72] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
      `}
    >
      {/* Icon Loa (Bạn có thể dùng SVG của bạn) */}
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isPlaying ? (
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        )}
      </svg>
      {isPlaying ? 'BGM: On' : 'BGM: Off'}
    </button>
  );
}
