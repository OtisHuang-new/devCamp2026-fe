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
