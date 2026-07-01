// Vị trí: src/shared/components/CodeEditor/components/Buttons/RunButton.tsx

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
}

export function RunButton({ onClick, isRunning }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isRunning}
      className={`px-4 py-1.5 rounded-md font-bold text-sm transition-all ${
        isRunning
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
          : 'bg-gray-200 text-gray-800 hover:bg-white shadow-sm'
      }`}
    >
      {isRunning ? 'Running...' : 'Run'}
    </button>
  );
}
