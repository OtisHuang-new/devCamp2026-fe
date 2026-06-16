// Vị trí: src/shared/components/SidePanel/index.tsx
import { AIChatbot } from './AIChatbot'; // Import xe mới lắp

interface SidePanelProps {
  videoUrl?: string;
  lessonId?: string; // Bổ sung
  exerciseId?: string; // Bổ sung
}

export default function SidePanel({ videoUrl, lessonId, exerciseId }: SidePanelProps) {
  return (
    <div className="w-full h-full flex flex-col px-2 pt-3 gap-3 bg-primary/10">
      {/* KHỐI VIDEO GIỮ NGUYÊN */}
      {videoUrl && (
        <div className="w-full aspect-video rounded-[10px] overflow-hidden shadow-sm bg-black shrink-0">
          <iframe
            className="w-full h-full"
            src={videoUrl}
            title="Lesson Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* KHỐI CHAT */}
      <div className="pl-2 pr-0 py-2 mb-3 flex-1 flex flex-col bg-white border border-primary/20 rounded-[10px] shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-white px-2 shadow-[0px_5px_10px_3px_rgba(255,255,255,1)] z-10">
          <h3 className="font-bold text-[#1E3A8A] pb-2">AI Assistant</h3>
        </div>

        {/* SENIOR UPDATE: Ép kiểu boolean bằng 2 dấu !!. Nếu có videoUrl => true, không có => false */}
        <div className="flex-1 overflow-hidden relative">
          <AIChatbot lessonId={lessonId} exerciseId={exerciseId} isCompact={!!videoUrl} />
        </div>
      </div>
    </div>
  );
}
