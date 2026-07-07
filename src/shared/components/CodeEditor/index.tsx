import React from 'react';
import CodeToggleButton from './components/Buttons/CodeToggleButton';
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
import { RunButton } from './components/Buttons/RunButton';
import { SubmitButton } from './components/Buttons/SubmitButton';

import { ResetTestcasesButton } from './components/Buttons/ResetTestcasesButton'; // <-- THÊM DÒNG NÀY

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
    addToast('Reset initial code successfully!', 1300, false, 'top-center');
  };

  const handleShowAnswer = () => {
    if (keyCode) {
      setCode(keyCode);
      addToast('Loaded solution successfully!', 1300, false, 'top-center');
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
      <div className="fixed bottom-1 left-2 right-2 h-[50vh] rounded-lg bg-[#121212] flex flex-col p-4 pt-8 shadow-2xl animate-slideUp pointer-events-auto">
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

            <div className="flex justify-between items-center w-full mt-2">
              {/* CỤM BÊN TRÁI */}
              <div className="flex gap-3 items-center">
                <ResetButton onClick={handleResetCode} />
                {keyCode && <ShowAnswerButton onClick={handleShowAnswer} />}
              </div>

              {/* CỤM BÊN PHẢI */}
              <div className="flex gap-3 items-center">
                <SubmitButton
                  onClick={() => {
                    onClose();
                    onSubmit(code);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-[45%] bg-[#1E1E1E] rounded-xl border border-gray-800 flex flex-col overflow-hidden relative">
            <div className="flex gap-6 px-4 pt-1.5 bg-[#1A1A1A] border-b border-gray-800">
              <button
                onClick={() => setActiveMainTab('testcase')}
                className={`pb-2 text-sm font-bold transition-colors ${
                  activeMainTab === 'testcase'
                    ? 'text-gray-300 border-b-2 border-blue-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="text-blue-400 mr-1">☑</span> Testcase
              </button>
              <button
                onClick={() => setActiveMainTab('result')}
                className={`pb-2 text-sm font-bold transition-colors ${
                  activeMainTab === 'result'
                    ? 'text-gray-300 border-b-2 border-blue-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="text-blue-400 mr-1">&gt;_</span> Test Result
              </button>
            </div>

            {localTestCases.length > 0 && (
              <div className="px-3 pt-2">
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

            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
              {/* 1. CẬP NHẬT: Ẩn nút Run khi không ở tab testcase */}
              <div className="pointer-events-auto">
                {activeMainTab === 'testcase' && (
                  <div className="animate-fadeIn">
                    <RunButton onClick={handleRun} isRunning={isRunning} />
                  </div>
                )}
              </div>

              {/* Bên phải: Nút Reset (Giữ nguyên) */}
              <div className="pointer-events-auto">
                {isModified && activeMainTab === 'testcase' && (
                  <div className="animate-slideUp">
                    <ResetTestcasesButton onClick={handleReset} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
