// --- 1. THÊM READONLY VÀO PROPS ---
interface TestCaseNavProps {
  casesCount: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  readonly?: boolean;
}

const TestCaseNav: React.FC<TestCaseNavProps> = ({
  casesCount,
  activeIndex,
  onSelect,
  onAdd,
  readonly = false,
}) => {
  return (
    <div className="flex gap-2 items-center mb-4 overflow-x-auto custom-scrollbar pb-1">
      {/* ... (Đoạn code map các nút Case 1, 2 giữ nguyên) ... */}
      {Array.from({ length: casesCount }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
            activeIndex === idx
              ? 'bg-[#2A2A2A] text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
          }`}
        >
          Case {idx + 1}
        </button>
      ))}

      {/* --- 2. ẨN NÚT DUPLICATE NẾU LÀ READONLY --- */}
      {!readonly && (
        <button
          onClick={onAdd}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50 transition-colors text-lg"
          title="Duplicate current test case"
        >
          +
        </button>
      )}
    </div>
  );
};

export default TestCaseNav;
