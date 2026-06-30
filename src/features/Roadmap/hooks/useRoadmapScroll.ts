import { useEffect, useState, useRef, useCallback } from 'react';
import { smoothScrollTo } from '@/shared/utils/scrollUtils';

export function useRoadmapScroll(mainChaptersLength: number, currentLessonId?: string | null) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToCurrent = useRef(false);

  // 1. Cuộn đến bài học hiện tại (Dùng container mới)
  useEffect(() => {
    if (mainChaptersLength > 0 && currentLessonId && !hasScrolledToCurrent.current) {
      const targetNode = document.getElementById(`roadmap-node-${currentLessonId}`);
      if (targetNode) {
        targetNode.scrollIntoView({ behavior: 'auto', block: 'center' });
        hasScrolledToCurrent.current = true;
      }
    }
  }, [mainChaptersLength, currentLessonId]);

  // 2. Logic tính toán Active Chapter
  const handleScroll = useCallback(() => {
    const container = document.getElementById('main-scroll-container');
    if (!headerRef.current || mainChaptersLength === 0 || !container) return;

    setShowScrollTop(container.scrollTop > 50);
    const headerBottom = headerRef.current.getBoundingClientRect().bottom;

    // 3. SENIOR FIX: Tìm tất cả các vạch phân cách thay vì tìm Project
    const dividerNodes = document.querySelectorAll('[data-chapter-divider]');
    let currentIndex = 0;

    for (let i = 0; i < dividerNodes.length; i++) {
      const node = dividerNodes[i];
      const rect = node.getBoundingClientRect();

      // 4. SENIOR FIX: Điều kiện cuộn + Threshold 20px
      // Nếu mép dưới của Header chạm gần tới (cách 20px) đỉnh của vạch phân cách, ta kích hoạt đổi Chapter
      if (headerBottom + 20 >= rect.top) {
        if (i + 1 < mainChaptersLength) currentIndex = i + 1;
      }
    }

    setActiveChapterIndex((prev) => (prev !== currentIndex ? currentIndex : prev));
  }, [mainChaptersLength]);

  // 3. Lắng nghe sự kiện Cuộn (Xử lý Pure Function & Strict Mode)
  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (!container) return;

    // Gắn listener
    container.addEventListener('scroll', handleScroll);

    // Cleanup - Gỡ listener khi unmount (Ngăn Memory Leak & Double fire ở StrictMode)
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // 4. Hàm cuộn lên đầu trang
  const scrollToTop = useCallback(() => {
    const container = document.getElementById('main-scroll-container');
    if (container) {
      smoothScrollTo(container, 0, 300); // 2. SỬ DỤNG ENGINE (Trượt 800ms)
    }
  }, []);

  return { headerRef, activeChapterIndex, showScrollTop, scrollToTop };
}
