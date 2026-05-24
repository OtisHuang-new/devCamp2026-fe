interface SidebarButtonProps {
  label: string;
  iconPath: string;
  isActive: boolean;
  onClick: () => void;
}

function SidebarButton({ label, iconPath, isActive, onClick }: SidebarButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-3 cursor-pointer font-medium transition-all duration-200
                ${isActive ? 'bg-[#6D7EAE] text-white' : 'bg-white text-primary hover:bg-gray-100'}
            `}
    >
      <img src={iconPath} alt={`${label} icon`} className="w-5 h-5" />
      <span className="text-base">{label}</span>
    </div>
  );
}

export default SidebarButton;
