import type { ExerciseListItem } from '../types/exerciseListTypes';
import { IconGreenTick } from '../assets';

interface ExerciseListRowProps {
  data: ExerciseListItem;
}

export function ExerciseListRow({ data }: ExerciseListRowProps) {
  const difficultyColors: Record<ExerciseListItem['difficulty'], string> = {
    Easy: 'text-green-500',
    Medium: 'text-orange-500',
    Hard: 'text-red-500',
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 odd:bg-[#EAECEF] even:bg-white hover:opacity-80 transition-opacity cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-5 h-5 flex items-center justify-center">
          {data.isSolved ? (
            <img src={IconGreenTick} alt="Solved" className="w-5 h-5" />
          ) : (
            <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[#1A2E72]"></div>
          )}
        </div>

        <span className="text-[#1A2E72] font-medium text-[18px]">
          {data.id}. {data.title}
        </span>
      </div>

      <span className={`text-sm font-medium ${difficultyColors[data.difficulty]}`}>
        {data.difficulty}
      </span>
    </div>
  );
}
