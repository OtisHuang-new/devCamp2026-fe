// Vị trí: src/shared/utils/navigationUtils.ts

// Định nghĩa các Type cục bộ (Decoupling - Không phụ thuộc vào type của Roadmap để tránh Circular Dependency)
interface CacheLesson {
  _id: string;
}

interface CacheProject {
  _id: string;
}

interface CacheChapter {
  lessons?: CacheLesson[];
  project_detail?: CacheProject;
}

export interface NextStepInfo {
  id: string;
  type: 'lesson' | 'project';
}

export function getNextStepInfo(currentNodeId: string | undefined): NextStepInfo | null {
  if (!currentNodeId) return null;

  // Lấy dữ liệu Sơ đồ học tập từ Cache đã được lưu lúc ở màn Roadmap
  const cachedData = sessionStorage.getItem('roadmap_data_cache');
  if (!cachedData) return null;

  try {
    const rawData = JSON.parse(cachedData) as CacheChapter[];
    const allNodes: NextStepInfo[] = [];

    // Duỗi phẳng (Flatten) Sơ đồ: Lesson -> Lesson -> Project
    rawData.forEach((chap) => {
      if (chap.lessons && Array.isArray(chap.lessons)) {
        chap.lessons.forEach((l) => {
          if (l._id) {
            allNodes.push({ id: l._id, type: 'lesson' });
          }
        });
      }
      if (chap.project_detail && chap.project_detail._id) {
        allNodes.push({ id: chap.project_detail._id, type: 'project' });
      }
    });

    // Truy tìm vị trí bài học hiện tại trong Sơ đồ
    const currentIndex = allNodes.findIndex((node) => node.id === currentNodeId);

    // Nếu tìm thấy và vẫn còn bài học kế tiếp -> Trả về tọa độ trạm tiếp theo
    if (currentIndex !== -1 && currentIndex < allNodes.length - 1) {
      return allNodes[currentIndex + 1];
    }

    // Đã chạm đến bài cuối cùng của khoá học
    return null;
  } catch (error: unknown) {
    console.error('Failed to parse roadmap cache', error);
    return null;
  }
}
