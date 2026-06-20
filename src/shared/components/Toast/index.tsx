import { useToastStore } from '../../store/useToastStore';
import { ToastItem } from './ToastItem';

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <>
      {/* Inject Keyframes chuẩn không cần sửa file tailwind.config */}
      <style>{`
        @keyframes toast-shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>

      {/* Neo vị trí bottom-center, flex-col giúp các toast tự động stack lên nhau */}
      <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  );
}
