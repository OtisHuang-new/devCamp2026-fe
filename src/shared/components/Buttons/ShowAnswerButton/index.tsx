// Vị trí: src/shared/components/Buttons/ShowAnswerButton.tsx
import answer_icon from '@Assets/answer.svg';
import { useEditorStore } from '@/shared/store/useEditorStore';
import { useToastStore } from '@/shared/store/useToastStore';
import type { ToastPosition } from '@/shared/store/useToastStore';

interface ShowAnswerButtonProps {
  keyCode: string;
  toastPosition?: ToastPosition; // 2. Thêm prop optional
}

export function ShowAnswerButton({
  keyCode,
  toastPosition = 'bottom-center',
}: ShowAnswerButtonProps) {
  const setInitialCode = useEditorStore((state) => state.setInitialCode);
  const setIsOpen = useEditorStore((state) => state.setIsOpen);
  const addToast = useToastStore((state) => state.addToast);

  function handleShowAnswer() {
    setInitialCode(keyCode);
    setIsOpen(true);
    // 3. Truyền position vào tham số thứ 4
    addToast('Loaded answer into code editor successfully!.', 4000, false, toastPosition);
  }

  return (
    <button
      onClick={handleShowAnswer}
      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all text-white font-bold px-4 py-2 rounded-lg shadow-sm"
      title="Show Answer Key"
    >
      <img
        src={answer_icon}
        alt="Answer Icon"
        className="w-5 h-5 brightness-0 invert object-contain"
      />
      <span className="text-sm">Show answer</span>
    </button>
  );
}
