import { useEffect, useRef } from 'react';
import { useAudioStore } from '../../store/useAudioStore';

// Giả sử bạn đã bỏ file nhạc vào src/shared/Assets/audio/bg_music.mp3
import bgMusic from '@Assets/audio/bg_music.mp3';

export function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlaying = useAudioStore((state) => state.isPlaying);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Chuẩn UX: Nhạc nền chỉ nên để âm lượng nhỏ (khoảng 20-30%) để không làm phiền user
    audio.volume = 0.2;

    if (isPlaying) {
      // Bắt lỗi Promise để app không bị crash nếu trình duyệt chặn
      audio.play().catch((error) => {
        console.warn('Trình duyệt chặn Autoplay. Đợi user tương tác:', error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return (
    // Component tàng hình, loop=true để lặp lại vô hạn
    <audio ref={audioRef} src={bgMusic} loop className="hidden" />
  );
}
