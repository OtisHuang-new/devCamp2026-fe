import { useState } from 'react';
import { userProgressApi } from '../api/userProgressApi';
import { useAuthContext } from '../../../shared/context/AuthContext';

export const useUpdateProgress = () => {
  const { user, updateUser } = useAuthContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const triggerUpdate = async () => {
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
  };

  return { triggerUpdate, isUpdating };
};
