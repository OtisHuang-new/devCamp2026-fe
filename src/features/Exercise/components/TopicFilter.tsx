import { useState, useRef, useEffect } from 'react';

interface TopicFilterProps {
  topics: string[];
  activeTopic: string;
  onTopicChange: (topic: string) => void;
}

export function TopicFilter({ topics, activeTopic, onTopicChange }: TopicFilterProps) {
  // 1. Khai báo state quản lý UI
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  // 2. Tham chiếu tới thẻ bọc danh sách topic
  const containerRef = useRef<HTMLDivElement>(null);

  // 3. Logic giám sát kích thước (Chuẩn StrictMode, Pure Function bề mặt)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Hàm kiểm tra tràn dòng
    const checkOverflow = () => {
      // Chiều cao 1 dòng khoảng 26px. 2 dòng sẽ > 50px.
      // Ngưỡng 35px cực kỳ an toàn để xác định việc rớt dòng.
      setHasOverflow(container.scrollHeight > 35);
    };

    checkOverflow(); // Chạy ngay lần đầu tiên component mount

    // Giám sát trường hợp người dùng thu/phóng cửa sổ trình duyệt
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });
    resizeObserver.observe(container);

    // Dọn dẹp listener để không bị Memory Leak trong React 19 StrictMode
    return () => resizeObserver.disconnect();
  }, [topics]);

  return (
    // Outer Container: Tách biệt danh sách Topic và nút "See more"
    <div className="flex flex-row items-start gap-[8px] mb-[16px] w-full">
      {/* Inner Container: Khối chứa danh sách Topic tự động co giãn */}
      <div
        ref={containerRef}
        className={`flex flex-wrap items-center gap-[8px] flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px]' : 'max-h-[24px]'
        }`}
      >
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicChange(topic)}
            className={`shrink-0 px-[10px] py-[2px] rounded-full text-[12px] font-medium border border-gray-500 transition-colors ${
              activeTopic === topic
                ? 'bg-[#1A2E72] text-white'
                : 'bg-[#eceef8] text-[#1A2E72] hover:bg-gray-300'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Chỉ render nút khi có tràn dòng */}
      {hasOverflow && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 px-[10px] py-[2px] rounded-full text-[12px] font-bold bg-[#D3D8E8] text-[#1A2E72] hover:bg-gray-300 transition-colors"
        >
          {isExpanded ? 'See less' : 'See more ...'}
        </button>
      )}
    </div>
  );
}
