// Vị trí: src/shared/components/CodeEditor/components/Buttons/ResetButton.tsx
import icon_reset from '../../../../Assets/autorenew.svg';

interface ResetButtonProps {
  onClick: () => void;
}

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors border border-gray-700 hover:bg-gray-700 shadow-sm"
    >
      <img src={icon_reset} alt="Reset" className="w-4 h-4 opacity-80" />
      Reset
    </button>
  );
}
