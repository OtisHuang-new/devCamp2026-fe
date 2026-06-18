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
        w-full flex items-center gap-8 pl-4 py-[11px] rounded-lg transition-all duration-200 group
        ${
          isActive
            ? 'bg-[#6D7EAE] text-white shadow-md'
            : 'bg-white text-[#1E3A8A] hover:bg-gray-100'
        }
      `}
    >
      <img
        src={iconPath}
        alt=""
        className={`w-6 h-6 object-contain transition-all duration-200 
          ${isActive ? 'brightness-0 invert' : ''}
        `}
      />

      <span className="font-bold text-xl whitespace-nowrap">{label}</span>
    </button>
  );
};

export default SidebarButton;
