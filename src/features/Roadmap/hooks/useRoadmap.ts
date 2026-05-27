import { useState, useEffect } from 'react';
import { roadmapApi } from '../api/roadmapApi';
import type { ChapterDataAPI } from '../types/roadmapTypes';
import type { PathNode } from '../Components/Chapter';

const ZIGZAG_TEMPLATES = [
  [
    'translate-x-[20px]',
    '-translate-x-[40px]',
    '-translate-x-[80px]',
    '-translate-x-[40px]',
    'translate-x-[20px]',
  ],
  [
    'translate-x-[20px]',
    'translate-x-[80px]',
    'translate-x-[120px]',
    'translate-x-[80px]',
    'translate-x-[20px]',
  ],
  [
    'translate-x-[20px]',
    '-translate-x-[40px]',
    '-translate-x-[80px]',
    '-translate-x-[40px]',
    'translate-x-[20px]',
  ],
];

export const useRoadmap = (currentLessonId?: string | null) => {
  // Thêm state rawData để lưu data gốc từ API
  const [rawData, setRawData] = useState<ChapterDataAPI[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chapters, setChapters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Effect này CHỈ chạy 1 lần để fetch data từ backend
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data = await roadmapApi.getRoadmap();
        setRawData(data);
      } catch (error) {
        console.error('Failed to fetch roadmap:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  // 2. Effect này sẽ chạy lại mỗi khi rawData hoặc currentLessonId thay đổi (sau khi F5 Auth load xong)
  useEffect(() => {
    if (rawData.length === 0) return;

    const allNodeIds: string[] = [];
    rawData.forEach((chap: ChapterDataAPI) => {
      chap.lessons.forEach((l) => allNodeIds.push(l._id));
      if (chap.project_detail) allNodeIds.push(chap.project_detail._id);
    });

    let currentIndex = currentLessonId ? allNodeIds.indexOf(currentLessonId) : 0;
    if (currentIndex === -1) currentIndex = 0;

    // --- BỔ SUNG: Tìm Index của Chapter chứa bài học hiện tại ---
    let currentChapterIndex = 0;
    if (currentLessonId) {
      const foundIndex = rawData.findIndex(
        (chap) =>
          chap.lessons.some((l) => l._id === currentLessonId) ||
          chap.project_detail?._id === currentLessonId,
      );
      if (foundIndex !== -1) currentChapterIndex = foundIndex;
    }
    // -----------------------------------------------------------

    const getNodeStatus = (id?: string) => {
      if (!id) return 'locked';
      const index = allNodeIds.indexOf(id);
      if (index === -1) return 'locked';
      if (index < currentIndex) return 'completed';
      if (index === currentIndex) return 'current';
      return 'locked';
    };

    const transformedChapters = rawData.map((chap: ChapterDataAPI, index: number) => {
      const layout = ZIGZAG_TEMPLATES[index % ZIGZAG_TEMPLATES.length];

      // --- THAY ĐỔI: Phân loại trạng thái rương theo Chapter ---
      let treasureStatus: 'completed' | 'current' | 'locked' = 'locked';
      if (index < currentChapterIndex)
        treasureStatus = 'completed'; // Chapter đã qua
      else if (index === currentChapterIndex)
        treasureStatus = 'current'; // Chapter hiện tại
      else treasureStatus = 'locked'; // Chapter chưa học tới
      // ---------------------------------------------------------

      const nodes: PathNode[] = [
        {
          id: chap.lessons[0]?._id,
          type: 'lesson',
          translateX: layout[0],
          title: chap.lessons[0]?.title,
          status: getNodeStatus(chap.lessons[0]?._id),
        },
        {
          id: chap.lessons[1]?._id,
          type: 'lesson',
          translateX: layout[1],
          title: chap.lessons[1]?.title,
          status: getNodeStatus(chap.lessons[1]?._id),
        },
        {
          id: `treasure-${chap._id}`,
          type: 'treasure',
          translateX: layout[2],
          status: treasureStatus,
        },
        {
          id: chap.lessons[2]?._id,
          type: 'lesson',
          translateX: layout[3],
          title: chap.lessons[2]?.title,
          status: getNodeStatus(chap.lessons[2]?._id),
        },
        {
          id: chap.project_detail?._id,
          type: 'project',
          translateX: layout[4],
          title: chap.project_detail?.title,
          status: getNodeStatus(chap.project_detail?._id),
        },
      ];

      return {
        id: chap._id,
        chapterNumber: index + 1,
        title: chap.title,
        nodes: nodes,
      };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChapters(transformedChapters);
  }, [rawData, currentLessonId]); // <-- Phụ thuộc vào currentLessonId

  return { chapters, isLoading };
};
