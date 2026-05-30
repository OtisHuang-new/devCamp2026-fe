import { useState } from 'react';
import SidePanel from './components/SidePanel';
import LessonContent from './components/LessonContent';
import ExerciseWidget from '../Exercise/components/ExerciseWidget';

// Import các phần mới
import CodeToggleButton from '../../shared/Buttons/CodeToggleButton';
import CodeEditor from '../../shared/CodeEditor';
import SubmissionResult from './components/SubmissionResult'; // Bạn hãy tạo file này dựa trên ảnh image_b3e6be.png

import { useParams } from 'react-router-dom'; // BỔ SUNG
import { useLesson } from './hooks/useLesson'; // BỔ SUNG
import { useNavigate } from 'react-router-dom'; // Thêm dòng này

const LessonDetail = () => {
  // Lấy ID từ URL (VD route của bạn là /lessons/:id)
  const { id } = useParams<{ id: string }>();

  // Gọi API
  const { lesson, isLoading } = useLesson(id);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate(); // Thêm dòng này

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

  const handleSubmit = () => {
    setIsEditorOpen(false); // Đóng editor
    setHasSubmitted(true); // Hiện kết quả chấm điểm
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      {/* CỘT TRÁI (65%) */}
      <div className="w-[65%] h-full overflow-y-auto border-r border-gray-100 flex flex-col scroll-smooth">
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

          {/* HIỂN THỊ KẾT QUẢ SAU KHI SUBMIT */}
          {hasSubmitted && <SubmissionResult />}
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

      {isEditorOpen && (
        <CodeEditor onClose={() => setIsEditorOpen(false)} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default LessonDetail;
