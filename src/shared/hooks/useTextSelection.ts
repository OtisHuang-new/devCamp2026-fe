// Vị trí: src/shared/hooks/useTextSelection.ts
import { useState, useEffect } from 'react';

interface SelectionState {
  text: string;
  x: number;
  y: number;
  isVisible: boolean;
  isDragging: boolean; // 1. SENIOR FIX: Báo cho UI biết chuột đang được giữ
}

export function useTextSelection() {
  const [selection, setSelection] = useState<SelectionState>({
    text: '',
    x: 0,
    y: 0,
    isVisible: false,
    isDragging: false,
  });

  useEffect(() => {
    let ticking = false;

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('#ai-text-popover')) return;
      // Kích hoạt cờ đang kéo chuột
      setSelection((prev) => ({ ...prev, isDragging: true }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('#ai-text-popover')) return;
      // Nhả chuột ra
      setSelection((prev) => ({ ...prev, isDragging: false }));
      // Chốt tọa độ lần cuối cùng cho chuẩn xác
      setTimeout(calculatePosition, 0);
    };

    const calculatePosition = () => {
      const activeSelection = window.getSelection();

      if (!activeSelection || activeSelection.isCollapsed || activeSelection.rangeCount === 0) {
        setSelection((prev) => (prev.isVisible ? { ...prev, isVisible: false, text: '' } : prev));
        return;
      }

      const text = activeSelection.toString().trim();
      if (!text) {
        setSelection((prev) => (prev.isVisible ? { ...prev, isVisible: false, text: '' } : prev));
        return;
      }

      const range = activeSelection.getRangeAt(0);
      const rects = range.getClientRects();
      if (rects.length === 0) return;

      let isBackwards = false;
      const anchorNode = activeSelection.anchorNode;
      const focusNode = activeSelection.focusNode;

      if (anchorNode && focusNode) {
        const position = anchorNode.compareDocumentPosition(focusNode);
        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          isBackwards = true;
        } else if (position === 0 && activeSelection.anchorOffset > activeSelection.focusOffset) {
          isBackwards = true;
        }
      }

      const targetRect = isBackwards ? rects[0] : rects[rects.length - 1];
      if (targetRect.width === 0 && targetRect.height === 0) return;

      const popoverWidth = 120;
      const popoverHeight = 40;
      const SPACE_Y = 0;
      const SPACE_X = 5;

      let safeX;
      let safeY;

      if (isBackwards) {
        safeY = targetRect.top - popoverHeight - SPACE_Y;
        if (safeY < 10) safeY = targetRect.bottom + SPACE_Y;
        safeX = targetRect.left - popoverWidth + 90;
      } else {
        safeY = targetRect.bottom + SPACE_Y;
        if (safeY + popoverHeight > window.innerHeight - 10) {
          safeY = targetRect.top - popoverHeight - SPACE_Y;
        }
        safeX = targetRect.right + SPACE_X;
      }

      if (safeX < 10) safeX = 10;
      if (safeX + popoverWidth > window.innerWidth - 10) {
        safeX = window.innerWidth - popoverWidth - 10;
      }

      // 2. SENIOR FIX: Cập nhật thông tin liên tục mà vẫn giữ nguyên cờ isDragging
      setSelection((prev) => ({
        ...prev,
        text,
        x: safeX,
        y: safeY,
        isVisible: true,
      }));
    };

    const handleSelectionChange = () => {
      // Cho phép tính toán liên tục khi đang kéo bôi đen
      setTimeout(calculatePosition, 0);
    };

    const handleScroll = () => {
      // Cho phép tính toán liên tục khi kéo thanh cuộn
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculatePosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return selection;
}
