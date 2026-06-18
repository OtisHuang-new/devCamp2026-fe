// Vị trí: src/shared/components/MarkdownRender/components/InteractiveCompilerBlock.tsx
import { useState } from 'react';

interface InteractiveCompilerBlockProps {
  content: string;
}

export function InteractiveCompilerBlock({ content }: InteractiveCompilerBlockProps) {
  // 1. TÁCH DỮ LIỆU: Cắt chuỗi dựa trên ký hiệu quy ước của team giáo án
  const parts = content.split('===OUTPUT===');
  const sourceCode = parts[0]?.trim() || '';
  const expectedOutput = parts[1]?.trim() || 'No output found.';

  // 2. STATE QUẢN LÝ NÚT BẤM
  const [isRunClicked, setIsRunClicked] = useState<boolean>(false);

  // 3. UI RENDER
  return (
    <div className="w-full my-6 flex flex-col rounded-xl overflow-hidden bg-[#1E1E1E] shadow-lg font-mono text-sm border border-gray-800 animate-fadeIn">
      {/* --- PHẦN 1: HEADER & NÚT RUN --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#252526]">
        {/* Nút giả lập cửa sổ MacOS cho đẹp */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Nút bấm Tương tác */}
        <button
          onClick={() => setIsRunClicked(true)}
          disabled={isRunClicked}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-bold text-xs transition-all ${
            isRunClicked
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-[#22C55E] text-white hover:bg-[#16a34a] hover:scale-105 shadow-md shadow-green-900/50'
          }`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4l12 6-12 6V4z" />
          </svg>
          {isRunClicked ? 'Executed' : 'Run Code'}
        </button>
      </div>

      {/* --- PHẦN 2: HIỂN THỊ SOURCE CODE --- */}
      <div className="p-4 overflow-x-auto text-gray-300 whitespace-pre-wrap leading-relaxed custom-scrollbar">
        {sourceCode}
      </div>

      {/* --- PHẦN 3: HIỂN THỊ OUTPUT (Chỉ hiện khi đã bấm Run) --- */}
      {isRunClicked && (
        <div className="border-t border-gray-800 bg-black p-4 animate-slideUp">
          <div className="text-gray-500 font-bold text-xs mb-2 flex items-center gap-2">
            <span className="text-[#22C55E]">&gt;_</span> CONSOLE OUTPUT
          </div>
          <div className="text-white whitespace-pre-wrap leading-relaxed font-bold">
            {expectedOutput}
          </div>

          {/* Nút Reset để người dùng có thể chơi lại */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsRunClicked(false)}
              className="text-gray-500 hover:text-white text-xs underline transition-colors"
            >
              Reset Terminal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
