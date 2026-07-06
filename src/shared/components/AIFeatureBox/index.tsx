// Vị trí: src/shared/components/AIFeatureBox/index.tsx
import type { ReactNode } from 'react';

export interface AIFeatureBoxProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'loading' | 'error';
  className?: string; // 1. SENIOR FIX: Cho phép truyền class từ bên ngoài
}

export function AIFeatureBox({
  title,
  icon,
  children,
  variant = 'default',
  className = 'w-full', // 2. Mặc định là w-full để các file cũ không bị ảnh hưởng
}: AIFeatureBoxProps) {
  // 1. Phân nhánh style màu nền dựa vào variant (chuẩn hóa màu sắc AI)
  let containerClass = `flex flex-col gap-2 rounded-lg px-4 pt-4 pb-2 transition-all ${className} `;

  if (variant === 'loading') {
    containerClass += 'bg-blue-50/50 border border-blue-100 animate-pulse';
  } else if (variant === 'error') {
    containerClass += 'bg-red-50/80 border border-red-200 shadow-sm animate-fadeIn';
  } else {
    containerClass += 'bg-blue-50/80 border border-blue-200 shadow-sm animate-fadeIn';
  }

  return (
    <div className={containerClass}>
      {/* Khối Tiêu đề cố định */}
      <div className="flex flex-row justify-between">
        <h2 className="text-[#1E3A8A] font-bold text-xl mb-1">{title}</h2>
        <h3 className="text-gray-400 text-sm">Cận is AI and can make mistake</h3>
      </div>

      <div className="flex items-start gap-4 w-full">
        {/* Khối Icon tự do */}
        {icon}

        {/* Khối Nội dung tự do (children) */}
        <div className="flex-1 overflow-hidden w-full">{children}</div>
      </div>
    </div>
  );
}
