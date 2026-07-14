// Vị trí: src/shared/components/CodeEditor/components/Buttons/ShowAnswerButton.tsx
import answer_icon from '@Assets/answer.svg'; // Hoặc '../../../../Assets/answer.svg' tùy alias của bạn

interface ShowAnswerButtonProps {
  onClick: () => void;
  isShowing: boolean;
}

export function ShowHintButton({ onClick, isShowing }: ShowAnswerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 active:scale-95 transition-all font-bold px-3 py-1.5 rounded-md shadow-sm border ${
        isShowing
          ? 'bg-red-600/20 hover:bg-red-600 border-red-500/30 text-red-400 hover:text-white'
          : 'bg-transparent hover:bg-yellow-600 text-gray-300 border-yellow-600/30 hover:text-white'
      }`}
      title={isShowing ? 'Hide Hint' : 'Show Hint'}
    >
      <img
        src={answer_icon}
        alt="Answer Icon"
        className="w-4 h-4 brightness-0 invert object-contain"
      />
      <span className="text-sm">{isShowing ? 'Hide Hint' : 'Hint'}</span>
    </button>
  );
}
