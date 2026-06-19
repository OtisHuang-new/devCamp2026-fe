// Vị trí: src/shared/components/MarkdownRender/components/InteractiveCompilerBlock.tsx
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <div className="min-w-[70%] w-max max-w-full my-6 flex flex-col rounded-xl overflow-hidden bg-[#1E1E1E] shadow-lg font-mono text-sm border border-gray-800 animate-fadeIn">
      {/* --- PHẦN 1: HEADER --- */}
      {/* 1. SENIOR FIX: Bỏ nút Run ở Header, đổi justify-between thành mặc định */}
      <div className="flex items-center px-4 py-1 border-b border-gray-800 bg-[#252526]">
        {/* Nút giả lập cửa sổ MacOS cho đẹp */}
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* --- PHẦN 2: HIỂN THỊ SOURCE CODE --- */}
      <div className="custom-scrollbar text-sm w-full overflow-hidden">
        <SyntaxHighlighter
          language="python"
          style={vscDarkPlus}
          wrapLines={true}
          wrapLongLines={true}
          // 1. THÊM MỚI: Kích hoạt số dòng và chỉnh style xám mờ
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1.2em',
            color: '#6b7280', // Màu xám
            opacity: 0.6, // Mờ đi một chút
            textAlign: 'right',
            userSelect: 'none', // UX: Tránh user copy nhầm số dòng
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          {sourceCode}
        </SyntaxHighlighter>
      </div>

      {/* --- PHẦN 3: LUỒNG TƯƠNG TÁC (RUN BUTTON <-> CONSOLE OUTPUT) --- */}
      {/* 2. SENIOR FIX: Dùng Ternary Operator để hoán đổi UI */}
      {!isRunClicked ? (
        // TRẠNG THÁI 1: Chưa bấm Run -> Hiện thanh chứa nút Run
        // SỬA TẠI ĐÂY: Đổi `justify-end` thành `justify-start` để nút bám sang lề trái
        <div className="border-t border-gray-800 bg-[#252526] p-3 flex justify-start">
          <button
            onClick={() => setIsRunClicked(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md font-bold text-xs transition-all bg-[#22C55E] text-white hover:bg-[#16a34a] hover:scale-105 shadow-md shadow-green-900/50"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4l12 6-12 6V4z" />
            </svg>
            Run Code
          </button>
        </div>
      ) : (
        // TRẠNG THÁI 2: Đã bấm Run -> Hiện Console Output
        <div className="border-t border-gray-800 bg-black pl-6 pr-3 py-2 animate-slideUp">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 font-bold text-xs flex items-center gap-2">
              <span className="text-[#22C55E]">&gt;_</span> CONSOLE OUTPUT
            </div>

            <button
              onClick={() => setIsRunClicked(false)}
              className="text-gray-500 hover:text-white text-xs underline transition-colors"
            >
              Reset Terminal
            </button>
          </div>

          <div className="text-white whitespace-pre-wrap leading-relaxed font-bold font-mono">
            {expectedOutput.split('\n').map((line: string, index: number) => (
              <div key={index} className="flex gap-3">
                <span className="text-gray-500 opacity-60 select-none shrink-0">&gt;</span>
                <span className="break-all">{line}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
