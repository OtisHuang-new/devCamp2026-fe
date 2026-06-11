import { create } from 'zustand';

interface ModalState {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isLoginOpen: false,
  isRegisterOpen: false,
  openLogin: () => set({ isLoginOpen: true, isRegisterOpen: false }),
  closeLogin: () => set({ isLoginOpen: false }),
  openRegister: () => set({ isRegisterOpen: true, isLoginOpen: false }),
  closeRegister: () => set({ isRegisterOpen: false }),
  switchToRegister: () => set({ isLoginOpen: false, isRegisterOpen: true }),
  switchToLogin: () => set({ isLoginOpen: true, isRegisterOpen: false }),
}));
