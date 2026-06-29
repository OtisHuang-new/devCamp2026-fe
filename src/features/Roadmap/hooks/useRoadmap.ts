// Vị trí: src/features/Roadmap/hooks/useRoadmap.ts
import { useState, useEffect } from 'react';
import { roadmapApi } from '../api/roadmapApi';
import type { ChapterDataAPI, TransformedChapter, ThemeColor } from '../types/roadmapTypes';
import type { PathNode } from '../Components/Chapter';

import bot_pointhaha from '../../../shared/Assets/Mascots/bot_pointhaha.svg';
import bot_like from '../../../shared/Assets/Mascots/bot_like.svg';
import bot_yay from '../../../shared/Assets/Mascots/bot_yay.svg';

const CHAPTER_THEMES: ThemeColor[] = [
  { bg: 'bg-[#58CC02]', shadow: 'bg-[#46A302]' }, // 5. Xanh lá (Duolingo)
  { bg: 'bg-primary', shadow: 'bg-[#051338]' }, // 1. Default
  { bg: 'bg-[#00CD9C]', shadow: 'bg-[#009974]' }, // 3. Xanh ngọc
  { bg: 'bg-[#CE82FF]', shadow: 'bg-[#A65BDB]' }, // 2. Tím
  { bg: 'bg-[#FF9600]', shadow: 'bg-[#CC7800]' }, // 4. Cam
];

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

    const getNodeStatus = (id?: string) => {
      if (!id) return 'locked';
      const index = allNodeIds.indexOf(id);
      if (index === -1) return 'locked';
      if (index < currentIndex) return 'completed';
      if (index === currentIndex) return 'current';
      return 'locked';
    };

    let globalNodeIndex = 0;
    let mascotIndex = 0;

    const MASCOTS = [
      { src: bot_pointhaha, size: 200 },
      { src: bot_like, size: 90 },
      { src: bot_yay, size: 80 },
    ];

    const transformedChapters = rawData.map((chap: ChapterDataAPI, index: number) => {
      const nodes: PathNode[] = [];

      // 3. SENIOR FIX: Helper function để xử lý Zig-zag (Tránh lặp code DRY)
      const addZigZagNode = (id: string, type: 'lesson' | 'project', title: string) => {
        const step = globalNodeIndex % 8;
        let translateX = 'translate-x-[0px]';
        let mascot: PathNode['mascot'] = undefined;

        if (step === 0 || step === 4) {
          translateX = 'translate-x-[0px]';
        } else if (step === 1 || step === 3) {
          translateX = '-translate-x-[45px]';
        } else if (step === 2) {
          translateX = '-translate-x-[80px]';

          // 2. SENIOR FIX: Lấy object mascot và truyền cả sizeClass vào
          const currentMascot = MASCOTS[mascotIndex % MASCOTS.length];
          mascot = { src: currentMascot.src, position: 'right', size: currentMascot.size };
          mascotIndex++;
        } else if (step === 5 || step === 7) {
          translateX = 'translate-x-[45px]';
        } else if (step === 6) {
          translateX = 'translate-x-[80px]';

          // 3. SENIOR FIX: Tương tự cho góc cua phải
          const currentMascot = MASCOTS[mascotIndex % MASCOTS.length];
          mascot = { src: currentMascot.src, position: 'left', size: currentMascot.size };
          mascotIndex++;
        }

        nodes.push({
          id,
          type,
          translateX,
          title,
          status: getNodeStatus(id),
          mascot,
        });

        globalNodeIndex++;
      };

      // Đưa Lessons vào mảng
      chap.lessons.forEach((lesson) => {
        addZigZagNode(lesson._id, 'lesson', lesson.title);
      });

      // Đưa Project vào mảng (nối tiếp ngay sau)
      if (chap.project_detail) {
        addZigZagNode(chap.project_detail._id, 'project', chap.project_detail.title);
      }

      return {
        id: chap._id,
        chapterNumber: index + 1,
        title: chap.title,
        nodes: nodes,
        theme: CHAPTER_THEMES[index % 5],
      };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChapters(transformedChapters);
  }, [rawData, currentLessonId]);

  return { chapters, rawData, isLoading };
};
