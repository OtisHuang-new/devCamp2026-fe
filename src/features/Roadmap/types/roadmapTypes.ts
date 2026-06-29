import type { PathNode } from '../Components/Chapter';

export interface LessonData {
  _id: string;
  title: string;
  order: number;
}

export interface ProjectData {
  _id: string;
  title: string;
}

export interface ChapterDataAPI {
  _id: string;
  title: string;
  description: string;
  lessons: LessonData[];
  project_detail: ProjectData;
}

export interface ThemeColor {
  bg: string;
  shadow: string;
}

export interface TransformedChapter {
  id: string;
  chapterNumber: number;
  title: string;
  nodes: PathNode[];
  theme: ThemeColor;
}
