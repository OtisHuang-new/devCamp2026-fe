import React from 'react';

interface SidebarButtonProps {
  label: string;
  iconPath: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  iconPath,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-6 py-2 rounded-lg transition-all duration-200 group
        ${
          isActive
            ? 'bg-[#6D7EAE] text-white shadow-md'
            : 'bg-white text-[#1E3A8A] hover:bg-gray-100'
        }
      `}
    >
      {/* MẸO: Dùng filter 'brightness-0 invert' 
          - Nếu icon màu tối -> brightness-0 làm nó thành đen -> invert làm nó thành TRẮNG.
          - Cách này cực kì an toàn và nhẹ hơn dùng mask-image.
      */}
      <img
        src={iconPath}
        alt=""
        className={`w-6 h-6 object-contain transition-all duration-200 
          ${isActive ? 'brightness-0 invert' : ''}
        `}
      />

      <span className="font-bold text-lg whitespace-nowrap">{label}</span>
    </button>
  );
};

export default SidebarButton;
