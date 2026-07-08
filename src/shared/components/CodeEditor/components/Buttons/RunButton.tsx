// Vị trí: src/shared/components/CodeEditor/components/Buttons/RunButton.tsx
import icon_play from '../../../../Assets/play_arrow.svg';

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
}

export function RunButton({ onClick, isRunning }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isRunning}
      // 1. CẬP NHẬT: Thêm flex, items-center và gap-1.5 để căn ngang icon và text
      className={`flex items-center justify-center gap-1.5 pr-4 pl-2.5 py-1.5 rounded-md font-bold text-sm transition-all ${
        isRunning
          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
          : 'bg-gray-400 text-gray-800 hover:bg-gray-300 shadow-sm'
      }`}
    >
      {/* 2. CẬP NHẬT: Thêm thẻ img chứa icon. Trạng thái Running thì ẩn icon đi cho gọn */}
      {!isRunning && (
        <img src={icon_play} alt="Run" className="w-4 h-4 object-contain opacity-80" />
      )}
      <span>{isRunning ? 'Running...' : 'Run'}</span>
    </button>
  );
}
