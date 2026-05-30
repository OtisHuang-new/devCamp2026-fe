import React from 'react';
import CodeToggleButton from '../Buttons/CodeToggleButton';
import { useState } from 'react';

// --- 1. BỔ SUNG IMPORT CODEMIRROR ---
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
// ------------------------------------

// --- 4. IMPORT STORE VÀO EDITOR ---
import { useEditorStore } from '../store/useEditorStore';
// ----------------------------------

// --- BỔ SUNG 3 COMPONENT CON VÀ TYPE ---
import EditorTextArea from './components/EditorTextArea';
import TestCaseNav from './components/TestCaseNav';
import TestResultView from './components/TestResultView';
import type { EditorTestCase } from '../store/useEditorStore';
// ---------------------------------------

// --- 1. BỔ SUNG IMPORT MỚI (Ngay dưới các import hiện tại) ---
import { runApi } from '../../features/Exercise/api/runApi';
import type { TestResultProps } from './components/TestResultView';
// -----------------------------------------------------------

// --- 2. BỔ SUNG EXERCISE_ID VÀO PROPS ---
interface CodeEditorProps {
  exerciseId: string; // Thêm dòng này
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ exerciseId, onClose, onSubmit }) => {
  // ----------------------------------------
  // --- 6. LẤY INITIAL CODE TỪ STORE VÀ GẮN VÀO STATE ---
  const initialCode = useEditorStore((state) => state.initialCode);
  const [code, setCode] = useState(initialCode);
  // -----------------------------------------------------

  // --- BỔ SUNG LOGIC QUẢN LÝ TESTCASE BÊN PHẢI ---
  const publicTestCases = useEditorStore((state) => state.publicTestCases); // Dữ liệu gốc

  const [activeMainTab, setActiveMainTab] = useState<'testcase' | 'result'>('testcase');
  const [localTestCases, setLocalTestCases] = useState<EditorTestCase[]>([]);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  const [prevPublicCases, setPrevPublicCases] = useState(publicTestCases);
  // Kiểm tra xem User có sửa đổi gì so với bản gốc không (Deep so sánh)
  const isModified = JSON.stringify(localTestCases) !== JSON.stringify(publicTestCases);

  if (publicTestCases !== prevPublicCases) {
    // Cập nhật lại vết lưu trữ
    setPrevPublicCases(publicTestCases);

    // Khởi tạo Editable Data ngay lập tức mà không cần chờ render lại
    if (publicTestCases.length > 0) {
      setLocalTestCases(JSON.parse(JSON.stringify(publicTestCases)));
    }
  }

  // Hàm xử lý khi bấm dấu +
  const handleDuplicateCase = () => {
    if (localTestCases.length === 0) return;
    const caseToCopy = localTestCases[activeCaseIndex];
    const newCases = [...localTestCases, { ...caseToCopy }]; // Nhân bản
    setLocalTestCases(newCases);
    setActiveCaseIndex(newCases.length - 1); // Focus vào case mới nhất
  };

  // Hàm xử lý khi User gõ text vào ô Input / Expected Output
  const handleUpdateCase = (field: 'input' | 'expected_output', value: string) => {
    const newCases = [...localTestCases];
    newCases[activeCaseIndex][field] = value;
    setLocalTestCases(newCases);
  };

  // Hàm xử lý khi bấm nút Reset màu vàng
  const handleReset = () => {
    setLocalTestCases(JSON.parse(JSON.stringify(publicTestCases))); // Copy đè lại bản gốc
    setActiveCaseIndex(0);
  };

  const activeCase = localTestCases[activeCaseIndex]; // Lấy Case đang được chọn
  // -----------------------------------------------
  // --- 3. LOGIC XỬ LÝ NÚT RUN ---
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState<TestResultProps[]>([]);

  const handleRun = async () => {
    if (localTestCases.length === 0) return;
    setIsRunning(true);
    setActiveMainTab('result'); // Tự động chuyển sang tab kết quả

    // Khởi tạo mảng kết quả với trạng thái "Running"
    const initialResults: TestResultProps[] = localTestCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expected_output,
      yourOutput: null,
      error: null,
      status: 'Running',
    }));
    setRunResults(initialResults);

    try {
      // Chạy toàn bộ các test case song song (Concurrent) bằng Promise.all
      const promises = localTestCases.map(async (tc) => {
        try {
          const response = await runApi.runCode(exerciseId, {
            src_code: code,
            input: tc.input,
          });

          const yourOutput = (response.output || '').trim();
          const expected = tc.expected_output.trim();
          const error = response.error;

          let status: TestResultProps['status'] = 'Error';
          if (error) {
            status = 'Error';
          } else if (yourOutput === expected) {
            status = 'Accepted';
          } else {
            status = 'Wrong Answer';
          }

          return {
            input: tc.input,
            expectedOutput: tc.expected_output,
            yourOutput,
            error,
            status,
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          return {
            input: tc.input,
            expectedOutput: tc.expected_output,
            yourOutput: null,
            error: err?.message || 'Failed to execute code',
            status: 'Error',
          };
        }
      });

      const finalResults = await Promise.all(promises);
      setRunResults(finalResults);
    } catch (error) {
      console.error('Run failed:', error);
    } finally {
      setIsRunning(false);
    }
  };
  // ------------------------------
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
            <div className="flex-1 overflow-auto rounded-md custom-scrollbar">
              <CodeMirror
                value={code}
                height="100%"
                theme={oneDark}
                extensions={[python()]}
                onChange={(value) => setCode(value)}
                // --- 1. THAY ĐỔI CLASSNAME TẠI ĐÂY ---
                className="h-full text-sm font-mono [&_.cm-editor]:!bg-[#1E1E1E] [&_.cm-gutters]:!bg-[#1E1E1E] [&_.cm-gutters]:!border-r-[#333333]"
                // ------------------------------------
                style={{ textAlign: 'left' }}
              />
            </div>
            <div className="flex justify-end gap-3 mt-2">
              {/* --- 4. CẬP NHẬT NÚT RUN --- */}
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`px-4 py-1 rounded-md font-bold text-sm transition-all ${
                  isRunning
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-800 hover:bg-white'
                }`}
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>
              {/* --------------------------- */}
              <button
                // --- 4. THAY ĐỔI ONSUBMIT ---
                onClick={() => onSubmit(code)}
                // ----------------------------
                className="bg-[#22C55E] text-white px-4 py-1 rounded-md font-bold text-sm hover:bg-[#16a34a] transition-all"
              >
                Submit
              </button>
            </div>
          </div>

          {/* INPUT/OUTPUT AREA (PHẢI) */}
          <div className="w-[45%] bg-[#1E1E1E] rounded-xl border border-gray-800 flex flex-col overflow-hidden relative">
            {/* 1. Header Tabs (Testcase & Test Result) */}
            <div className="flex gap-6 px-4 pt-3 bg-[#1A1A1A] border-b border-gray-800">
              {/* ... (2 Nút bấm Testcase và Test Result giữ nguyên) ... */}
              <button
                onClick={() => setActiveMainTab('testcase')}
                className={`pb-2 text-sm font-bold transition-colors ${
                  activeMainTab === 'testcase'
                    ? 'text-white border-b-2 border-[#22C55E]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="text-[#22C55E] mr-1">☑</span> Testcase
              </button>
              <button
                onClick={() => setActiveMainTab('result')}
                className={`pb-2 text-sm font-bold transition-colors ${
                  activeMainTab === 'result'
                    ? 'text-white border-b-2 border-[#22C55E]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="text-[#22C55E] mr-1">&gt;_</span> Test Result
              </button>
            </div>

            {/* --- 5. BỐ CỤC LẠI CONTENT AREA --- */}

            {/* Thanh Test Case Nav (Dùng chung) */}
            {localTestCases.length > 0 && (
              <div className="px-4 pt-4">
                <TestCaseNav
                  casesCount={localTestCases.length}
                  activeIndex={activeCaseIndex}
                  onSelect={setActiveCaseIndex}
                  onAdd={handleDuplicateCase}
                  readonly={activeMainTab === 'result' || isRunning}
                />
              </div>
            )}

            {/* Vùng Nội Dung Bắt Buộc */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-14 relative">
              {activeMainTab === 'testcase' ? (
                localTestCases.length > 0 && activeCase ? (
                  <div className="animate-fadeIn flex flex-col gap-4">
                    <EditorTextArea
                      label="Input ="
                      value={activeCase.input}
                      onChange={(val) => handleUpdateCase('input', val)}
                    />
                    <EditorTextArea
                      label="Expected Output ="
                      value={activeCase.expected_output}
                      onChange={(val) => handleUpdateCase('expected_output', val)}
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm mt-4">Không có Testcase công khai nào.</div>
                )
              ) : (
                localTestCases.length > 0 &&
                activeCase && (
                  <TestResultView
                    {...(runResults[activeCaseIndex] || {
                      input: activeCase.input,
                      expectedOutput: activeCase.expected_output,
                      yourOutput: null,
                      error: null,
                      status: 'Idle',
                    })}
                  />
                )
              )}
            </div>
            {/* ---------------------------------- */}

            {/* 3. Nút Reset Testcases hiển thị nổi ở góc dưới nếu có chỉnh sửa */}
            {isModified && activeMainTab === 'testcase' && (
              <div className="absolute bottom-4 left-4 z-10 animate-slideUp">
                <button
                  onClick={handleReset}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-md text-sm font-bold shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  Reset Testcases
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
