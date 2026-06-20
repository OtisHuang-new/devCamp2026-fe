import type { TestCase } from '../types/exerciseTypes';
// 1. SENIOR FIX: Import MarkdownRender
import { MarkdownRender } from '../../../shared/components/MarkdownRender';

interface TestCaseListProps {
  testCases: TestCase[];
}

export function TestCaseList({ testCases }: TestCaseListProps) {
  const visibleExamples = testCases.filter((tc) => !tc.is_hidden);

  if (visibleExamples.length === 0) return null;

  return (
    <div className="space-y-6">
      {visibleExamples.map((ex, index) => (
        <div key={index} className="flex flex-col gap-2">
          <p className="text-sm font-bold text-slate-600">Example {index + 1}:</p>
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-inner">
            {/* 2. SENIOR FIX: Đổi <p> thành <div> để bao bọc Markdown an toàn */}
            <div className="font-mono text-sm flex flex-col gap-4">
              {/* --- Khối hiển thị Input --- */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="font-bold shrink-0 mt-0.5">Input:</span>
                {/* overflow-x-auto để chặn markdown code blocks làm tràn màn hình */}
                <div className="flex-1 overflow-x-auto">
                  <MarkdownRender content={ex.input} />
                </div>
              </div>

              {/* --- Khối hiển thị Output --- */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="font-bold shrink-0 mt-0.5">Output:</span>
                <div className="flex-1 overflow-x-auto">
                  <MarkdownRender content={ex.expected_output} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
