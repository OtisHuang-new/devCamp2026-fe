import { useState } from 'react';
import NameBrandPrime from '../Brand/NameBrandPrime';
import SidebarButton from './components/Button';
import logo_dark from '../Brand/Assets/logo_dark.svg';
import icon_learning from './Assets/icon_learning_primary.svg';
import icon_exercise from './Assets/icon_exercise_primary.svg';
import icon_setting from './Assets/icon_setting.svg';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Learning');

  const mainNavItems = [
    { id: 'Learning', label: 'Learning', icon: icon_learning },
    { id: 'Exercise', label: 'Exercise', icon: icon_exercise },
  ];

  return (
    <aside className="w-[250px] h-screen bg-white border-r border-gray-100 flex flex-col pb-10 shadow-sm shrink-0">
      <NameBrandPrime
        logoSrc={logo_dark}
        brandName="Cận Code Team"
        className="mb-20 px-6" // Tăng margin bottom cho thoáng
      />

      <nav className="flex flex-col gap-3 px-4">
        {mainNavItems.map((item) => (
          <SidebarButton
            key={item.id}
            label={item.label}
            iconPath={item.icon}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div className="mt-auto px-4">
        <SidebarButton
          label="Setting"
          iconPath={icon_setting}
          isActive={activeTab === 'Setting'}
          onClick={() => setActiveTab('Setting')}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
