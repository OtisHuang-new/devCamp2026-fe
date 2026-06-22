import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  text: string;
  duration: number;
  isWarning?: boolean;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (text: string, duration?: number, isWarning?: boolean) => void;
  removeToast: (id: string) => void;
}

export function useToastStoreBase() {
  // Tách pure function store definition
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (text, duration = 3000, isWarning = false) =>
    set((state) => ({
      // Đẩy toast mới vào mảng với ID duy nhất
      toasts: [
        ...state.toasts,
        { id: `${Date.now()}-${Math.random()}`, text, duration, isWarning },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
