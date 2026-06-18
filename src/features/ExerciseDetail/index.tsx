import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExerciseDetail } from './hooks/useExerciseDetail';
import { ExerciseContent } from './components/ExerciseContent';

// --- IMPORT CÁC COMPONENT & HOOK DÙNG CHUNG ---
import SidePanel from '../../shared/components/SidePanel';
import CodeEditor from '../../shared/components/CodeEditor';
import SubmissionResult from '../../shared/components/SubmissionResult';
import CodeToggleButton from '../../shared/components/Buttons/CodeToggleButton';

// LƯU Ý ĐƯỜNG DẪN: Nếu useSubmitCode vẫn nằm trong LessonDetail, bạn trỏ về đó.
// (Chuẩn Senior: Bạn nên move hook này ra src/shared/hooks/useSubmitCode.ts để dùng chung)
import { useSubmitCode } from '@/features/Exercise/hooks/useSubmitCode';
import { useSubmissionHistory } from '@/features/Exercise/hooks/useSubmissionHistory';
import { useSyncEditorStore } from '../Exercise/hooks/useSyncEditorStore';
import { TestCaseList } from '../Exercise/components/TestCaseList';

export function ExerciseDetail() {
  const navigate = useNavigate();
  const { exerciseDetail, isLoading } = useExerciseDetail();

  useSyncEditorStore(exerciseDetail);

  // 1. STATE BẬT/TẮT EDITOR
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // 2. HOOK XỬ LÝ NỘP BÀI
  // Dùng toán tử optional chaining (?) vì lúc đầu exerciseDetail có thể null
  const { submitCode, isSubmitting, error: submitError } = useSubmitCode(exerciseDetail?._id);

  const { history, selectedIndex, setSelectedIndex, fetchHistory } = useSubmissionHistory(
    exerciseDetail?._id,
  );

  // 3. EFFECT: Phím tắt đóng/mở Editor (Giống hệt LessonDetail)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsEditorOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsEditorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3. SỬA HÀM NÀY:
  const handleSubmit = async (code: string) => {
    if (!exerciseDetail?._id) return;

    // Nộp bài
    await submitCode(exerciseDetail._id, exerciseDetail.lesson_id, code);

    // Nộp xong thì ra lệnh cho History nạp lại dữ liệu mới nhất
    await fetchHistory();

    setIsEditorOpen(false);
  };

  // --- XỬ LÝ GIAO DIỆN LOADING & ERROR ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen font-bold text-gray-500 bg-gray-50">
        Đang tải bài tập...
      </div>
    );
  }

  if (!exerciseDetail) {
    return (
      <div className="flex justify-center items-center h-screen font-bold text-red-500 bg-gray-50">
        Không tìm thấy bài tập hoặc bài tập không tồn tại!
      </div>
    );
  }

  // --- RÁP LAYOUT CHÍNH ---
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      {/* CỘT TRÁI: Nội dung có thể cuộn */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col scroll-smooth pb-[100px] border-r border-gray-100">
        {/* Nút Back */}
        <div className="pt-6 px-10">
          <button
            onClick={() => navigate('/exercises')}
            className="text-gray-500 text-sm hover:text-[#1E3A8A] flex items-center gap-2"
          >
            <span>←</span> Return to exercises
          </button>
        </div>

        <div className="px-10 py-4 flex flex-col gap-4">
          <ExerciseContent data={exerciseDetail} />

          {exerciseDetail && (
            <div className="mt-2">
              <TestCaseList testCases={exerciseDetail.test_cases} />
            </div>
          )}

          <hr className="border-gray-100 my-4" />

          {/* KHU VỰC HIỂN THỊ KẾT QUẢ CHẤM BÀI */}
          {isSubmitting && (
            <div className="w-full text-center py-6 text-gray-500 font-bold animate-pulse">
              Đang chấm điểm...
            </div>
          )}

          {submitError && (
            <div className="w-full text-center py-6 text-red-500 font-bold">
              Lỗi khi nộp bài: {submitError}
            </div>
          )}

          {/* 4. SỬA ĐOẠN NÀY: Dùng history.length > 0 thay vì submitResult */}
          {!isSubmitting && history.length > 0 && (
            <SubmissionResult
              history={history}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
              onActionClick={() => navigate('/exercises')}
            />
          )}
        </div>
      </div>

      {/* CỘT PHẢI: AI Assistant */}
      <div className="w-[35%] h-full">
        <SidePanel lessonId={exerciseDetail.lesson_id} exerciseId={exerciseDetail._id} />
      </div>

      {/* --- CÁC COMPONENT NỔI (ABSOLUTE/FIXED) BÊN NGOÀI LAYOUT CHÍNH --- */}

      {/* Nút bật/tắt Editor (Góc dưới cùng) */}
      {!isEditorOpen && (
        <CodeToggleButton isOpen={isEditorOpen} onToggle={() => setIsEditorOpen(true)} />
      )}

      {/* Bảng Code Editor (Chỉ hiện khi isEditorOpen === true) */}
      <div className={isEditorOpen ? 'block' : 'hidden'}>
        <CodeEditor
          exerciseId={exerciseDetail._id}
          onClose={() => setIsEditorOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
