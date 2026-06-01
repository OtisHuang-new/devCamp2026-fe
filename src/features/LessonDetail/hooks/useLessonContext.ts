// Vị trí: src/features/LessonDetail/hooks/useLessonContext.ts
import { useState, useEffect } from 'react';
import { lessonApi } from '../api/lessonApi';

const contextCache = new Map<string, string>();

export const prefetchLessonContext = async (lessonId?: string | null, userId?: string | null) => {
  if (!lessonId || !userId || contextCache.has(lessonId)) return;
  try {
    const data = await lessonApi.contextualizeLesson(lessonId, userId);
    if (data) contextCache.set(lessonId, data);
  } catch (error) {
    console.error('Failed to prefetch AI context', error);
  }
};

export const useLessonContext = (lessonId?: string, userId?: string) => {
  const initialData = lessonId ? contextCache.get(lessonId) || null : null;
  const [context, setContext] = useState<string | null>(() => {
    return lessonId ? contextCache.get(lessonId) || null : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId || !userId || contextCache.has(lessonId)) return; // Chỉ chạy khi CHƯA có cache

    const fetchContext = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await lessonApi.contextualizeLesson(lessonId, userId);

        // Đề phòng trường hợp API trả về HTTP 200 nhưng body chứa chữ "RESOURCE_EXHAUSTED"
        if (
          typeof data === 'string' &&
          (data.includes('RESOURCE_EXHAUSTED') || data.includes('429'))
        ) {
          setError('Hết token AI ròi bro ơi huhu 😭');
          return;
        }

        if (data) {
          contextCache.set(lessonId, data);
          setContext(data);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Lỗi khi lấy AI Context:', err);

        // --- 2. BẮT TỪ KHÓA LỖI TỪ CATCH ---
        const errString = JSON.stringify(err);
        if (errString.includes('429') || errString.includes('RESOURCE_EXHAUSTED')) {
          setError('Hết token AI ròi bro ơi huhu 😭');
        } else if (err.response?.data?.message && err.response.data.message.includes('429')) {
          setError('Hết token AI ròi bro ơi huhu 😭');
        } else {
          setError('Có lỗi xảy ra khi gọi AI phân tích.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContext();
  }, [lessonId, userId]);

  // --- 3. EXPORT THÊM ERROR ---
  return { context, isLoading, error };
};
