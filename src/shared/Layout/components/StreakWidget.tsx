// Vị trí: src/shared/Layout/components/StreakWidget.tsx

import { calculateWeeklyStreak } from '../utils/streakLogic';
import { DayCircle } from './DayCircle';

// Giả định bạn lưu icon ở đúng thư mục assets của Layout
import iconStreak from '../assets/icon_streak.svg';

interface StreakWidgetProps {
  currentStreak: number;
  lastActiveAt?: string | null; // <-- MỚI: Nhận thêm mỏ neo từ Layout cha
}

const DAYS_OF_WEEK = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function StreakWidget({ currentStreak, lastActiveAt }: StreakWidgetProps) {
  // 1. SỬA: Truyền thêm mỏ neo vào hàm tính toán
  const weekStatus = calculateWeeklyStreak(currentStreak, lastActiveAt);

  return (
    <div className="w-full bg-[#F6F6F6] rounded-2xl p-5 flex flex-col gap-2 animate-fadeIn">
      {/* PHẦN TRÊN: Thông tin Text và Icon */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2 max-w-[75%] mt-1">
          <h3 className="text-3xl font-extrabold text-[#F58C14]">{currentStreak} Days streak</h3>
          <p className="text-[#F58C14] font-bold text-[15px] leading-snug">
            you are having the longest streak since then !
          </p>
        </div>

        {/* Icon lửa bự */}
        <img src={iconStreak} alt="Streak Fire" className="w-[80px] h-[80px] object-contain" />
      </div>

      {/* PHẦN DƯỚI: Thanh hiển thị 7 ngày */}
      <div className="bg-white rounded-2xl p-4 px-6 flex justify-between items-center shadow-sm">
        {DAYS_OF_WEEK.map((dayLabel, index) => (
          <DayCircle key={dayLabel} dayLabel={dayLabel} isActive={weekStatus[index]} />
        ))}
      </div>
    </div>
  );
}
