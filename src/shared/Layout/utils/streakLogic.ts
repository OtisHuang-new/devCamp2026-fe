// Vị trí: src/shared/Layout/utils/streakLogic.ts

/**
 * Hàm Pure Function: Tính toán mảng 7 ngày (T2 -> CN) có được đánh dấu Streak hay không.
 * @param currentStreak Số ngày học liên tiếp hiện tại
 * @param currentDate Ngày hiện tại (Mặc định là thời gian hệ thống thực)
 * @returns Mảng 7 boolean tương ứng từ Thứ 2 đến Chủ Nhật
 */
export function calculateWeeklyStreak(
  currentStreak: number,
  currentDate: Date = new Date(),
): boolean[] {
  // 1. Lấy vị trí ngày hôm nay (0: Chủ Nhật -> 6: Thứ Bảy)
  const dayOfWeek = currentDate.getDay();

  // 2. Chuyển đổi sang chuẩn VN: 0 (Thứ 2) -> 6 (Chủ Nhật)
  const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // 3. Khởi tạo mảng 7 ngày mặc định là chưa học (false)
  const weekStatus = [false, false, false, false, false, false, false];

  // 4. Lùi dần về quá khứ dựa trên số ngày streak
  for (let i = 0; i < currentStreak; i++) {
    const targetIndex = todayIndex - i;

    // Guard: Nếu lùi quá Thứ 2 của tuần này (index < 0) thì dừng vòng lặp
    if (targetIndex < 0) {
      break;
    }

    // Đánh dấu ngày đó là đã học (true)
    weekStatus[targetIndex] = true;
  }

  return weekStatus;
}
