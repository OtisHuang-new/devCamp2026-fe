// Import type từ Chapter component để đảm bảo tính đồng nhất
import type { PathNode } from './Components/Chapter';

export interface ChapterData {
  id: number; // Dùng làm chapterNumber luôn
  title: string;
  nodes: PathNode[];
}

export const mockRoadmapData: ChapterData[] = [
  {
    id: 1,
    title: 'Get Familiar with Python',
    nodes: [
      { id: 'c1-l1', type: 'lesson', translateX: 'translate-x-[20px]' },
      { id: 'c1-l2', type: 'lesson', translateX: '-translate-x-[40px]' },
      { id: 'c1-t1', type: 'treasure', translateX: '-translate-x-[80px]' },
      { id: 'c1-l3', type: 'lesson', translateX: '-translate-x-[40px]' },
      { id: 'c1-p1', type: 'project', translateX: 'translate-x-[20px]' },
    ],
  },
  {
    id: 2,
    title: 'Data Types & Variables',
    nodes: [
      // Đổi kiểu zigzag khác một chút cho sinh động
      { id: 'c2-l1', type: 'lesson', translateX: 'translate-x-[20px]' },
      { id: 'c2-l2', type: 'lesson', translateX: 'translate-x-[80px]' },
      { id: 'c2-t1', type: 'treasure', translateX: 'translate-x-[120px]' },
      { id: 'c2-l3', type: 'lesson', translateX: 'translate-x-[80px]' },
      { id: 'c2-p1', type: 'project', translateX: 'translate-x-[20px]' },
    ],
  },
  {
    id: 3,
    title: 'Control Flows & Loops',
    nodes: [
      // Thêm một cái rương kho báu vào giữa để bạn thấy tính flexible
      { id: 'c3-l1', type: 'lesson', translateX: 'translate-x-[20px]' },
      { id: 'c3-l2', type: 'lesson', translateX: '-translate-x-[40px]' },
      { id: 'c3-t1', type: 'treasure', translateX: '-translate-x-[80px]' },
      { id: 'c3-l3', type: 'lesson', translateX: '-translate-x-[40px]' },
      { id: 'c3-p1', type: 'project', translateX: 'translate-x-[20px]' },
    ],
  },
];
