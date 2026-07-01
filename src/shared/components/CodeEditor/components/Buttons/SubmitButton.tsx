// Vị trí: src/shared/components/CodeEditor/components/Buttons/SubmitButton.tsx

interface SubmitButtonProps {
  onClick: () => void;
}

export function SubmitButton({ onClick }: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#22C55E] text-white px-4 py-1.5 rounded-md font-bold text-sm hover:bg-[#16a34a] transition-all shadow-sm"
    >
      Submit
    </button>
  );
}
