import React from 'react';

interface NameBrandPrimeProps {
  logoSrc: string;
  brandName: string;
  className?: string;
}

const NameBrandPrime: React.FC<NameBrandPrimeProps> = ({ logoSrc, brandName, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 px-5 pt-4 ${className}`}>
      <img src={logoSrc} alt="Brand Logo" className="w-10 h-10 object-contain" />

      <span className="font-bold text-[#1E3A8A] text-xl tracking-tight whitespace-nowrap">
        {brandName}
      </span>
    </div>
  );
};

export default NameBrandPrime;
