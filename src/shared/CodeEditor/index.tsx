import React from 'react';
import CodeToggleButton from '../Buttons/CodeToggleButton';

interface CodeEditorProps {
  onClose: () => void;
  onSubmit: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onClose, onSubmit }) => {
  return (
    /* 1. Backdrop mờ 25% - Theo Figma của bạn */
    <div className="fixed inset-0 z-[90] bg-black/25 animate-fadeIn pointer-events-none">
      {/* 2. Editor Panel - 50% Height, Bottom Center, Sát rìa */}
      <div className="fixed bottom-5 left-5 right-5 h-[50vh] rounded-lg bg-[#121212] flex flex-col p-4 pt-8 shadow-2xl animate-slideUp pointer-events-auto">
        {/* Nút Close (Chính là Toggle ON) đặt ở góc trái trên của Editor */}
        <div className="absolute top-1.5 left-5">
          <CodeToggleButton isOpen={true} onToggle={onClose} isInsideEditor={true} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* CODING AREA (TRÁI) */}
          <div className="w-[55%] bg-[#1E1E1E] rounded-xl border border-gray-800 flex flex-col p-4">
            <textarea
              className="flex-1 bg-transparent outline-none resize-none border-none text-white font-mono text-sm"
              placeholder="# Write your code here..."
              spellCheck="false"
            />
            <div className="flex justify-end gap-3 mt-2">
              <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md font-bold text-sm hover:bg-white transition-all">
                Run
              </button>
              <button
                onClick={onSubmit}
                className="bg-[#22C55E] text-white px-4 py-1 rounded-md font-bold text-sm hover:bg-[#16a34a] transition-all"
              >
                Submit
              </button>
            </div>
          </div>

          {/* INPUT/OUTPUT AREA (PHẢI) */}
          <div className="w-[45%] bg-[#1E1E1E] rounded-xl border border-gray-800 flex flex-col overflow-hidden">
            <div className="flex gap-4 px-4 pt-3 border-b border-gray-800 pb-2 text-sm">
              <button className="text-white border-b-2 border-white pb-1">Input</button>
              <button className="text-gray-500">Output</button>
            </div>
            <div className="px-4 py-3 flex gap-3 text-xs">
              <span className="bg-white text-black px-2 py-0.5 rounded font-bold">Input 1</span>
              <span className="text-gray-400 py-0.5">Input 2</span>
              <span className="text-gray-400 py-0.5">+</span>
            </div>
            <div className="flex-1 px-4 pb-4">
              <div className="w-full h-full border border-gray-700 rounded-lg p-3 font-mono text-white text-base">
                1233
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
