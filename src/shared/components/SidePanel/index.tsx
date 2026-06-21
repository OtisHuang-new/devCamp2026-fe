// Vị trí: src/shared/components/SidePanel/index.tsx
import { AIChatbot } from './AIChatbot'; // Import xe mới lắp
import { getEmbeddableVideoUrl } from '@/shared/utils/videoUtils';

interface SidePanelProps {
  videoUrl?: string;
  lessonId?: string; // Bổ sung
  exerciseId?: string; // Bổ sung
}

export default function SidePanel({ videoUrl, lessonId, exerciseId }: SidePanelProps) {
  const embeddableUrl = getEmbeddableVideoUrl(videoUrl);

  const isInvalidVideo = !embeddableUrl || embeddableUrl.startsWith('www.demoVid.com');

  return (
    <div className="w-full h-full flex flex-col px-2 pt-3 gap-3 bg-primary/10">
      <div
        className={`w-full aspect-video rounded-[10px] overflow-hidden shadow-sm shrink-0 flex items-center justify-center ${
          isInvalidVideo ? 'bg-gray-300' : 'bg-black'
        }`}
      >
        {isInvalidVideo ? (
          <span className="text-gray-500 font-bold text-sm text-center px-4">
            Found no video in Database for this lesson
          </span>
        ) : (
          <iframe
            className="w-full h-full"
            // 4. SENIOR FIX: Truyền URL đã được convert vào src
            src={embeddableUrl}
            title="Lesson Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </div>

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
