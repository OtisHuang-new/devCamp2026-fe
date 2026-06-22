import React from 'react';

export type FieldType = 'text' | 'textarea' | 'select';

// 1. Thêm Interface cho Options
export interface FieldOption {
  value: string | number;
  label: string;
}

interface EditableFieldProps {
  label?: string;
  value: string | number;
  isEditing: boolean;
  type?: FieldType;
  isMainTitle?: boolean;
  options?: FieldOption[]; // 2. Bổ sung thêm prop options (có thể có hoặc không)
  onChange: (value: string) => void;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  isEditing,
  type = 'text',
  isMainTitle = false,
  options, // Nhận prop
  onChange,
}) => {
  // --- NẾU ĐANG CHẾ ĐỘ ĐỌC (VIEW MODE) ---
  if (!isEditing) {
    // Logic Mapping Tự Động: Nếu là select và có options, tìm nhãn (label) tương ứng với giá trị (value)
    let displayValue = value;
    if (type === 'select' && options) {
      const selectedOption = options.find((opt) => String(opt.value) === String(value));
      if (selectedOption) displayValue = selectedOption.label;
    }

    if (isMainTitle) {
      return (
        <h1 className="text-2xl font-bold text-gray-900 border-2 border-transparent">
          {displayValue}
        </h1>
      );
    }
    return (
      <p className="text-gray-900">
        {label && <span className="font-bold">{label}: </span>}
        {displayValue}
      </p>
    );
  }

  // --- NẾU ĐANG CHẾ ĐỘ SỬA (EDIT MODE) ---
  const baseInputClass =
    'w-full border-2 border-gray-300 rounded-md p-2 focus:border-primary outline-none transition-colors';

  if (isMainTitle) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseInputClass} text-2xl font-bold text-gray-900`}
      />
    );
  }

  // Nếu là Dropdown, tự động render mảng options
  if (type === 'select') {
    return (
      <div className="flex flex-col gap-1">
        {label && <span className="font-bold text-gray-900">{label}</span>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} cursor-pointer`}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // 1. SENIOR FIX: Bổ sung rẽ nhánh render đích danh thẻ <textarea> để fix lỗi 1 dòng
  if (type === 'textarea') {
    return (
      <div className="flex flex-col gap-1">
        {label && <span className="font-bold text-gray-900">{label}</span>}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} min-h-[100px] resize-none custom-scrollbar`}
        />
      </div>
    );
  }

  // Mặc định cho input text bình thường
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="font-bold text-gray-900">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
      />
    </div>
  );
};
