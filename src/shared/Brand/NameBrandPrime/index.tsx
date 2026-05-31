import React from 'react';

interface NameBrandPrimeProps {
  logoSrc: string; // Đường dẫn logo (ví dụ: logo_dark.svg)
  brandName: string; // Tên thương hiệu (ví dụ: "Cận Code Team")
  className?: string; // Cho phép truyền thêm class từ ngoài để căn chỉnh margin/padding nếu cần
}

const NameBrandPrime: React.FC<NameBrandPrimeProps> = ({ logoSrc, brandName, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 px-5 pt-4 ${className}`}>
      {/* Logo */}
      <img src={logoSrc} alt="Brand Logo" className="w-10 h-10 object-contain" />

      {/* Brand Name */}
      <span className="font-bold text-[#1E3A8A] text-xl tracking-tight whitespace-nowrap">
        {brandName}
      </span>
    </div>
  );
};

export default NameBrandPrime;
