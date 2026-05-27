import React from 'react';
import LessonButton from './LessonButton';
import { useNavigate } from 'react-router-dom'; // BỔ SUNG 1: Import hook chuyển trang

// Import Assets
import star_icon from '../Assets/star_icon_white.svg';
import cup_icon from '../Assets/cup_icon_white.svg';
import treasure_icon from '../Assets/treasure_icon_prime.svg';

// 1. Định nghĩa các loại Node có thể xuất hiện trên đường đi
export type NodeType = 'lesson' | 'treasure' | 'project';
export type NodeStatus = 'completed' | 'current' | 'locked'; // BỔ SUNG DÒNG NÀY

export interface PathNode {
  id: string | number;
  type: NodeType;
  translateX: string; // VD: 'translate-x-10', '-translate-x-12' (tailwind class)
  title?: string; // BỔ SUNG DÒNG NÀY
  status?: NodeStatus; // BỔ SUNG DÒNG NÀY
}

// 2. Định nghĩa Props cho Component Chapter
interface ChapterProps {
  chapterNumber: number;
  chapterTitle: string;
  isFirstChapter?: boolean;
  nodes: PathNode[];
}

// 2. Định nghĩa Props cho Component Chapter
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

  // --- 3. BỔ SUNG: Hàm kiểm tra Auth trước khi chuyển trang ---
  const handleNodeClick = (nodeId: string | number) => {
    if (!isAuthenticated) {
      onRequireAuth(); // Chưa đăng nhập -> Gọi hàm mở Popup Đăng ký
    } else {
      navigate(`/lessons/${nodeId}`); // Đã đăng nhập -> Chuyển vào bài học
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* --- HEADER PHÂN CÁCH CHAPTER --- */}
      {/* Chỉ hiển thị Header ngăn cách nếu KHÔNG phải là Chapter đầu tiên */}
      {!isFirstChapter && (
        <div className="flex items-center justify-center my-8 gap-4 w-full opacity-60">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 font-bold text-sm tracking-wide uppercase">
            Chapter {chapterNumber}: {chapterTitle}
          </span>
          <hr className="flex-1 border-gray-300" />
        </div>
      )}

      {/* --- ROADMAP PATH CHO CHAPTER NÀY --- */}
      {/* Thêm mt-8 cho chapter đầu tiên để nó không dính chặt lên trên, các chapter sau thì dùng margin mặc định */}
      <div className={`flex flex-col items-center gap-8 ${isFirstChapter ? 'mt-8' : 'mt-4'}`}>
        {nodes.map((node) => {
          return (
            <div
              key={node.id}
              className={node.translateX}
              {...(node.type === 'project' ? { 'data-project-marker': chapterTitle } : {})}
            >
              {/* Nếu là bài học bình thường (Ngôi sao) */}
              {node.type === 'lesson' && (
                <LessonButton
                  iconPath={star_icon}
                  title={node.title}
                  status={node.status} // BỔ SUNG DÒNG NÀY
                  onClick={() => handleNodeClick(node.id)}
                />
              )}

              {/* Nếu là rương kho báu */}
              {node.type === 'treasure' && (
                <div className="my-2">
                  {node.status === 'current' ? (
                    // CẬP NHẬT: Chapter hiện tại -> Hiện ảnh gốc sáng màu
                    <img
                      src={treasure_icon}
                      alt="Treasure"
                      className="w-[160px] cursor-pointer hover:scale-110 transition-transform"
                    />
                  ) : (
                    // CẬP NHẬT: Chapter cũ (completed) hoặc tương lai (locked) -> Phủ màu
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

              {/* Nếu là Project (Cúp) */}
              {node.type === 'project' && (
                <LessonButton
                  iconPath={cup_icon}
                  largerIcon={true}
                  title={node.title}
                  status={node.status} // BỔ SUNG DÒNG NÀY
                  onClick={() => handleNodeClick(node.id)}
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
