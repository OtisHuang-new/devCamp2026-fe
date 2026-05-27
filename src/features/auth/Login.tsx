// src/features/auth/components/Login.tsx
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import google from './Assets/Google icon.svg';
import background from './Assets/backGround.jpg';

// THAY ĐỔI 2: Import useAuthContext để lấy state user
import { useAuthContext } from '../../shared/context/AuthContext';

import CloseButton from '../../shared/Buttons/CloseButton';

// Khai báo Props để điều khiển Overlay
interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

function Login({ isOpen, onClose, onSwitchToRegister }: LoginProps) {
  const { handleLogin, isLoading, error } = useAuth();

  const { user } = useAuthContext();

  // State quản lý input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // THAY ĐỔI 4: Lắng nghe nếu đăng nhập thành công (user có data) thì đóng Form
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  if (!isOpen) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    handleLogin({ email, password });
  };

  return (
    /* THAY ĐỔI: fixed inset-0 để phủ toàn màn hình, bg-black/15 cho nền tối 15%, z-[100] để đè lên Landing */
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex justify-center items-center p-4 font-sans animate-fadeIn"
      onClick={onClose} // Click ra ngoài sẽ đóng
    >
      {/* THAY ĐỔI: Thêm relative, và e.stopPropagation() để click vào form không bị đóng */}
      <div
        className="relative w-full max-w-4xl h-[620px] rounded-[8px] shadow-2xl overflow-hidden flex flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* THÊM MỚI: Nút CloseButton đặt ở góc phải trên cùng */}
        <div className="absolute top-4 right-4 z-50">
          <CloseButton onClick={onClose} />
        </div>

        <div className="w-3/5 h-full flex flex-col justify-center px-16 bg-white">
          <h2 className="text-3xl font-extrabold text-[#1E3A8A] mb-1">Đăng nhập</h2>
          <p className="text-gray-600 text-sm mb-6 font-medium">
            Chưa có tài khoản?{' '}
            <span
              onClick={onSwitchToRegister} // THAY ĐỔI Ở ĐÂY
              className="text-[#1E3A8A] font-bold underline cursor-pointer hover:opacity-80"
            >
              Đăng ký
            </span>
          </p>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-700 font-medium text-sm transition-all hover:bg-gray-50 active:scale-[0.99] mb-6">
            <img src={google} className="w-5 h-5" alt="Google icon" />
            <span>Đăng nhập bằng Google</span>
          </button>

          <div className="flex items-center my-2 mb-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs font-bold text-[#1E3A8A] tracking-wider">HOẶC</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* THAY ĐỔI: Username -> Email */}
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
              <label className="text-sm font-extrabold text-[#1E3A8A]">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400 placeholder:text-xs"
                required
              />
            </div>

            <div className="flex justify-between items-center -mt-1">
              {/* Hiển thị lỗi nếu có */}
              <span className="text-xs font-bold text-red-500">{error}</span>
              <span className="text-sm font-bold text-[#1E3A8A] underline cursor-pointer hover:opacity-80 ml-auto">
                Quên mật khẩu?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-lg font-bold text-sm mt-4 transition-all shadow-md 
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1E3A8A] hover:opacity-95 active:scale-[0.99] shadow-[#1E3A8A]/20'}
              `}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
        </div>

        <div
          className="w-2/5 bg-cover bg-center hidden md:block relative before:absolute before:inset-0 before:bg-[#1E3A8A]/60"
          style={{ backgroundImage: `url(${background})` }}
        ></div>
      </div>
    </div>
  );
}

export default Login;
