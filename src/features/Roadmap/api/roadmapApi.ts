import axios from 'axios';
import type { ChapterDataAPI } from '../types/roadmapTypes';

// Dùng chung base URL với backend của bạn
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const roadmapApi = {
  // Vẫn giữ params ở function để không lỗi file useRoadmap,
  // chuẩn bị sẵn cho tương lai
  getRoadmap: async (): Promise<ChapterDataAPI[]> => {
    // Tạm thời bỏ object { params: { page, limit } } ra khỏi API call
    const response = await axios.get(`${BASE_URL}/chapters/roadmap`);

    return response.data;
  },
};
