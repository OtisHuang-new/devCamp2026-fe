import { create } from 'zustand';

export type ToastPosition = 'bottom-center' | 'bottom-left' | 'top-center';

export interface ToastMessage {
  id: string;
  text: string;
  duration: number;
  isWarning?: boolean;
  position?: ToastPosition;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (
    text: string,
    duration?: number,
    isWarning?: boolean,
    position?: ToastPosition,
  ) => void;
  removeToast: (id: string) => void;
}

export function useToastStoreBase() {
  // Tách pure function store definition
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (text, duration = 3000, isWarning = false, position = 'bottom-center') =>
    set((state) => ({
      // Đẩy toast mới vào mảng với ID duy nhất
      toasts: [
        ...state.toasts,
        { id: `${Date.now()}-${Math.random()}`, text, duration, isWarning, position },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
