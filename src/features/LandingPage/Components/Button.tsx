// 1. Import hook để điều hướng trang
import { useNavigate } from 'react-router-dom';

// 5. THÊM MỚI Ở ĐÂY: Khai báo interface cho Props
interface ButtonProps {
  onOpenLogin: () => void;
}
function Button({ onOpenLogin }: ButtonProps) {
  // 2. Khởi tạo hàm navigate
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      {/* Nút 1: Start now - Chuyển hướng ngay lập tức sang /register */}
      <button
        onClick={() => navigate('/survey')}
        className="bg-white text-primary px-10 py-2 flex justify-center items-center drop-shadow-[0_0_3px_#ffffff] rounded-[4px] font-bold transition-all hover:scale-105 active:scale-95"
      >
        Start now !
      </button>

      {/* Nút 2: Login - Chuyển hướng ngay lập tức sang /login */}
      <button
        onClick={onOpenLogin}
        className="bg-primary border border-white/40 px-10 py-2 text-white flex justify-center items-center drop-shadow-[0_0_2px_#ffffff] rounded-[4px] font-medium transition-all hover:bg-[#081A4F] active:scale-95"
      >
        I Already have an account
      </button>
    </div>
  );
}

export default Button;
