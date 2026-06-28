// Vị trí: File chứa component NameBrandPrime

interface NameBrandPrimeProps {
  logoSrc: string;
  brandName: string;
  className?: string;
  onClick?: () => void; // 1. SENIOR FIX: Khai báo thêm prop onClick
}

// 2. SENIOR FIX: Chuyển sang Function Declare cho dễ đọc và dễ debug
export default function NameBrandPrime({
  logoSrc,
  brandName,
  className = '',
  onClick,
}: NameBrandPrimeProps) {
  return (
    <div
      onClick={onClick}
      // 3. SENIOR UX: Nếu cha có truyền onClick vào, tự động gắn class con trỏ và hiệu ứng mờ đi
      className={`flex items-center gap-3 px-5 pt-4 ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      } ${className}`}
    >
      <img src={logoSrc} alt="Brand Logo" className="w-10 h-10 object-contain" />

      <span className="font-bold text-[#1E3A8A] text-xl tracking-tight whitespace-nowrap">
        {brandName}
      </span>
    </div>
  );
}
