import { useEffect, useState, useRef, useCallback } from 'react';

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
    const projectNodes = document.querySelectorAll('[data-project-marker]');
    let currentIndex = 0;

    for (let i = 0; i < projectNodes.length; i++) {
      const node = projectNodes[i];
      const rect = node.getBoundingClientRect();
      if (headerBottom >= rect.top + rect.height * 0.8) {
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
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { headerRef, activeChapterIndex, showScrollTop, scrollToTop };
}
