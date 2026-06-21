// Vị trí: src/shared/hooks/useOverlayClose.ts
import { useRef, useCallback } from 'react';

export function useOverlayClose(onClose: () => void) {
  // Dùng useRef để lưu trạng thái mousedown mà không làm component re-render
  const isMouseDownOnOverlay = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Chỉ cắm cờ true nếu người dùng bắt đầu nhấn chuột TRỰC TIẾP lên nền đen (Overlay)
    // e.target: Phần tử thực sự bị click (có thể là con)
    // e.currentTarget: Phần tử đang gắn sự kiện (chính là Overlay)
    if (e.target === e.currentTarget) {
      isMouseDownOnOverlay.current = true;
    } else {
      isMouseDownOnOverlay.current = false;
    }
  }, []);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Chỉ đóng form nếu ngón tay nhả ra trên nền đen VÀ trước đó ngón tay cũng nhấn xuống từ nền đen
      if (e.target === e.currentTarget && isMouseDownOnOverlay.current) {
        onClose();
      }
      // Reset cờ cho lần click tiếp theo
      isMouseDownOnOverlay.current = false;
    },
    [onClose],
  );

  return { handleMouseDown, handleMouseUp };
}
