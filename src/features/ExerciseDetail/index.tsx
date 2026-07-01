import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExerciseDetail } from './hooks/useExerciseDetail';
import { ExerciseContent } from './components/ExerciseContent';

import SidePanel from '../../shared/components/SidePanel';
import CodeEditor from '../../shared/components/CodeEditor';
import SubmissionResult from '../../shared/components/SubmissionResult';
import CodeToggleButton from '../../shared/components/CodeEditor/components/Buttons/CodeToggleButton';

import { useSubmitCode } from '@/features/Exercise/hooks/useSubmitCode';
import { useSubmissionHistory } from '@/features/Exercise/hooks/useSubmissionHistory';
import { useSyncEditorStore } from '../Exercise/hooks/useSyncEditorStore';
import { TestCaseList } from '../Exercise/components/TestCaseList';

import { LoadingSpinner } from '@/shared/components/Loading/LoadingSpinner';
import { TextSelectionPopover } from '@/shared/components/TextSelectionPopover';

import { Return } from '@/shared/components/Return';
import { useEditorStore } from '@/shared/store/useEditorStore';

export function ExerciseDetail() {
  const navigate = useNavigate();
  const { exerciseDetail, isLoading } = useExerciseDetail();

  useSyncEditorStore(exerciseDetail);
  const isEditorOpen = useEditorStore((state) => state.isOpen);
  const setIsEditorOpen = useEditorStore((state) => state.setIsOpen);
  const toggleEditorOpen = useEditorStore((state) => state.toggleOpen);

  const {
    submitCode,
    isSubmitting,
    error: submitError,
    justSubmittedId,
  } = useSubmitCode(exerciseDetail?._id);

  const { history, selectedIndex, setSelectedIndex, fetchHistory } = useSubmissionHistory(
    exerciseDetail?._id,
  );

  // 3. EFFECT: Phím tắt đóng/mở Editor (Giống hệt LessonDetail)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        toggleEditorOpen(); // Sử dụng hàm toggle từ Store
      }
      if (e.key === 'Escape') {
        setIsEditorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsEditorOpen, toggleEditorOpen]);

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
        Loanding exercise...
      </div>
    );
  }

  if (!exerciseDetail) {
    return (
      <div className="flex justify-center items-center h-screen font-bold text-red-500 bg-gray-50">
        Cant find exercise!
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
          <Return text="Return to exercises" />
        </div>

        <div className="px-10 py-4 flex flex-col gap-3">
          <ExerciseContent data={exerciseDetail} />

          {exerciseDetail && (
            <div className="mt-2">
              <TestCaseList testCases={exerciseDetail.test_cases} />
            </div>
          )}

          <hr className="border-gray-100 my-1" />

          {/* THAY THẾ CHỖ NÀY */}
          {isSubmitting && (
            <div className="w-full py-10">
              <LoadingSpinner
                text="Đang chấm điểm testcases..."
                iconSize="w-8 h-8"
                textColor="text-gray-500"
              />
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
              latestSubmitId={justSubmittedId}
            />
          )}
        </div>
      </div>

      {/* CỘT PHẢI: AI Assistant */}
      <div className="w-[35%] h-full">
        <SidePanel
          lessonId={exerciseDetail.lesson_id}
          exerciseId={exerciseDetail._id}
          // 1. BỔ SUNG: Báo cho SidePanel biết ẩn khu vực Video đi
          hideVideo={true}
        />
      </div>

      {/* --- CÁC COMPONENT NỔI (ABSOLUTE/FIXED) BÊN NGOÀI LAYOUT CHÍNH --- */}

      {!isEditorOpen && (
        <CodeToggleButton
          isOpen={isEditorOpen}
          onToggle={() => setIsEditorOpen(true)}
          // 1. SENIOR FIX: Chỉ cần không có lịch sử nộp là kích hoạt ngay
          showHintBubble={history.length === 0}
        />
      )}

      {/* Bảng Code Editor (Chỉ hiện khi isEditorOpen === true) */}
      <div className={isEditorOpen ? 'block' : 'hidden'}>
        <CodeEditor
          exerciseId={exerciseDetail._id}
          onClose={() => setIsEditorOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>

      <TextSelectionPopover />
    </div>
  );
}
