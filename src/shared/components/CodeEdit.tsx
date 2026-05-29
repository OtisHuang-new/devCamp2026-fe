import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

type CodeEditProps = {
  language: string;
  theme: string;
  height: number;
};

export const CodeEdit = ({ language, theme, height }: CodeEditProps) => {
  const [code, setCode] = useState('# Viết code Python ở đây');

  const runCode = async () => {
    try {
      const res = await fetch('http://localhost:4000/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      console.log('Output:', data.output);
    } catch (err) {
      console.error('❌ Lỗi kết nối tới backend', err);
    }
  };

  return (
    <div>
      <CodeMirror
        value={code}
        height={`${height}px`}
        theme={theme === 'dark' ? oneDark : undefined}
        extensions={[python()]}
        onChange={(value) => setCode(value)}
        style={{ textAlign: 'left' }}
      />
      <button onClick={runCode} style={{ marginTop: '10px' }}>
        ▶️ Run
      </button>
    </div>
  );
};
