import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext'; // Nhúng context để gọi hàm logout

// Import các icon từ thư mục shared/Assets (điều chỉnh đường dẫn ../Assets/ cho đúng với cấu trúc của bạn)
import icon_expand_more from '../Assets/icon_expand_more.svg';
import icon_profile_prime from '../Assets/icon_profile_prime.svg';
import round_user_icon_prime from './Assets/round_user_icon_prime.svg';
import power_icon from '../Assets/power.svg';

interface UserProfileCardProps {
  userName: string;
}

function UserProfileCard({ userName }: UserProfileCardProps) {
  // 1. Khai báo state quản lý trạng thái đóng/mở của Dropdown
  const [isOpen, setIsOpen] = useState(false);

  // 2. Lấy hàm logoutState từ context
  const { logoutState } = useAuthContext();

  // 3. Hàm xử lý khi bấm Đăng xuất
  const handleLogout = () => {
    logoutState(); // Xóa local storage, set user = null
    setIsOpen(false); // Đóng dropdown
    // Lưu ý: Sau khi user = null, component cha (Roadmap) sẽ tự động re-render
    // và chúng ta sẽ xử lý việc thay thế bằng 2 nút Login/Sign up ở Phần 2.
  };

  return (
    <div className="relative">
      {/* --- KHỐI THÔNG TIN USER (NÚT BẤM ĐỂ MỞ DROPDOWN) --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row items-center justify-between gap-3 bg-white border border-solid border-primary rounded-full pr-3 py-0.5 pl-0.5 w-fit mt-1.5 cursor-pointer hover:bg-gray-50 transition-all duration-200"
      >
        <div className="flex flex-row items-center gap-2">
          <img src={round_user_icon_prime} alt="User Avatar" className="w-10 h-10 object-contain" />
          <span className="text-slate-800 font-bold text-[20px] whitespace-nowrap">{userName}</span>
        </div>

        {/* Thêm Icon Expand More (Mũi tên), xoay 180 độ khi mở */}
        <img
          src={icon_expand_more}
          alt="Expand"
          className={`w-5 h-5 transition-transform duration-300 opacity-70 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* --- DROPDOWN MENU --- */}
      {isOpen && (
        <div className="absolute top-[110%] right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl flex flex-col overflow-hidden z-50 animate-fadeIn">
          {/* Option 1: User Profile */}
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <img src={icon_profile_prime} alt="Profile" className="w-5 h-5" />
            <span className="text-primary font-bold text-sm">User profile</span>
          </div>

          {/* Option 2: Logout */}
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors border-t border-gray-50"
          >
            <img src={power_icon} alt="Logout" className="w-5 h-5" />
            <span className="text-[#DB4437] font-bold text-sm">Logout</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfileCard;
