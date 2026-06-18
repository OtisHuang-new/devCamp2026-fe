import { useEffect, useState } from 'react';
import { IconSearch } from '../assets';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface SearchBarProps {
  activeTitle: string;
  onTitleChange: (text: string) => void;
}

// 1. Dùng Destructuring để đập vỡ props ra ngay từ đầu (Fix Warning 1)
export function SearchBar({ activeTitle, onTitleChange }: SearchBarProps) {
  const [localText, setLocalText] = useState(activeTitle);

  // Tạo thêm 1 biến để lưu lại mốc so sánh (giống hệt tư duy ở useProfileForm)
  const [prevTitle, setPrevTitle] = useState(activeTitle);

  // 2. Kỹ thuật "Update State During Render" (Fix Error 2)
  // Nếu prop từ URL (activeTitle) khác với mốc đang lưu, ta cập nhật lại ngay lập tức!
  if (activeTitle !== prevTitle) {
    setPrevTitle(activeTitle); // Cập nhật mốc mới
    setLocalText(activeTitle); // Đổi text ô input ngay lập tức
  }

  const debouncedText = useDebounce<string>(localText, 500);

  // 3. Luồng đẩy URL: Vẫn dùng useEffect bình thường
  useEffect(() => {
    if (debouncedText !== activeTitle) {
      onTitleChange(debouncedText);
    }
  }, [debouncedText, activeTitle, onTitleChange]);

  return (
    <div className="flex items-center bg-[#EAECEF] rounded-full px-4 py-2 w-72 mb-[10px] transition-colors focus-within:bg-gray-200">
      <img src={IconSearch} alt="Search" className="w-4 h-4 mr-2 opacity-60" />
      <input
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        type="text"
        placeholder="Search question"
        className="bg-transparent border-none outline-none text-sm w-full text-gray-800 placeholder-gray-500 font-medium"
      />
    </div>
  );
}
