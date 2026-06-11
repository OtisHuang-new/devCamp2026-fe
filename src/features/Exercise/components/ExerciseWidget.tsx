import { useExercise } from '../hooks/useExercise';
import { useEffect } from 'react';
import { useEditorStore } from '../../../shared/store/useEditorStore';
import { MarkdownRender } from '../../../shared/components/MarkdownRender';

interface ExerciseWidgetProps {
  exerciseId: string;
}

function ExerciseWidget({ exerciseId }: ExerciseWidgetProps) {
  const { exercise, isLoading } = useExercise(exerciseId);
  const setInitialCode = useEditorStore((state) => state.setInitialCode);
  const setPublicTestCases = useEditorStore((state) => state.setPublicTestCases);

  useEffect(() => {
    if (exercise) {
      if (exercise.initial_code) {
        setInitialCode(exercise.initial_code);
      }

      const visibleCases = exercise.test_cases.filter((tc) => !tc.is_hidden);
      setPublicTestCases(visibleCases);
    }
  }, [exercise, setInitialCode, setPublicTestCases]);

  if (isLoading) {
    return (
      <div className="w-full py-10 flex justify-center items-center text-gray-500 font-medium animate-pulse">
        Đang tải bài tập...
      </div>
    );
  }

  if (!exercise) return null;

  const visibleExamples = exercise.test_cases.filter((tc) => !tc.is_hidden);

  return (
    <div className="w-full animate-fadeIn">
      <h2 className="text-4xl font-bold text-[#1E3A8A] mb-6">Exercise</h2>

      <div className="bg-[#F8F9FA] rounded-2xl py-8 px-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 mb-6">
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {exercise.title}
          </h3>

          <span
            className={`w-fit px-3 py-1 text-white text-xs font-bold rounded-full ${
              exercise.difficulty === 'Easy'
                ? 'bg-[#22C55E]'
                : exercise.difficulty === 'Medium'
                  ? 'bg-yellow-500'
                  : 'bg-[#DB4437]'
            }`}
          >
            {exercise.difficulty}
          </span>
        </div>

        <MarkdownRender
          content={exercise.content}
          className="text-black font-medium leading-relaxed space-y-4 mb-8"
        />

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
      </div>
    </div>
  );
}

export default ExerciseWidget;
