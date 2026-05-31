import React from 'react';

// Định nghĩa các kiểu dữ liệu (Props) mà component sẽ nhận vào
interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: 'text' | 'password' | 'email'; // Mặc định là text nếu không truyền
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mb-4">
      {/* Label của ô input */}
      <label className="text-[#0f2d72] font-bold text-lg">{label}</label>

      {/* Ô Input styled giống trong ảnh */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base"
      />
    </div>
  );
};

export default InputField;
