// Vị trí: src/features/Roadmap/hooks/useRoadmap.ts
import { useState, useEffect } from 'react';
import { roadmapApi } from '../api/roadmapApi';
import type { ChapterDataAPI, TransformedChapter } from '../types/roadmapTypes';
import type { PathNode } from '../Components/Chapter';

let pendingRoadmapRequest: Promise<ChapterDataAPI[]> | null = null;
// 5. Khai báo hằng số Cache Key
const CACHE_KEY = 'roadmap_data_cache';

// 6. SENIOR FIX: Nâng cấp hàm Core Fetcher kết hợp Cache-First và Deduping Request
const fetchRoadmapDeduped = async (): Promise<ChapterDataAPI[]> => {
  // Bước 1: Check Cache (0ms latency). Nếu có thì ép kiểu và trả về ngay.
  const cachedData = sessionStorage.getItem(CACHE_KEY);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Bước 2: Check Deduping (Nếu API đang gọi dở thì dùng chung Promise)
  if (pendingRoadmapRequest) return pendingRoadmapRequest;

  // Bước 3: Tiến hành gọi API thực tế
  pendingRoadmapRequest = (async () => {
    try {
      const response = await roadmapApi.getRoadmap();
      // Lưu vào sessionStorage để các lần render/reload trang sau được dùng luôn
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(response));
      return response;
    } finally {
      // Dọn dẹp cờ Deduping sau khi hoàn tất
      pendingRoadmapRequest = null;
    }
  })();

  return pendingRoadmapRequest;
};

export const useRoadmap = (currentLessonId?: string | null) => {
  const [rawData, setRawData] = useState<ChapterDataAPI[]>([]);

  const [chapters, setChapters] = useState<TransformedChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // --- 2. CỜ isMounted ---

    const fetchRoadmap = async () => {
      try {
        // --- 3. GỌI QUA HÀM DEDUPED ---
        const data = await fetchRoadmapDeduped();

        if (isMounted) setRawData(data); // Chỉ set khi component còn sống
      } catch (error) {
        if (isMounted) console.error('Failed to fetch roadmap:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRoadmap();

    // --- 4. CLEANUP COMPONENT ---
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (rawData.length === 0) return;

    const allNodeIds: string[] = [];
    rawData.forEach((chap: ChapterDataAPI) => {
      chap.lessons.forEach((l) => allNodeIds.push(l._id));
      if (chap.project_detail) allNodeIds.push(chap.project_detail._id);
    });

    let currentIndex = currentLessonId ? allNodeIds.indexOf(currentLessonId) : 0;
    if (currentIndex === -1) currentIndex = 0;

    let currentChapterIndex = 0;
    if (currentLessonId) {
      const foundIndex = rawData.findIndex(
        (chap) =>
          chap.lessons.some((l) => l._id === currentLessonId) ||
          chap.project_detail?._id === currentLessonId,
      );
      if (foundIndex !== -1) currentChapterIndex = foundIndex;
    }

    const getNodeStatus = (id?: string) => {
      if (!id) return 'locked';
      const index = allNodeIds.indexOf(id);
      if (index === -1) return 'locked';
      if (index < currentIndex) return 'completed';
      if (index === currentIndex) return 'current';
      return 'locked';
    };

    const transformedChapters = rawData.map((chap: ChapterDataAPI, index: number) => {
      let treasureStatus: 'completed' | 'current' | 'locked' = 'locked';
      if (index < currentChapterIndex)
        treasureStatus = 'completed'; // Chapter đã qua
      else if (index === currentChapterIndex)
        treasureStatus = 'current'; // Chapter hiện tại
      else treasureStatus = 'locked'; // Chapter chưa học tới

      const nodes: PathNode[] = [];

      chap.lessons.forEach((lesson, i) => {
        // A. Thêm Node Lesson
        nodes.push({
          id: lesson._id,
          type: 'lesson',
          translateX: 'translate-x-[0px]', // Thống nhất 1 tọa độ thẳng tắp
          title: lesson.title,
          status: getNodeStatus(lesson._id),
        });

        if ((i + 1) % 2 === 0 || chap.lessons.length === 1) {
          nodes.push({
            id: `treasure-${chap._id}-${i}`, // ID duy nhất cho rương
            type: 'treasure',
            translateX: 'translate-x-[0px]',
            status: treasureStatus,
          });
        }
      });

      if (chap.project_detail) {
        nodes.push({
          id: chap.project_detail._id,
          type: 'project',
          translateX: 'translate-x-[0px]',
          title: chap.project_detail.title,
          status: getNodeStatus(chap.project_detail._id),
        });
      }

      return {
        id: chap._id,
        chapterNumber: index + 1,
        title: chap.title,
        nodes: nodes,
      };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChapters(transformedChapters);
  }, [rawData, currentLessonId]);

  return { chapters, rawData, isLoading };
};
