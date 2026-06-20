import React from 'react';
import LessonButton from './LessonButton';
import { useNavigate } from 'react-router-dom';
import star_icon from '../Assets/star_icon_white.svg';
import cup_icon from '../Assets/cup_icon_white.svg';
import treasure_icon from '../Assets/treasure_icon_prime.svg';

export type NodeType = 'lesson' | 'treasure' | 'project';
export type NodeStatus = 'completed' | 'current' | 'locked'; // BỔ SUNG DÒNG NÀY

export interface PathNode {
  id: string | number;
  type: NodeType;
  translateX: string; // VD: 'translate-x-10', '-translate-x-12' (tailwind class)
  title?: string; // BỔ SUNG DÒNG NÀY
  status?: NodeStatus; // BỔ SUNG DÒNG NÀY
}

interface ChapterProps {
  chapterNumber: number;
  chapterTitle: string;
  isFirstChapter?: boolean;
  nodes: PathNode[];
}

interface ChapterProps {
  chapterNumber: number;
  chapterTitle: string;
  isFirstChapter?: boolean;
  nodes: PathNode[];
  // --- 2. BỔ SUNG 2 DÒNG NÀY ---
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

const Chapter: React.FC<ChapterProps> = ({
  chapterNumber,
  chapterTitle,
  isFirstChapter = false,
  nodes,
  isAuthenticated, // Nhận prop
  onRequireAuth, // Nhận prop
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
        <div className="flex items-center justify-center my-8 gap-4 w-full opacity-60">
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
            <div
              key={node.id}
              id={`roadmap-node-${node.id}`}
              className={node.translateX}
              {...(node.type === 'project' ? { 'data-project-marker': chapterTitle } : {})}
            >
              {node.type === 'lesson' && (
                <LessonButton
                  iconPath={star_icon}
                  title={node.title}
                  status={node.status}
                  // 2. SENIOR FIX: Truyền thêm node.type
                  onClick={() => handleNodeClick(node.id, node.type)}
                />
              )}

              {node.type === 'treasure' && (
                <div className="">
                  {node.status === 'current' ? (
                    <img
                      src={treasure_icon}
                      alt="Treasure"
                      className="w-[160px] cursor-pointer hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div
                      className={`w-[160px] aspect-[4/3] ${node.status === 'completed' ? 'bg-[#6D7EAE]' : 'bg-[#898989]'}`}
                      style={{
                        WebkitMaskImage: `url(${treasure_icon})`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskPosition: 'center',
                        WebkitMaskRepeat: 'no-repeat',
                        maskImage: `url(${treasure_icon})`,
                        maskSize: 'contain',
                        maskPosition: 'center',
                        maskRepeat: 'no-repeat',
                      }}
                    />
                  )}
                </div>
              )}

              {node.type === 'project' && (
                <LessonButton
                  iconPath={cup_icon}
                  largerIcon={true}
                  title={node.title}
                  status={node.status}
                  // 2. SENIOR FIX: Truyền thêm node.type
                  onClick={() => handleNodeClick(node.id, node.type)}
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
