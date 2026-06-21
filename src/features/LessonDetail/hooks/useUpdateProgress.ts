// Vị trí: src/features/LessonDetail/hooks/useUpdateProgress.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { userProgressApi } from '../api/userProgressApi';
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';
// 1. IMPORT TYPES: Lấy type từ Exercise feature
import type { PostSubmitResponse, SubmissionHistoryItem } from '../../Exercise/types/submitTypes';

export function useUpdateProgress(
  lessonId: string | undefined,
  history: SubmissionHistoryItem[],
  submitResult: PostSubmitResponse | null,
) {
  const { user, updateUser } = useAuthContext_v2();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Cờ hiệu StrictMode: Lưu lại id bài học đã được gọi API trong phiên làm việc này
  const triggeredLessonRef = useRef<string | null>(null);

  const triggerUpdate = useCallback(async () => {
    if (!user?._id) return;

    setIsUpdating(true);
    try {
      const res = await userProgressApi.updateLessonProgress(user._id);

      if (res.status === 'success' && res.data?.current_lesson_id) {
        updateUser({ current_lesson_id: res.data.current_lesson_id });
      }
    } catch (error) {
      console.error('Lỗi khi tự động cập nhật tiến độ bài học:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [user, updateUser]);

  // 2. LOGIC TỰ ĐỘNG ĐÁNH GIÁ VÀ GỌI API
  useEffect(() => {
    // Chặn nếu thiếu data quan trọng
    if (!lessonId || !user?._id) return;

    // 3. ĐIỀU KIỆN TIÊN QUYẾT: Chỉ kích hoạt nếu user đang thực sự ở bài học khớp với current_lesson_id
    // (Bảo vệ dữ liệu tuyến tính, tránh tụt tiến độ khi xem bài cũ)
    if (user.current_lesson_id !== lessonId) return;

    // 4. KIỂM TRA LỊCH SỬ (Xử lý case Load Page: Đã pass từ trước)
    const isAlreadyAccepted = history.some((item) => item.status === 'accepted');

    // 5. KIỂM TRA SUBMIT MỚI (Xử lý case nộp bài trực tiếp)
    let isNewSubmissionPassed = false;
    if (submitResult?.results && submitResult.results.length > 0) {
      const totalCases = submitResult.results.length;
      const passedCases = submitResult.results.filter((r) => r.status === 'passed').length;
      isNewSubmissionPassed = totalCases === passedCases;
    }

    // 6. THỰC THI (Kết hợp cờ hiệu để pass StrictMode 100% an toàn)
    if ((isAlreadyAccepted || isNewSubmissionPassed) && triggeredLessonRef.current !== lessonId) {
      triggeredLessonRef.current = lessonId; // Khóa cờ hiệu lại ngay lập tức
      triggerUpdate();
    }
  }, [lessonId, user, history, submitResult, triggerUpdate]);

  return { triggerUpdate, isUpdating };
}
