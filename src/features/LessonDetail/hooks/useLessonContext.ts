import { useState, useEffect } from 'react';
import { lessonApi } from '../api/lessonApi';

const pendingRequests = new Map<string, Promise<string | null>>();

const CACHE_PREFIX = 'ai_context_';

const getCache = (lessonId: string): string | null => {
  return sessionStorage.getItem(`${CACHE_PREFIX}${lessonId}`);
};

const setCache = (lessonId: string, data: string) => {
  sessionStorage.setItem(`${CACHE_PREFIX}${lessonId}`, data);
};

const fetchAndCacheContext = async (lessonId: string, userId: string): Promise<string | null> => {
  const cachedData = getCache(lessonId);
  if (cachedData) {
    return cachedData;
  }

  if (pendingRequests.has(lessonId)) {
    return pendingRequests.get(lessonId) as Promise<string | null>;
  }

  const requestPromise = (async () => {
    try {
      const data = await lessonApi.contextualizeLesson(lessonId, userId);

      if (
        typeof data === 'string' &&
        (data.includes('RESOURCE_EXHAUSTED') || data.includes('429'))
      ) {
        throw new Error('Hết token AI ròi bro ơi huhu 😭');
      }

      if (data) {
        setCache(lessonId, data);
        return data;
      }

      return null;
    } catch (error: unknown) {
      const errString = JSON.stringify(error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (
        errString.includes('429') ||
        errString.includes('RESOURCE_EXHAUSTED') ||
        errorMessage.includes('Hết token')
      ) {
        throw new Error('Hết token AI ròi bro ơi huhu 😭');
      }
      throw new Error('Có lỗi xảy ra khi gọi AI phân tích.');
    } finally {
      pendingRequests.delete(lessonId);
    }
  })();

  pendingRequests.set(lessonId, requestPromise);

  return requestPromise;
};

export const prefetchLessonContext = async (lessonId?: string | null, userId?: string | null) => {
  if (!lessonId || !userId) return;
  try {
    await fetchAndCacheContext(lessonId, userId);
  } catch (error) {
    console.error('Failed to prefetch AI context', error);
  }
};

export const useLessonContext = (lessonId?: string, userId?: string) => {
  const [context, setContext] = useState<string | null>(() => {
    return lessonId ? getCache(lessonId) : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return lessonId ? !getCache(lessonId) : false;
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId || !userId) return;

    let isMounted = true;

    const fetchContext = async () => {
      if (getCache(lessonId)) {
        setContext(getCache(lessonId));
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAndCacheContext(lessonId, userId);

        if (isMounted && data) {
          setContext(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContext();

    return () => {
      isMounted = false;
    };
  }, [lessonId, userId]);

  return { context, isLoading, error };
};
