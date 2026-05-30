import { useState, useEffect } from 'react';
import SidePanel from './components/SidePanel';
import LessonContent from './components/LessonContent';
import ExerciseWidget from '../Exercise/components/ExerciseWidget';

// Import các phần mới
import CodeToggleButton from '../../shared/Buttons/CodeToggleButton';
import CodeEditor from '../../shared/CodeEditor';

import { useParams } from 'react-router-dom'; // BỔ SUNG
import { useLesson } from './hooks/useLesson'; // BỔ SUNG
// --- 1. THÊM IMPORT HOOK SUBMIT ---
import { useSubmitCode } from './hooks/useSubmitCode';
// ----------------------------------
import SubmissionResult from './components/SubmissionResult';

import { useNavigate } from 'react-router-dom'; // Thêm dòng này

const LessonDetail = () => {
  // Lấy ID từ URL (VD route của bạn là /lessons/:id)
  const { id } = useParams<{ id: string }>();

  // Gọi API
  const { lesson, isLoading } = useLesson(id);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const navigate = useNavigate(); // Thêm dòng này

  // --- 2. GỌI HOOK SUBMIT ---
  const { submitCode, isSubmitting, submitResult, error: submitError } = useSubmitCode();
  // --------------------------

  // --- 2. THÊM USEEFFECT BẮT SỰ KIỆN PHÍM TẮT ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Kiểm tra tổ hợp Ctrl + ` hoặc Cmd (metaKey) + `
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault(); // Tránh hành vi mặc định của trình duyệt
        setIsEditorOpen((prev) => !prev); // Toggle trạng thái
      }
      // 2. Kiểm tra phím Escape (Chỉ tắt, không mở)
      if (e.key === 'Escape') {
        setIsEditorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  // ----------------------------------------------

  // Loading state
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-gray-500">
        Đang tải bài học...
      </div>
    );
  if (!lesson)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-red-500">
        Không tìm thấy bài học!
      </div>
    );

  // --- 1. THAY ĐỔI HÀM SUBMIT ---
  const handleSubmit = async (code: string) => {
    // --- 4. BỔ SUNG ĐIỀU KIỆN KIỂM TRA BẮT BUỘC PHẢI CÓ id ---
    if (!lesson?.exercise_id || !id) return;

    // --- 5. TRUYỀN id VÀO LÀM THAM SỐ THỨ 2 CỦA HÀM ---
    await submitCode(lesson.exercise_id, id, code);
    // --------------------------------------------------

    setIsEditorOpen(false);
  };
  // -----------------------------

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      {/* CỘT TRÁI (65%) */}
      <div className="w-[65%] h-full overflow-y-auto border-r border-gray-100 flex flex-col scroll-smooth pb-[1000px]">
        <div className="pt-6 px-10">
          <button
            onClick={() => navigate('/roadmap')}
            className="text-gray-500 text-sm hover:text-[#1E3A8A] flex items-center gap-2 "
          >
            <span>←</span> Return to progress
          </button>
        </div>

        <div className="px-10 py-4 flex flex-col gap-4">
          <LessonContent data={lesson} />
          <hr className="border-gray-100 my-4" />
          {/* THAY ĐỔI 2: Truyền exercise_id từ lesson sang Widget mới */}
          {lesson.exercise_id && <ExerciseWidget exerciseId={lesson.exercise_id} />}

          {/* --- 4. RENDER SUBMISSION RESULT DỰA TRÊN DỮ LIỆU API --- */}
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
          {!isSubmitting && submitResult && <SubmissionResult data={submitResult} />}
          {/* -------------------------------------------------------- */}
        </div>
      </div>

      {/* CỘT PHẢI (35%) */}
      <div className="w-[35%] h-full">
        <SidePanel videoUrl={lesson.video_url} />
      </div>

      {/* --- PHẦN OVERLAY VÀ TOGGLE --- */}

      {/* Chỉ hiển thị nút ở góc dưới màn hình NẾU Editor đang đóng */}
      {!isEditorOpen && (
        <CodeToggleButton isOpen={isEditorOpen} onToggle={() => setIsEditorOpen(true)} />
      )}

      {/* --- 2. CẬP NHẬT TRUYỀN PROPS CHO CODE EDITOR --- */}
      {isEditorOpen && (
        <CodeEditor
          exerciseId={lesson?.exercise_id || ''}
          onClose={() => setIsEditorOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      {/* ------------------------------------------------ */}
    </div>
  );
};

export default LessonDetail;
