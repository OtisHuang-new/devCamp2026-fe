import React from 'react';

interface GreetingSceneProps {
  mascotSrc: string;
  message: string;
  onNext: () => void;
}

const GreetingScene: React.FC<GreetingSceneProps> = ({ mascotSrc, message, onNext }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
        {/* Bubble Chat */}
        <div className="relative translate-y-[80px]">
          <div className="bg-gray-200 px-6 py-4  rounded-lg shadow-sm ">
            <span className="text-gray-800 text-[18px] font-medium">{message}</span>
          </div>
          {/* Mũi nhọn của bong bóng chat */}
          <div className="absolute w-4 h-4 bg-gray-200 transform rotate-45 left-1/2 -bottom-2 -translate-x-1/2 rounded-sm" />
        </div>

        {/* Mascot */}
        <img src={mascotSrc} alt="Mascot greeting" className="w-[390px] h-[390px] object-contain" />
      </div>

      {/* Footer chứa nút Continue (căn góc phải dưới) */}
      <div className="w-full border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-8 py-6 flex justify-end">
          <button
            onClick={onNext}
            className="bg-[#1E3A8A] hover:bg-[#112255] text-white font-semibold text-[18px] px-9 py-[12px] rounded-[15px] transition-colors duration-200 cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingScene;
