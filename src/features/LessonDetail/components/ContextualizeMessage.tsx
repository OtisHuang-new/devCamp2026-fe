import React from 'react';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { useLessonContext } from '../hooks/useLessonContext';
import bot_showing from '../../../shared/Assets/Mascots/bot_showing.svg';
import bot_wrong from '../../../shared/Assets/Mascots/bot_wrong.svg';

interface ContextualizeMessageProps {
  lessonId: string;
}

const ContextualizeMessage: React.FC<ContextualizeMessageProps> = ({ lessonId }) => {
  const { user } = useAuthContext();
  const { context, isLoading, error } = useLessonContext(lessonId, user?._id);

  if (!user?._id) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 bg-blue-50/50 border border-blue-100 rounded-xl p-4 my-2 animate-pulse w-full">
        <img src={bot_showing} alt="AI Bot" className="w-12 h-12 opacity-50 shrink-0" />
        <span className="text-[#1E3A8A] font-medium italic text-[15px]">
          AI is analyzing the meaning impact of this lesson to your background...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4 bg-red-50/80 border border-red-200 rounded-xl p-4 my-2 shadow-sm animate-fadeIn w-full">
        <img src={bot_wrong} alt="AI Bot Error" className="w-12 h-12 shrink-0" />
        <p className="text-red-500 font-extrabold text-[15px]">{error}</p>
      </div>
    );
  }

  if (!context) return null;

  return (
    <div className="flex items-start gap-4 bg-blue-50/80 border border-blue-200 rounded-xl p-4 my-2 shadow-sm animate-fadeIn w-full">
      <img src={bot_showing} alt="AI Bot" className="w-12 h-12 shrink-0 mt-1" />
      <p className="text-slate-700 leading-relaxed font-medium text-[15px]">{context}</p>
    </div>
  );
};

export default ContextualizeMessage;
