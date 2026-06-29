// Định nghĩa các type để hỗ trợ TypeScript chặt chẽ
export type LayoutType = 'grid-nx1' | 'grid-nx2';

export interface Option {
  id: string;
  text: string;
}

export interface QuestionData {
  id: string;
  progress: number;
  botText: string;
  layout: LayoutType;
  options: Option[];
}

// Mảng chứa toàn bộ kịch bản của Survey
export const surveyQuestions: QuestionData[] = [
  {
    id: 'q1_job',
    progress: 0.2, // 20%
    botText: 'Okey before starting, first question! What is your Job?',
    layout: 'grid-nx2',
    options: [
      { id: 'job_1', text: 'Accountant' },
      { id: 'job_2', text: 'Marketing' },
      { id: 'job_3', text: 'Software Engineer' },
      { id: 'job_4', text: 'Designer' },
      { id: 'job_5', text: 'Teacher' },
      { id: 'job_6', text: 'Other' },
    ],
  },
  {
    id: 'q2_level',
    progress: 0.6, // 60%
    botText: 'Great! How would you describe your current programming level?',
    layout: 'grid-nx1',
    options: [
      { id: 'lvl_1', text: 'Complete Beginner (No prior experience)' },
      { id: 'lvl_2', text: 'Basic (Understand basic syntax)' },
      { id: 'lvl_3', text: 'Intermediate (Can build small projects)' },
      { id: 'lvl_4', text: 'Advanced (Professional experience)' },
      { id: 'lvl_5', text: 'Expert (Mastery in multiple stacks)' },
    ],
  },
  {
    id: 'q3_time',
    progress: 0.8, // 80%
    botText: 'Almost done! How much free time can you spend to learning code each week?',
    layout: 'grid-nx1',
    options: [
      { id: 'time_1', text: 'Less than 2 hours/week' },
      { id: 'time_2', text: '2 - 5 hours/week' },
      { id: 'time_3', text: '5 - 10 hours/week' },
      { id: 'time_4', text: '10 - 20 hours/week' },
      { id: 'time_5', text: 'More than 20 hours/week' },
    ],
  },
];
