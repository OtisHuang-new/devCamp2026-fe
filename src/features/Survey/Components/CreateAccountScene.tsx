import React from 'react';

interface CreateAccountSceneProps {
  mascotSrc: string;
  onCreateProfile: () => void;
  onMaybeLater: () => void;
}

const CreateAccountScene: React.FC<CreateAccountSceneProps> = ({
  mascotSrc,
  onCreateProfile,
  onMaybeLater,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white animate-fadeIn">
      <img src={mascotSrc} alt="Mascot yay" className="w-[180px] h-[180px] object-contain mb-8" />

      <h2 className="text-[28px] font-extrabold text-primary mb-3">
        Yayyy, It's time to create your own profile !
      </h2>

      <p className="text-gray-500 text-[16px] mb-10">
        create a profile to save your progress and help you to get personalize guidance
      </p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={onCreateProfile}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-[16px] py-3.5 rounded-full shadow-md transition-colors"
        >
          Creat a profile
        </button>

        <button
          onClick={onMaybeLater}
          className="w-full bg-white border-[2px] border-[#CBD5E1] text-[#94A3B8] hover:text-[#475569] font-bold text-[16px] py-3.5 rounded-full transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default CreateAccountScene;
