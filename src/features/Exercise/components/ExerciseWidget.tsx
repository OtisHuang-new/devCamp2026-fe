import { useExercise } from '../hooks/useExercise';
// import { useEffect } from 'react';
// import { useEditorStore } from '../../../shared/store/useEditorStore';
import { MarkdownRender } from '../../../shared/components/MarkdownRender';
import { useSyncEditorStore } from '../hooks/useSyncEditorStore';
import { TestCaseList } from './TestCaseList';
import { ShowAnswerButton } from '@/shared/components/Buttons/ShowAnswerButton';

interface ExerciseWidgetProps {
  exerciseId: string;
}

function ExerciseWidget({ exerciseId }: ExerciseWidgetProps) {
  const { exercise, isLoading } = useExercise(exerciseId);

  useSyncEditorStore(exercise);

  if (isLoading) {
    return (
      <div className="w-full py-10 flex justify-center items-center text-gray-500 font-medium animate-pulse">
        Loading exercise...
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="w-full animate-fadeIn">
      {/* 2. SENIOR FIX: Bọc flex justify-between để căn lề 2 bên (Space-between) */}
      <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-4xl font-bold text-[#1E3A8A]">
          {exercise.is_project ? 'Project' : 'Exercise'}
        </h2>

        {/* 3. Render nút nếu API có trả về key_code */}
        {exercise.key_code && (
          <ShowAnswerButton keyCode={exercise.key_code} toastPosition="bottom-left" />
        )}
      </div>

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

        <TestCaseList testCases={exercise.test_cases} />
      </div>
    </div>
  );
}

export default ExerciseWidget;
