import axios from 'axios';
import type { ChapterDataAPI } from '../types/roadmapTypes';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const roadmapApi = {
  getRoadmap: async (): Promise<ChapterDataAPI[]> => {
    const response = await axios.get(`${BASE_URL}/chapters/roadmap`);

    return response.data;
  },
};
