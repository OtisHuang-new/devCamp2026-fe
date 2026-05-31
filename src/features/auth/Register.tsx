import google from './Assets/Google icon.svg';
import background from './Assets/backGround.jpg';
// Nếu bạn đã cài react-router-dom, import thêm hook để chuyển trang nhanh
import { useAuth } from './hooks/useAuth';
// THAY ĐỔI 5: Bổ sung import useEffect và useAuthContext
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../shared/context/AuthContext';

import CloseButton from '../../shared/Buttons/CloseButton';

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

function Register({ isOpen, onClose, onSwitchToLogin }: RegisterProps) {
  const { handleRegister, isLoading, error } = useAuth();

  // THAY ĐỔI 6: Lấy user từ AuthContext
  const { user } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // THAY ĐỔI 7: Lắng nghe đăng ký thành công (user có data) thì đóng Form
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  if (!isOpen) return null; // THÊM DÒNG NÀY

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Mật khẩu nhập lại không khớp!');
      return;
    }

    // Lấy thông tin từ Survey đã lưu ở Local Storage (Nếu chưa làm survey thì để mặc định)
    const surveyJob = localStorage.getItem('survey_job') || 'Student';
    const surveyLevel = Number(localStorage.getItem('survey_level')) || 1;

    handleRegister({
      email,
      password,
      information: {
        job: surveyJob,
        level: surveyLevel,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex justify-center items-center p-4 font-sans animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[620px] rounded-[8px] shadow-2xl overflow-hidden flex flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút CloseButton */}
        <div className="absolute top-4 right-4 z-50">
          <CloseButton onClick={onClose} />
        </div>

        <div className="w-3/5 h-full flex flex-col justify-center px-16 bg-white">
          <h2 className="text-3xl font-extrabold text-[#1E3A8A] mb-1">Creat new account</h2>
          <p className="text-gray-600 text-sm mb-6 font-medium">
            You have account before?{' '}
            <span
              onClick={onSwitchToLogin} // THAY ĐỔI Ở ĐÂY
              className="text-[#1E3A8A] font-bold underline cursor-pointer hover:opacity-80"
            >
              Login now
            </span>
          </p>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-700 font-medium text-sm transition-all hover:bg-gray-50 active:scale-[0.99] mb-6">
            <img src={google} className="w-5 h-5" alt="Google icon" />
            <span>Loggin using Google account</span>
          </button>

          <div className="flex items-center my-2 mb-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs font-bold text-[#1E3A8A] tracking-wider">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-extrabold text-[#1E3A8A]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 character..."
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400 placeholder:text-xs"
                required
                minLength={8}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-extrabold text-[#1E3A8A]">Type again password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="type again your passowrd"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400 placeholder:text-xs"
                required
              />
            </div>

            {/* Vùng hiển thị lỗi */}
            <div className="min-h-[20px]">
              <span className="text-xs font-bold text-red-500">{validationError || error}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-lg font-bold text-sm transition-all shadow-md
                 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1E3A8A] hover:opacity-95 active:scale-[0.99] shadow-[#1E3A8A]/20'}
              `}
            >
              {isLoading ? 'Loading...' : 'Register'}
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

export default Register;
