import React from 'react';
import LessonButton from './LessonButton';
import { useNavigate } from 'react-router-dom';
import star_icon from '../Assets/star_icon_white.svg';
import cup_icon from '../Assets/cup_icon_white.svg';
import type { ThemeColor } from '../types/roadmapTypes';

export type NodeType = 'lesson' | 'project';
export type NodeStatus = 'completed' | 'current' | 'locked'; // BỔ SUNG DÒNG NÀY

export interface PathNode {
  id: string | number;
  type: NodeType;
  translateX: string; // VD: 'translate-x-10', '-translate-x-12' (tailwind class)
  title?: string; // BỔ SUNG DÒNG NÀY
  status?: NodeStatus; // BỔ SUNG DÒNG NÀY
  mascot?: {
    src: string;
    position: 'left' | 'right';
    size: number;
  };
}

interface ChapterProps {
  chapterNumber: number;
  chapterTitle: string;
  isFirstChapter?: boolean;
  nodes: PathNode[];
  isAuthenticated: boolean;
  onRequireAuth: () => void;
  theme: ThemeColor;
}

const Chapter: React.FC<ChapterProps> = ({
  chapterNumber,
  chapterTitle,
  isFirstChapter = false,
  nodes,
  isAuthenticated, // Nhận prop
  onRequireAuth, // Nhận prop
  theme,
}) => {
  const navigate = useNavigate(); // BỔ SUNG 2: Khởi tạo navigate

  const handleNodeClick = (nodeId: string | number, nodeType: NodeType) => {
    if (!isAuthenticated) {
      onRequireAuth(); // Chưa đăng nhập -> Gọi hàm mở Popup Đăng ký
    } else {
      // Đã đăng nhập -> Chuyển vào bài học hoặc bài tập tùy loại
      if (nodeType === 'project') {
        navigate(`/exercises/${nodeId}`);
      } else {
        navigate(`/lessons/${nodeId}`);
      }
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      {!isFirstChapter && (
        <div
          data-chapter-divider
          className="flex items-center justify-center my-8 gap-4 w-full opacity-60"
        >
          <hr className="flex-1 border-gray-300 border-[2px] border-solid" />
          <span className="text-gray-500 font-bold text-[16px] tracking-wide uppercase">
            Chapter {chapterNumber - 1}: {chapterTitle}
          </span>
          <hr className="flex-1 border-gray-300 border-[2px] border-solid" />
        </div>
      )}
      <div className={`flex flex-col items-center gap-[40px] ${isFirstChapter ? 'mt-8' : 'mt-4'}`}>
        {nodes.map((node) => {
          return (
            // 2. SENIOR FIX: Bọc relative và thêm hiệu ứng chuyển động mượt cho container
            <div
              key={node.id}
              id={`roadmap-node-${node.id}`}
              className={`relative flex justify-center items-center transition-transform duration-300 ${node.translateX}`}
            >
              {node.mascot && node.mascot.position === 'left' && (
                <img
                  src={node.mascot.src}
                  alt="Mascot"
                  // Bổ sung thuộc tính style, xóa sizeClass khỏi className
                  style={{ width: node.mascot.size, height: node.mascot.size }}
                  className="absolute right-full mr-32 top-1/2 -translate-y-1/2 object-contain pointer-events-none select-none z-0"
                />
              )}

              {/* Nút bấm Lesson/Project luôn nổi lên trên (z-10) */}
              <div className="relative z-10">
                {node.type === 'lesson' && (
                  <LessonButton
                    iconPath={star_icon}
                    title={node.title}
                    status={node.status}
                    onClick={() => handleNodeClick(node.id, node.type)}
                    theme={theme}
                  />
                )}

                {node.type === 'project' && (
                  <LessonButton
                    iconPath={cup_icon}
                    largerIcon={true}
                    title={node.title}
                    status={node.status}
                    onClick={() => handleNodeClick(node.id, node.type)}
                    theme={theme}
                  />
                )}
              </div>

              {node.mascot && node.mascot.position === 'right' && (
                <img
                  src={node.mascot.src}
                  alt="Mascot"
                  // Bổ sung thuộc tính style, xóa sizeClass khỏi className
                  style={{ width: node.mascot.size, height: node.mascot.size }}
                  className="absolute left-full ml-32 top-1/2 -translate-y-1/2 object-contain pointer-events-none select-none z-0"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chapter;
