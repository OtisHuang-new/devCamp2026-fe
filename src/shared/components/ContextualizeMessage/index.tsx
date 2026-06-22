// Vị trí: src/shared/components/ContextualizeMessage/index.tsx
import { useAuthContext_v2 } from '../../context/hooks/useAuthContext_v2';
import { useAIContext } from '../../hooks/useAIContext';
import type { ContextType } from '../../hooks/useAIContext';

import bot_showing from '../../Assets/Mascots/bot_showing.svg';
import bot_wrong from '../../Assets/Mascots/bot_wrong.svg';

interface ContextualizeMessageProps {
  itemId: string;
  type: ContextType; // Bắt buộc truyền type ('lesson', 'exercise', 'project')
}

export function ContextualizeMessage({ itemId, type }: ContextualizeMessageProps) {
  const { user } = useAuthContext_v2();
  const { context, isLoading, error } = useAIContext(itemId, user?._id, type);

  if (!user?._id) return null;

  // Luôn luôn có thẻ <h3> ở mọi trạng thái để Layout không bị giật (nhảy khung)
  const titleUI = (
    <h3 className="text-[#1E3A8A] font-bold text-lg mb-1">What is the meaning of this {type}?</h3>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 bg-blue-50/50 border border-blue-100 rounded-xl p-4 my-2 animate-pulse w-full">
        {titleUI}
        <div className="flex items-center gap-4">
          <img src={bot_showing} alt="AI Bot" className="w-12 h-12 opacity-50 shrink-0" />
          <span className="text-[#1E3A8A] font-medium italic text-[15px]">
            AI is analyzing the meaning impact of this {type} to your background...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 bg-red-50/80 border border-red-200 rounded-xl p-4 my-2 shadow-sm animate-fadeIn w-full">
        {titleUI}
        <div className="flex items-center gap-4">
          <img src={bot_wrong} alt="AI Bot Error" className="w-12 h-12 shrink-0" />
          <p className="text-red-500 font-extrabold text-[15px]">{error}</p>
        </div>
      </div>
    );
  }

  if (!context) return null;

  return (
    <div className="flex flex-col gap-2 bg-blue-50/80 border border-blue-200 rounded-xl p-4 my-2 shadow-sm animate-fadeIn w-full">
      {titleUI}
      <div className="flex items-start gap-4">
        <img src={bot_showing} alt="AI Bot" className="w-12 h-12 shrink-0 mt-1" />
        <p className="text-slate-700 leading-relaxed font-medium text-[15px]">{context}</p>
      </div>
    </div>
  );
}
