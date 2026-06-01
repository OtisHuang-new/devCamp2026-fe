import type { LayoutType } from '../surveyData';

interface OptionButtonProps {
  text: string;
  iconPath: string;
  isSelected: boolean;
  layout: LayoutType;
  onClick: () => void;
}

function OptionButton({ text, iconPath, isSelected, layout, onClick }: OptionButtonProps) {
  const widthClass = layout === 'grid-nx1' ? 'w-[588px]' : 'w-[282px]';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-[20px] px-[14px] ${widthClass} h-[49px] rounded box-border cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? 'bg-[#9CA9C9] text-[#1E3A8A]'
                    : 'bg-white ring-1 ring-gray-300 text-[#1E3A8A] hover:ring-[3px] hover:ring-[#1E3A8A]'
                }
            `}
    >
      <img src={iconPath} alt={`${text} icon`} className="w-6 h-6" />
      <span className="text-[17px] font-bold">{text}</span>
    </div>
  );
}

export default OptionButton;
