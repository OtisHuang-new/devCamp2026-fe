// Vị trí: src/shared/components/ContextualizeMessage/index.tsx
import { useAuthContext_v2 } from '../../context/hooks/useAuthContext_v2';
import { useAIContext } from '../../hooks/useAIContext';
import type { ContextType } from '../../hooks/useAIContext';
import { AIFeatureBox } from '../AIFeatureBox'; // <-- MỚI: Import vỏ bọc AI
import { MarkdownRender } from '../MarkdownRender';

import bot_showing from '../../Assets/Mascots/bot_showing.svg';
import bot_wrong from '../../Assets/Mascots/bot_wrong.svg';

interface ContextualizeMessageProps {
  itemId: string;
  type: ContextType;
}

export function ContextualizeMessage({ itemId, type }: ContextualizeMessageProps) {
  const { user } = useAuthContext_v2();
  const { context, isLoading, error } = useAIContext(itemId, user?._id, type);

  if (!user?._id) return null;

  const title = `What is the meaning of this ${type}?`;

  if (isLoading) {
    return (
      <AIFeatureBox
        title={title}
        variant="loading"
        icon={<img src={bot_showing} alt="AI Bot" className="w-12 h-12 opacity-50 shrink-0" />}
      >
        <span className="text-[#1E3A8A] font-medium italic text-[15px]">
          AI is analyzing the meaning impact of this {type} to your background...
        </span>
      </AIFeatureBox>
    );
  }

  if (error) {
    return (
      <AIFeatureBox
        title={title}
        variant="error"
        icon={<img src={bot_wrong} alt="AI Bot Error" className="w-12 h-12 shrink-0" />}
      >
        <p className="text-red-500 font-extrabold text-[15px]">{error}</p>
      </AIFeatureBox>
    );
  }

  if (!context) return null;

  return (
    <AIFeatureBox
      title={title}
      variant="default"
      icon={<img src={bot_showing} alt="AI Bot" className="w-12 h-12 shrink-0 mt-1" />}
    >
      <MarkdownRender
        content={context}
        className="text-slate-700 leading-relaxed font-medium text-[15px]"
      />
    </AIFeatureBox>
  );
}
