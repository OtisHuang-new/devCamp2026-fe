interface ProcessBarProps {
  progress: number;
}

function ProcessBar({ progress }: ProcessBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = clampedProgress * 100;

  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex-1">
      <div
        className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default ProcessBar;
