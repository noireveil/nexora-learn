export interface Chapter {
  id: string; 
  title: string;
  description: string;
  challenges: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: 'js' | 'python' | 'web';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalChapters: number;
  chapters: Chapter[];
}

export const COURSES: Course[] = [
  {
    id: 'js-path',
    title: 'JavaScript Mastery',
    description: 'Kuasai bahasa pemrograman #1 di dunia. Dari variabel hingga async/await.',
    icon: 'js',
    level: 'Beginner',
    totalChapters: 12,
    chapters: [
      {
        id: 'js-basics',
        title: 'Fundamentals',
        description: 'Variables, Data Types, dan Operators.',
        challenges: ['js-var-01', 'js-var-02']
      },
      {
        id: 'js-control',
        title: 'Control Flow',
        description: 'Conditionals (If/Else) dan Loops.',
        challenges: ['js-loop-01', 'js-loop-02']
      }
    ]
  },
  {
    id: 'python-path',
    title: 'Python for Data Science',
    description: 'Belajar analisis data dan automation dengan Python.',
    icon: 'python',
    level: 'Beginner',
    totalChapters: 10,
    chapters: [
        // Placeholder chapters
        { id: 'py-basics', title: 'Python Syntax', description: 'Indentasi dan Variables', challenges: [] }
    ]
  },
  {
    id: 'web-path',
    title: 'Responsive Web Design',
    description: 'Bangun website modern dengan HTML5 & CSS3.',
    icon: 'web',
    level: 'Intermediate',
    totalChapters: 8,
    chapters: []
  }
];