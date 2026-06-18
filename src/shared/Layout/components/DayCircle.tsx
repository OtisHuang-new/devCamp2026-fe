// Vị trí: src/shared/Layout/components/DayCircle.tsx
import iconTick from '../assets/icon_tick.svg';

interface DayCircleProps {
  dayLabel: string;
  isActive: boolean;
}

export function DayCircle({ dayLabel, isActive }: DayCircleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Tên thứ (T2, T3...) */}
      <span className="text-black font-bold text-lg">{dayLabel}</span>

      {/* Vòng tròn hiển thị trạng thái */}
      <div
        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all ${
          isActive ? 'bg-[#F58C14]' : 'bg-[#EEEEEE]'
        }`}
      >
        {isActive && <img src={iconTick} alt="Completed" className="w-5 h-5 animate-fadeIn" />}
      </div>
    </div>
  );
}
