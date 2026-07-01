import React from 'react';
import CodeToggleButton from '../Buttons/CodeToggleButton';
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { useEditorStore } from '../../store/useEditorStore';
import EditorTextArea from './components/EditorTextArea';
import TestCaseNav from './components/TestCaseNav';
import TestResultView from './components/TestResultView';
import type { EditorTestCase } from '../../store/useEditorStore';
import { runApi } from '../../../features/Exercise/api/runApi';
import type { TestResultProps } from './components/TestResultView';

import { useToastStore } from '../../store/useToastStore';

import { ResetButton } from './components/Buttons/ResetButton';
import { ShowAnswerButton } from './components/Buttons/ShowAnswerButton';

interface CodeEditorProps {
  exerciseId: string; // Thêm dòng này
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ exerciseId, onClose, onSubmit }) => {
  const initialCode = useEditorStore((state) => state.initialCode);
  const keyCode = useEditorStore((state) => state.keyCode); // 2. Lấy keyCode từ Store

  const addToast = useToastStore((state) => state.addToast); // 3. Lấy hàm tạo Toast

  const [code, setCode] = useState(initialCode);

  const handleResetCode = () => {
    setCode(initialCode);
    addToast('Reset initial code successfully!', 3000, false, 'top-center');
  };

  const handleShowAnswer = () => {
    if (keyCode) {
      setCode(keyCode);
      addToast('Loaded solution successfully!', 3000, false, 'top-center');
    }
  };

  const [prevInitialCode, setPrevInitialCode] = useState(initialCode);
  if (initialCode !== prevInitialCode) {
    setPrevInitialCode(initialCode);
    setCode(initialCode);
  }
  const publicTestCases = useEditorStore((state) => state.publicTestCases); // Dữ liệu gốc
  const [activeMainTab, setActiveMainTab] = useState<'testcase' | 'result'>('testcase');
  const [localTestCases, setLocalTestCases] = useState<EditorTestCase[]>(() => {
    return publicTestCases.length > 0 ? JSON.parse(JSON.stringify(publicTestCases)) : [];
  });
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [prevPublicCases, setPrevPublicCases] = useState(publicTestCases);
  const isModified = JSON.stringify(localTestCases) !== JSON.stringify(publicTestCases);

  if (publicTestCases !== prevPublicCases) {
    setPrevPublicCases(publicTestCases);

    if (publicTestCases.length > 0) {
      setLocalTestCases(JSON.parse(JSON.stringify(publicTestCases)));
    }
  }

  const handleDuplicateCase = () => {
    if (localTestCases.length === 0) return;
    const caseToCopy = localTestCases[activeCaseIndex];
    const newCases = [...localTestCases, { ...caseToCopy }]; // Nhân bản
    setLocalTestCases(newCases);
    setActiveCaseIndex(newCases.length - 1); // Focus vào case mới nhất
  };

  const handleUpdateCase = (field: 'input' | 'expected_output', value: string) => {
    const newCases = [...localTestCases];
    newCases[activeCaseIndex][field] = value;
    setLocalTestCases(newCases);
  };

  const handleReset = () => {
    setLocalTestCases(JSON.parse(JSON.stringify(publicTestCases))); // Copy đè lại bản gốc
    setActiveCaseIndex(0);
  };

  const activeCase = localTestCases[activeCaseIndex]; // Lấy Case đang được chọn
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState<TestResultProps[]>([]);

  const handleRun = async () => {
    if (localTestCases.length === 0) return;
    setIsRunning(true);
    setActiveMainTab('result'); // Tự động chuyển sang tab kết quả

    const initialResults: TestResultProps[] = localTestCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expected_output,
      yourOutput: null,
      error: null,
      status: 'Running',
    }));
    setRunResults(initialResults);

    try {
      const inputs = localTestCases.map((tc) => tc.input);
      const response = await runApi.runCode(exerciseId, {
        src_code: code,
        inputs: inputs,
      });

      const finalResults: TestResultProps[] = localTestCases.map((tc, index) => {
        const resItem = response[index];

        if (!resItem) {
          return {
            input: tc.input,
            expectedOutput: tc.expected_output,
            yourOutput: null,
            error: 'Không nhận được kết quả từ server',
            status: 'Error',
          };
        }

        const yourOutput = (resItem.output || '').trim();
        const expected = tc.expected_output.trim();
        const error = resItem.error || null;

        let status: TestResultProps['status'] = 'Error';

        if (resItem.exit_code !== 0 || error) {
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
          error:
            error ||
            (resItem.exit_code !== 0 ? `Runtime Error (Exit code: ${resItem.exit_code})` : null),
          status,
        };
      });

      setRunResults(finalResults);
    } catch (error: unknown) {
      console.error('Run failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Lỗi hệ thống khi gọi API';

      setRunResults(
        localTestCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expected_output,
          yourOutput: null,
          error: errorMessage, // 3. Dùng biến an toàn vừa tạo ở đây
          status: 'Error',
        })),
      );
    } finally {
      setIsRunning(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[90] bg-black/10 animate-fadeIn pointer-events-none">
      <div className="fixed bottom-5 left-5 right-5 h-[50vh] rounded-lg bg-[#121212] flex flex-col p-4 pt-8 shadow-2xl animate-slideUp pointer-events-auto">
        <div className="absolute top-1.5 left-5">
          <CodeToggleButton isOpen={true} onToggle={onClose} isInsideEditor={true} />
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="w-[55%] bg-[#1E1E1E] rounded-xl border border-gray-800 flex flex-col p-4">
            <div className="flex-1 overflow-auto rounded-md custom-scrollbar">
              <CodeMirror
                value={code}
                height="100%"
                theme={oneDark}
                extensions={[python()]}
                onChange={(value) => setCode(value)}
                className="h-full text-sm font-mono [&_.cm-editor]:!bg-[#1E1E1E] [&_.cm-gutters]:!bg-[#1E1E1E] [&_.cm-gutters]:!border-r-[#333333]"
                style={{ textAlign: 'left' }}
              />
            </div>

            <div className="flex gap-3 items-center">
              <ResetButton onClick={handleResetCode} />
              {keyCode && <ShowAnswerButton onClick={handleShowAnswer} />}
            </div>

            <div className="flex justify-end gap-3 mt-2">
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

              <button
                // 3. SỬA LOGIC: Đóng form TRƯỚC, gọi API SAU
                onClick={() => {
                  onClose(); // Đóng Editor ngay tắp lự
                  onSubmit(code); // Kích hoạt luồng API ngầm
                }}
                className="bg-[#22C55E] text-white px-4 py-1 rounded-md font-bold text-sm hover:bg-[#16a34a] transition-all"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="w-[45%] bg-[#1E1E1E] rounded-xl border border-gray-800 flex flex-col overflow-hidden relative">
            <div className="flex gap-6 px-4 pt-3 bg-[#1A1A1A] border-b border-gray-800">
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
                  <div className="text-gray-500 text-sm mt-4">No Testcase found</div>
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
