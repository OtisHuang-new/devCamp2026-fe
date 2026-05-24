import { useState } from 'react';
import BrandDark from './BrandDark';
import SidebarButton from './SidebarButton';

// Import icons
import icon_learning_white from '../../Assets/icon_learning_white.svg';
import icon_exercise_primary from '../../Assets/icon_exercise_primary.svg';
import icon_AI_primary from '../../Assets/icon_AI_primary.svg';
import icon_setting from '../../Assets/icon_setting.svg';
// (icon_user_prime có vẻ thuộc về Topbar/Header nên tạm không gọi ở Sidebar)

function Sidebar() {
  // State quản lý tab đang được chọn, mặc định là 'Learning'
  const [activeTab, setActiveTab] = useState<string>('Learning');

  // Mảng cấu hình các nút menu chính để render tự động
  const menuItems = [
    { label: 'Learning', icon: icon_learning_white, id: 'Learning' },
    { label: 'Exercise', icon: icon_exercise_primary, id: 'Exercise' },
    { label: 'AI chat bot', icon: icon_AI_primary, id: 'AI chat bot' },
  ];

  return (
    // Wrapper ngoài cùng: Cố định chiều rộng, chiều cao full màn hình, flex dọc
    <div className="w-[240px] h-screen bg-white flex flex-col border-r border-gray-200">
      {/* Header của Sidebar */}
      <BrandDark />

      {/* Khối Navigation chính */}
      <div className="flex flex-col mt-4">
        {menuItems.map((item) => (
          <SidebarButton
            key={item.id}
            label={item.label}
            iconPath={item.icon} // Lưu ý: Nếu có icon cho 2 state (trắng/xanh), bạn có thể thêm logic đổi icon ở đây
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>

      {/* Khối chức năng dưới đáy (dùng mt-auto để tự động đẩy xuống dưới) */}
      <div className="mt-auto mb-8">
        <SidebarButton
          label="Setting"
          iconPath={icon_setting}
          isActive={activeTab === 'Setting'}
          onClick={() => setActiveTab('Setting')}
        />
      </div>
    </div>
  );
}

export default Sidebar;
