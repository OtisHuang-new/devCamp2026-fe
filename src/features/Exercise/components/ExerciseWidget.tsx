import { useExercise } from '../hooks/useExercise';

interface ExerciseWidgetProps {
  exerciseId: string;
}

function ExerciseWidget({ exerciseId }: ExerciseWidgetProps) {
  // 1. Gọi hook để tự động fetch data bài tập
  const { exercise, isLoading } = useExercise(exerciseId);

  // 2. Xử lý UI trong lúc chờ API trả về
  if (isLoading) {
    return (
      <div className="w-full py-10 flex justify-center items-center text-gray-500 font-medium animate-pulse">
        Đang tải bài tập...
      </div>
    );
  }

  // 3. Nếu API lỗi hoặc không có bài tập thì ẩn luôn component này
  if (!exercise) return null;

  // 4. Lọc bỏ các test case ẩn (is_hidden: true), chỉ giữ lại test case công khai làm Ví dụ
  const visibleExamples = exercise.test_cases.filter((tc) => !tc.is_hidden);

  return (
    <div className="w-full animate-fadeIn">
      {/* Section Title */}
      <h2 className="text-4xl font-bold text-[#1E3A8A] mb-6">Exercise</h2>

      {/* Exercise Card */}
      <div className="bg-[#F8F9FA] rounded-2xl py-8 px-4 border border-gray-100 shadow-sm">
        {/* Title & Difficulty */}
        <div className="flex flex-col gap-3 mb-6">
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {exercise.title}
          </h3>

          {/* Đổi màu linh hoạt theo độ khó (Nếu sau này có Medium/Hard) */}
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

        {/* Description (Mapping với trường 'content' từ JSON) */}
        <p className="text-slate-700 font-medium leading-relaxed mb-8">{exercise.content}</p>

        {/* Examples Section */}
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
                    {/* Chú ý: Đổi output thành expected_output theo đúng JSON của Backend */}
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
