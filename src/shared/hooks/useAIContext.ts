// Vị trí: src/shared/hooks/useAIContext.ts
import { useState, useEffect } from 'react';
import { lessonApi } from '../../features/LessonDetail/api/lessonApi';
import { exerciseApi } from '../../features/Exercise/api/exerciseApi';

export type ContextType = 'lesson' | 'exercise' | 'project';

const pendingRequests = new Map<string, Promise<string | null>>();
const CACHE_PREFIX = 'ai_context_';

function getCache(key: string): string | null {
  return sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
}

function setCache(key: string, data: string) {
  sessionStorage.setItem(`${CACHE_PREFIX}${key}`, data);
}

// Hàm lõi (Core fetcher) xử lý chung cho cả 3 type
async function fetchAndCacheContext(
  itemId: string,
  userId: string,
  type: ContextType,
): Promise<string | null> {
  const cacheKey = `${type}_${itemId}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) return cachedData;

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<string | null>;
  }

  const requestPromise = (async () => {
    try {
      // 1. Rẽ nhánh API động theo type
      const data =
        type === 'lesson'
          ? await lessonApi.contextualizeLesson(itemId, userId)
          : await exerciseApi.contextualizeExercise(itemId, userId);

      if (
        typeof data === 'string' &&
        (data.includes('RESOURCE_EXHAUSTED') || data.includes('429'))
      ) {
        throw new Error('Hết token AI ròi bro ơi huhu 😭');
      }

      if (data) {
        setCache(cacheKey, data);
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
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

export async function prefetchAIContext(
  itemId?: string | null,
  userId?: string | null,
  type: ContextType = 'lesson',
) {
  if (!itemId || !userId) return;
  try {
    await fetchAndCacheContext(itemId, userId, type);
  } catch (error) {
    console.error(`Failed to prefetch AI context for ${type}`, error);
  }
}

export function useAIContext(itemId?: string, userId?: string, type: ContextType = 'lesson') {
  const cacheKey = itemId ? `${type}_${itemId}` : '';

  const [context, setContext] = useState<string | null>(() => {
    return cacheKey ? getCache(cacheKey) : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return cacheKey ? !getCache(cacheKey) : false;
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId || !userId || !cacheKey) return;

    let isMounted = true;

    async function fetchContext() {
      if (getCache(cacheKey)) {
        setContext(getCache(cacheKey));
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAndCacheContext(itemId!, userId!, type);
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
    }

    fetchContext();

    return () => {
      isMounted = false;
    };
  }, [itemId, userId, type, cacheKey]);

  return { context, isLoading, error };
}
