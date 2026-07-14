interface MobileBlockerProps {
  isOpen: boolean;
}

export default function MobileBlocker({ isOpen }: MobileBlockerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex justify-center items-center p-4 font-sans animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-white rounded-[12px] shadow-2xl p-6 text-center border border-gray-100 flex flex-col items-center gap-4">
        {/* Icon */}
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-3xl animate-bounce">
          💻
        </div>

        {/* Tiêu đề & Nội dung tiếng Anh */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-extrabold text-[#1E3A8A]">Desktop Only Access</h2>
          <p className="text-gray-600 text-sm font-medium leading-relaxed">
            Our learning platform and exercises are currently not optimized for mobile devices.
            Please switch to a <span className="font-bold text-[#1E3A8A]">Laptop</span> or{' '}
            <span className="font-bold text-[#1E3A8A]">Desktop PC</span> for the best experience!
          </p>
        </div>

        {/* Đường kẻ trang trí */}
        <div className="w-full h-[1px] bg-gray-100 my-1"></div>

        {/* Badge trạng thái */}
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          Mobile access restricted
        </span>
      </div>
    </div>
  );
}
