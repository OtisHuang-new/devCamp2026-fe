// Vị trí: src/shared/components/CodeEditor/components/Buttons/ResetButton.tsx
import icon_reset from '../../../../Assets/autorenew.svg';

interface ResetButtonProps {
  onClick: () => void;
}

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent text-gray-300 border border-white/20 hover:text-white px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors hover:bg-gray-700 shadow-sm"
    >
      {/* 1. SENIOR FIX: Thêm brightness-0 invert để ép SVG thành màu trắng tuyệt đối */}
      <img src={icon_reset} alt="Reset" className="w-4 h-4 opacity-80 brightness-0 invert" />
      Reset
    </button>
  );
}
