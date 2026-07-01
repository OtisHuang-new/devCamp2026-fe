// Vị trí: src/shared/components/Toast/index.tsx
import { useToastStore } from '../../store/useToastStore';
import { ToastItem } from './ToastItem';

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  // 1. SENIOR FIX: Tách 2 luồng render độc lập dựa theo position
  // Use String(...) to avoid strict type comparisons when position may be undefined
  const centerToasts = toasts.filter((t) => String(t.position) === 'bottom-center' || !t.position);
  const leftToasts = toasts.filter((t) => String(t.position) === 'bottom-left');
  const topCenterToasts = toasts.filter((t) => String(t.position) === 'top-center');

  return (
    <>
      <style>{`
        @keyframes toast-shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>

      {/* VÙNG 1: BOTTOM CENTER (Mặc định cho các Toast cũ) */}
      {centerToasts.length > 0 && (
        <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
          {centerToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </div>
      )}

      {/* VÙNG 2: BOTTOM LEFT (MỚI: Nằm gọn góc trái, tránh che Editor) */}
      {leftToasts.length > 0 && (
        <div className="fixed bottom-[30px] left-[30px] z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
          {leftToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </div>
      )}

      {/* 2. SENIOR FIX: VÙNG 3: TOP CENTER */}
      {topCenterToasts.length > 0 && (
        <div className="fixed top-[30px] left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
          {topCenterToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </div>
      )}
    </>
  );
}
