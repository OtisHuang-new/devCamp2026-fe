import { useLocation, useNavigate } from 'react-router-dom';

import NameBrandPrime from '../../Assets/Brand/NameBrandPrime';
import SidebarButton from './components/Button';

import logo_dark from '@Assets/Brand/Assets/logo_dark.svg';
import icon_learning from './Assets/icon_learning_primary.svg';
import icon_exercise from './Assets/icon_exercise_primary.svg';
import type { MainNavItems } from './types/sideBarTypes';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems: MainNavItems[] = [
    { id: 'Learning', label: 'Learning', icon: icon_learning, path: '/roadmap' },
    { id: 'Exercise', label: 'Exercise', icon: icon_exercise, path: '/exercises' },
  ];

  return (
    <aside className="w-[250px] h-screen bg-white border-r border-gray-100 flex flex-col pb-10 shadow-sm shrink-0">
      <NameBrandPrime
        logoSrc={logo_dark}
        brandName="Cận Code Team"
        className="mb-20 px-6" // Tăng margin bottom cho thoáng
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
    </aside>
  );
};

export default Sidebar;
