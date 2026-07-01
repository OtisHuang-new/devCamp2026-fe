// Vị trí: src/shared/utils/scrollUtils.ts

export const smoothScrollTo = (
  container: HTMLElement,
  targetScrollTop: number,
  duration: number = 1000,
) => {
  const startScrollTop = container.scrollTop;
  const distance = targetScrollTop - startScrollTop;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Easing Function: Khởi đầu nhanh, chậm dần ở cuối
    const easeInOut =
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    container.scrollTop = startScrollTop + distance * easeInOut;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

export const scrollToElement = (
  element: HTMLElement,
  position: 'top' | 'center' | 'bottom' = 'center',
  duration: number = 1000,
) => {
  const scrollContainer = element.closest('.overflow-y-auto') as HTMLElement;
  const blockPosition: ScrollLogicalPosition =
    position === 'top' ? 'start' : position === 'bottom' ? 'end' : 'center';

  if (!scrollContainer) {
    // Fallback an toàn nếu cấu trúc DOM không có class overflow-y-auto
    element.scrollIntoView({ behavior: 'smooth', block: blockPosition });
    return;
  }

  const elementRect = element.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();

  let targetScrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top);

  if (position === 'center') {
    targetScrollTop -= containerRect.height / 2 - elementRect.height / 2;
  } else if (position === 'bottom') {
    targetScrollTop -= containerRect.height - elementRect.height;
  } else if (position === 'top') {
    targetScrollTop -= 24; // Trừ hao 24px lề trên cho thoáng mắt, không bị dính sát viền màn hình
  }

  smoothScrollTo(scrollContainer, targetScrollTop, duration);
};
