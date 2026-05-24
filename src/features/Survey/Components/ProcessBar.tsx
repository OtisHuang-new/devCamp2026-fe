interface ProcessBarProps {
  progress: number; // Nhận giá trị từ 0 đến 1 (ví dụ: 0.3)
}

function ProcessBar({ progress }: ProcessBarProps) {
  // Đảm bảo giá trị luôn nằm trong khoảng 0 - 1 để tránh lỗi UI
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = clampedProgress * 100;

  return (
    // Thanh nền màu xám nhạt
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex-1">
      {/* Thanh tiến độ màu xanh đậm chạy bên trong */}
      <div
        className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default ProcessBar;
