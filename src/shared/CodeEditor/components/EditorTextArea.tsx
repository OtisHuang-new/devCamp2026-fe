// Vị trí: src/shared/CodeEditor/components/EditorTextArea.tsx
import React from 'react';

interface EditorTextAreaProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const EditorTextArea: React.FC<EditorTextAreaProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-gray-400">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#2A2A2A] text-white font-mono text-sm p-3 rounded-lg border border-transparent focus:border-gray-500 focus:outline-none resize-none min-h-[80px] custom-scrollbar"
        spellCheck={false}
      />
    </div>
  );
};

export default EditorTextArea;
