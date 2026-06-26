// Vị trí: src/features/auth/Login.tsx
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useForgotPassword } from './hooks/useForgotPassword';
import background from './Assets/backGround.jpg';
import { useAuthContext_v2 } from '../../shared/context/hooks/useAuthContext_v2';
import CloseButton from '../../shared/components/Buttons/CloseButton';
import { useOverlayClose } from '@/shared/hooks/useOverlayClose';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

// 1. SENIOR FIX: Tách Component thành Wrapper.
// Khi !isOpen, LoginForm bị gỡ hoàn toàn khỏi DOM. Khi mở lại, mọi State sẽ sạch sẽ 100%.
export default function Login({ isOpen, onClose, onSwitchToRegister }: LoginProps) {
  if (!isOpen) return null;
  return <LoginForm onClose={onClose} onSwitchToRegister={onSwitchToRegister} />;
}

// 2. Component chứa nội dung Form và State nội bộ
function LoginForm({ onClose, onSwitchToRegister }: Omit<LoginProps, 'isOpen'>) {
  const { handleLogin, isLoading: isLoginLoading, error: loginError } = useAuth();

  const {
    handleForgotPassword,
    isLoading: isForgotLoading,
    error: forgotError,
    successMessage,
    resetStates,
  } = useForgotPassword();

  const { user } = useAuthContext_v2();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);

  const { handleMouseDown, handleMouseUp } = useOverlayClose(onClose);

  // 3. Tự động đóng modal nếu phát hiện đã có user đăng nhập
  // Vì LoginForm chỉ tồn tại khi isOpen = true, nên ta không cần check isOpen ở đây nữa
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  // 4. SENIOR FIX: ĐÃ XÓA BỎ HOÀN TOÀN useEffect CHỨA setState GÂY LỖI LINTER!

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgotMode) {
      if (!email) return;
      handleForgotPassword(email);
    } else {
      if (!email || !password) return;
      handleLogin({ email, password });
    }
  };

  const isLoading = isForgotMode ? isForgotLoading : isLoginLoading;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex justify-center items-center p-4 font-sans animate-fadeIn"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className="relative w-full max-w-4xl h-[620px] rounded-[8px] shadow-2xl overflow-hidden flex flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-50">
          <CloseButton onClick={onClose} />
        </div>

        <div className="w-3/5 h-full flex flex-col justify-center px-16 bg-white transition-all duration-300">
          {isForgotMode ? (
            // --- GIAO DIỆN QUÊN MẬT KHẨU ---
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-extrabold text-[#1E3A8A] mb-1">Find Your Account</h2>
              <p className="text-gray-600 text-sm mb-6 font-medium">Enter your email address</p>

              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-extrabold text-[#1E3A8A]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="min-h-[20px] -mt-1">
                  {forgotError && (
                    <span className="text-xs font-bold text-red-500">{forgotError}</span>
                  )}
                  {successMessage && (
                    <span className="text-xs font-bold text-[#22C55E]">{successMessage}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white py-3 rounded-lg font-bold text-sm mt-2 transition-all shadow-md 
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1E3A8A] hover:opacity-95 active:scale-[0.99] shadow-[#1E3A8A]/20'}
                  `}
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>

                <div className="flex justify-center mt-2">
                  <span
                    onClick={() => {
                      // 5. Sự kiện onClick thì lại ĐƯỢC PHÉP gọi setState thoải mái mà không bị lỗi
                      setIsForgotMode(false);
                      resetStates();
                    }}
                    className="text-sm font-bold text-gray-500 underline cursor-pointer hover:text-[#1E3A8A] transition-colors"
                  >
                    Back to login
                  </span>
                </div>
              </form>
            </div>
          ) : (
            // --- GIAO DIỆN ĐĂNG NHẬP (Bình thường) ---
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-extrabold text-[#1E3A8A] mb-1">Login</h2>
              <p className="text-gray-600 text-sm mb-6 font-medium">
                Haven't had any account yet?{' '}
                <span
                  onClick={onSwitchToRegister}
                  className="text-[#1E3A8A] font-bold underline cursor-pointer hover:opacity-80"
                >
                  Resgister here
                </span>
              </p>

              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-extrabold text-[#1E3A8A]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400 placeholder:text-xs"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-sm font-extrabold text-[#1E3A8A]">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 character..."
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400 placeholder:text-xs"
                    required
                  />
                </div>

                <div className="flex justify-between items-center -mt-1">
                  <span className="text-xs font-bold text-red-500">{loginError}</span>
                  <span
                    onClick={() => setIsForgotMode(true)}
                    className="text-sm font-bold text-[#1E3A8A] underline cursor-pointer hover:opacity-80 ml-auto"
                  >
                    Forget your password?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white py-3 rounded-lg font-bold text-sm mt-4 transition-all shadow-md 
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1E3A8A] hover:opacity-95 active:scale-[0.99] shadow-[#1E3A8A]/20'}
                  `}
                >
                  {isLoading ? 'Loading...' : 'Login'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div
          className="w-2/5 bg-cover bg-center hidden md:block relative before:absolute before:inset-0 before:bg-[#1E3A8A]/60"
          style={{ backgroundImage: `url(${background})` }}
        ></div>
      </div>
    </div>
  );
}
