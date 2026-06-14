import type { TestCase } from '../types/exerciseTypes';

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
            <div className="font-mono text-sm flex flex-col gap-1">
              <p>
                <span className="font-bold">Input:</span> {ex.input}
              </p>
              <p>
                <span className="font-bold">Output:</span> {ex.expected_output}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
