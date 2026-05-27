import user_icon_prime from './Assets/user_icon_prime.svg';

interface UserProfileCardProps {
  userName: string;
}

function UserProfileCard({ userName }: UserProfileCardProps) {
  return (
    /* Container: 
           - Pill shape (rounded-full)
           - Border và shadow nhẹ để nổi bật trên nền trắng
           - w-fit để component không chiếm hết chiều ngang, dễ dàng căn lề phải ở trang Roadmap
        */
    <div className="flex items-center gap-4 bg-white border border-solid border-primary rounded-full pr-6 py-0.5 pl-0.5 w-fit mt-1.5 cursor-pointer hover:bg-gray-50 transition-all duration-200">
      {/* Icon Avatar: Vì bạn nói SVG đã có vòng tròn màu primary nên ta chỉ cần set kích thước */}
      <img src={user_icon_prime} alt="User Avatar" className="w-10 h-10 object-contain" />

      {/* Tên User: Bold và ngăn không cho rớt dòng */}
      <span className="text-slate-800 font-bold text-[15px] whitespace-nowrap">{userName}</span>
    </div>
  );
}

export default UserProfileCard;
