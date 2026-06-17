// Vị trí: src/shared/Layout/utils/streakLogic.ts

/**
 * Hàm Pure Function: Tính toán mảng 7 ngày (T2 -> CN) có được đánh dấu Streak hay không.
 * Nâng cấp: Sử dụng lastActiveAt làm mỏ neo thay vì "Hôm nay".
 */
export function calculateWeeklyStreak(
  currentStreak: number,
  lastActiveAt: string | null | undefined,
): boolean[] {
  // Khởi tạo mảng mặc định 7 ngày false
  const weekStatus = [false, false, false, false, false, false, false];

  // Nếu không có mỏ neo thời gian hoặc streak = 0, trả về rỗng luôn
  if (!lastActiveAt || currentStreak <= 0) {
    return weekStatus;
  }

  // 1. Tính toán Mốc thời gian của Streak (Đưa tất cả về 00:00:00 để so sánh chuẩn xác)
  const lastActiveDate = new Date(lastActiveAt);
  lastActiveDate.setHours(0, 0, 0, 0);

  const streakStartDate = new Date(lastActiveDate);
  streakStartDate.setDate(streakStartDate.getDate() - (currentStreak - 1));

  // 2. Tìm ngày Thứ Hai của TUẦN HIỆN TẠI (Làm Cửa sổ quét)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay(); // 0 là Chủ Nhật, 1 là T2...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const mondayOfThisWeek = new Date(today);
  mondayOfThisWeek.setDate(today.getDate() + diffToMonday);

  // 3. Duyệt 7 ngày của tuần này xem ngày nào rơi vào Streak thì bôi đen (true)
  for (let i = 0; i < 7; i++) {
    const currentDayNode = new Date(mondayOfThisWeek);
    currentDayNode.setDate(mondayOfThisWeek.getDate() + i);

    // Nếu ô tròn của ngày này nằm TRONG KHOẢNG từ streakStart đến lastActive
    if (currentDayNode >= streakStartDate && currentDayNode <= lastActiveDate) {
      weekStatus[i] = true;
    }
  }

  return weekStatus;
}
