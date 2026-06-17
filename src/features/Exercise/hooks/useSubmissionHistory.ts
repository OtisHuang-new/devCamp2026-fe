// Vị trí: src/features/Exercise/hooks/useSubmissionHistory.ts

import { useState, useEffect, useCallback } from 'react';
import { submitApi } from '../api/submitApi';
import type { SubmissionHistoryItem } from '../types/submitTypes';
import { useEditorStore } from '../../../shared/store/useEditorStore';
// 1. SỬA: Import thêm Hook Auth để lấy userId
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';

export function useSubmissionHistory(exerciseId: string | undefined) {
  // 2. SỬA: Lấy userId từ Context
  const { user } = useAuthContext_v2();
  const userId = user?._id;

  const [history, setHistory] = useState<SubmissionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const setInitialCode = useEditorStore((state) => state.setInitialCode);

  const fetchHistory = useCallback(async () => {
    // 3. SỬA: Chặn thực thi nếu thiếu userId
    if (!exerciseId || !userId) return;

    setIsLoading(true);
    try {
      // 4. SỬA: Truyền userId xuống API
      const data = await submitApi.getSubmissionHistory(exerciseId, userId);
      setHistory(data);
      setSelectedIndex(0);
    } catch (error: unknown) {
      console.error('Lỗi khi tải lịch sử:', error instanceof Error ? error.message : String(error));
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [exerciseId, userId]); // 5. SỬA: Đưa userId vào dependency

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      // 6. SỬA: Chặn thực thi nếu thiếu userId
      if (!exerciseId || !userId) return;
      setIsLoading(true);
      try {
        // 7. SỬA: Truyền userId xuống API
        const data = await submitApi.getSubmissionHistory(exerciseId, userId);
        if (isMounted) {
          setHistory(data);
          setSelectedIndex(0);
        }
      } catch (error: unknown) {
        if (isMounted) {
          console.error('Lỗi khi tải lịch sử:', error);
          setHistory([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [exerciseId, userId]); // 8. SỬA: Đưa userId vào dependency

  useEffect(() => {
    if (history.length > 0 && history[selectedIndex]) {
      const currentCode = history[selectedIndex].src_code;
      if (currentCode) {
        setInitialCode(currentCode);
      }
    }
  }, [selectedIndex, history, setInitialCode]);

  return {
    history,
    isLoading,
    selectedIndex,
    setSelectedIndex,
    fetchHistory,
  };
}
