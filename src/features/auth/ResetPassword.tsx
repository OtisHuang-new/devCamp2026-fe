// Vị trí: src/features/auth/ResetPassword.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import background from './Assets/backGround.jpg';
import { useResetPassword } from './hooks/useResetPassword';

export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const { handleResetPassword, isLoading, error, setError } = useResetPassword(token);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend Validation bổ sung chống giật lag API
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }

    handleResetPassword({ password, confirmPassword });
  };

  return (
    // Xóa fixed inset-0, biến nó thành Container trải dài Full Màn Hình
    <div className="min-h-screen w-full bg-gray-50 flex justify-center items-center p-4 font-sans animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[620px] rounded-[8px] shadow-2xl overflow-hidden flex flex-row bg-white">
        {/* Khối Form (60%) */}
        <div className="w-3/5 h-full flex flex-col justify-center px-16">
          <h2 className="text-3xl font-extrabold text-[#1E3A8A] mb-8">Creat new password</h2>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-extrabold text-[#1E3A8A]">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400"
                required
                minLength={8}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-extrabold text-[#1E3A8A]">Confirm your password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type your password again"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400"
                required
                minLength={8}
              />
            </div>

            <div className="min-h-[20px] -mt-1">
              {error && <span className="text-xs font-bold text-red-500">{error}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-lg font-bold text-sm mt-4 transition-all shadow-md
                 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1E3A8A] hover:opacity-95 active:scale-[0.99] shadow-[#1E3A8A]/20'}
              `}
            >
              {isLoading ? 'Loading...' : 'Reset password'}
            </button>
          </form>
        </div>

        {/* Khối Banner Hình Ảnh (40%) */}
        <div
          className="w-2/5 bg-cover bg-center hidden md:block relative before:absolute before:inset-0 before:bg-[#1E3A8A]/60"
          style={{ backgroundImage: `url(${background})` }}
        ></div>
      </div>
    </div>
  );
}
