import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import background from './Assets/backGround.jpg';
import { useAuthContext_v2 } from '../../shared/context/hooks/useAuthContext_v2';
import CloseButton from '../../shared/components/Buttons/CloseButton';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function Login({ isOpen, onClose, onSwitchToRegister }: LoginProps) {
  const { handleLogin, isLoading, error } = useAuth();

  const { user } = useAuthContext_v2();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex justify-center items-center p-4 font-sans animate-fadeIn"
      onClick={onClose} // Click ra ngoài sẽ đóng
    >
      <div
        className="relative w-full max-w-4xl h-[620px] rounded-[8px] shadow-2xl overflow-hidden flex flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-50">
          <CloseButton onClick={onClose} />
        </div>

        <div className="w-3/5 h-full flex flex-col justify-center px-16 bg-white">
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
              <span className="text-xs font-bold text-red-500">{error}</span>
              <span className="text-sm font-bold text-[#1E3A8A] underline cursor-pointer hover:opacity-80 ml-auto">
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

        <div
          className="w-2/5 bg-cover bg-center hidden md:block relative before:absolute before:inset-0 before:bg-[#1E3A8A]/60"
          style={{ backgroundImage: `url(${background})` }}
        ></div>
      </div>
    </div>
  );
}
