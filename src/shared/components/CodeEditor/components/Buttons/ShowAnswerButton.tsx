// Vị trí: src/shared/components/CodeEditor/components/Buttons/ShowAnswerButton.tsx
import answer_icon from '@Assets/answer.svg'; // Hoặc '../../../../Assets/answer.svg' tùy alias của bạn

interface ShowAnswerButtonProps {
  onClick: () => void;
}

export function ShowAnswerButton({ onClick }: ShowAnswerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all text-white font-bold px-3 py-1.5 rounded-md shadow-sm border border-black/15"
      title="Show Answer Key"
    >
      <img
        src={answer_icon}
        alt="Answer Icon"
        className="w-4 h-4 brightness-0 invert object-contain"
      />
      <span className="text-sm">Solution</span>
    </button>
  );
}
