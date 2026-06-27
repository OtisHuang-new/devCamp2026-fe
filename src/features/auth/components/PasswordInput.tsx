// Vị trí: src/features/auth/components/PasswordInput.tsx
import { useState } from 'react';
import eye_on from '../Assets/remove_red_eye_on.svg';
import eye_off from '../Assets/remove_red_eye_off.svg';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}

export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-sm font-extrabold text-[#1E3A8A]">{label}</label>

      <div className="relative w-full">
        <input
          // 1. SENIOR TRICK: Thay đổi type của input dựa trên state
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          // 2. SENIOR UX: Thêm pr-10 để nội dung chữ không đâm xuyên qua icon con mắt
          className="w-full border border-gray-300 pl-4 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] placeholder:text-gray-400 placeholder:text-xs transition-colors"
          required={required}
          minLength={minLength}
        />

        {/* 3. SENIOR FIX: Bắt buộc phải là type="button" để không kích hoạt sự kiện Submit Form (Reload trang) */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center outline-none"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          <img
            src={showPassword ? eye_on : eye_off}
            alt="Toggle Password Visibility"
            className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity"
          />
        </button>
      </div>
    </div>
  );
}
