export interface LessonSection {
  id: number;
  subtitle?: string;
  content: string;
  listItems?: string[];
}

export interface LessonData {
  id: string;
  title: string;
  sections: LessonSection[];
  exercise: ExerciseData;
}

export const mockLessonData: LessonData = {
  id: 'python-intro-1',
  title: 'Lesson 1: What is Python & Its application',
  sections: [
    {
      id: 1,
      subtitle: 'What is Python?',
      content:
        'Python is a popular programming language. It was created by Guido van Rossum, and released in 1991. It is used for:',
      listItems: [
        'web development (server-side)',
        'software development',
        'mathematics',
        'system scripting',
      ],
    },
    {
      id: 2,
      subtitle: 'What can Python do?',
      content: '',
      listItems: [
        'Python can be used on a server to create web applications.',
        'Python can be used alongside software to create workflows.',
        'Python can connect to database systems. It can also read and modify files.',
        'Python can be used to handle big data and perform complex mathematics.',
        'Python can be used for rapid prototyping, or for production-ready software development.',
      ],
    },
    {
      id: 3,
      subtitle: 'Good to know',
      content: '',
      listItems: [
        'The most recent major version of Python is Python 3, which we shall be using in this tutorial.',
        'In this tutorial Python will be written in a text editor. It is possible to write Python in an Integrated Development Environment, such as Thonny, Pycharm, Netbeans or Eclipse which are particularly useful when managing larger collections of Python files.',
      ],
    },
    {
      id: 4,
      subtitle: 'Python Syntax so sánh với các ngôn ngữ khác',
      content: '',
      listItems: [
        'Python was designed for readability, and has some similarities to the English language with influence from mathematics.',
        'Python uses new lines to complete a command, as opposed to other programming languages which often use semicolons or parentheses.',
        'Python relies on indentation, using whitespace, to define scope; such as the scope of loops, functions and classes. Other programming languages often use curly-brackets for this purpose.',
      ],
    },
  ],
  exercise: {
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    description:
      'Given an integer array nums, return true if any value appears more than once in the array, otherwise return false.',
    examples: [
      { input: 'nums = [1, 2, 3, 3]', output: 'true' },
      { input: 'nums = [1, 2, 3, 4]', output: 'false' },
    ],
  } as ExerciseData,
};

// Thêm interface này vào src/features/LessonDetail/LessonData.ts
export interface ExerciseExample {
  input: string;
  output: string;
}

export interface ExerciseData {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: ExerciseExample[];
}
