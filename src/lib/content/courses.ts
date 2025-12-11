export interface Chapter {
  id: string; 
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  challenges: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: 'js' | 'python' | 'web';
  totalChapters: number;
  chapters: Chapter[];
}

export const COURSES: Course[] = [
  {
    id: 'js-path',
    title: 'JavaScript Mastery',
    description: 'Kuasai bahasa #1 web. Dari variabel dasar hingga Functional Programming.',
    icon: 'js',
    totalChapters: 6,
    chapters: [
      {
        id: 'js-basics',
        title: 'Fundamentals',
        description: 'Variables, Data Types, dan Operators.',
        level: 'Beginner',
        challenges: ['js-var-01-easy', 'js-var-02-medium', 'js-var-03-hard', 'js-operators-easy-01', 'js-operators-medium-01', 'js-operators-hard-01']
      },
      {
        id: 'js-control',
        title: 'Control Flow',
        description: 'Logic Conditionals dan Looping.',
        level: 'Beginner',
        challenges: ['js-conditionals-easy-01', 'js-conditionals-medium-01', 'js-loops-easy-01', 'js-loops-medium-01']
      },
      {
        id: 'js-func',
        title: 'Functions',
        description: 'Reusable code block & Arrow Functions.',
        level: 'Intermediate',
        challenges: ['js-functions-easy-01', 'js-functions-medium-02', 'js-functions-hard-01']
      },
      {
        id: 'js-struct',
        title: 'Data Structures',
        description: 'Arrays, Objects, dan manipulasi data.',
        level: 'Intermediate',
        challenges: ['js-arrays-easy-01', 'js-objects-easy-01', 'struct-easy-01', 'struct-med-01']
      },
      {
        id: 'js-algo',
        title: 'Algorithms',
        description: 'Searching, Sorting, dan String Logic.',
        level: 'Advanced',
        challenges: ['algo-search-easy-01', 'logic-str-easy-01', 'algo-sort-med-01', 'logic-recursion-hard-01']
      },
      {
        id: 'js-fp',
        title: 'Functional Programming',
        description: 'Higher Order Functions dan Immutability.',
        level: 'Advanced',
        challenges: ['js-hof-easy-01', 'fp-easy-01', 'fp-med-01', 'fp-hof-hard-02']
      }
    ]
  },
  {
    id: 'python-path',
    title: 'Python for Data Science',
    description: 'Belajar analisis data dan automation dengan Python.',
    icon: 'python',
    totalChapters: 4,
    chapters: [
        { 
            id: 'py-basics', 
            title: 'Python Syntax', 
            description: 'Indentasi, Variables, dan Tipe Data.', 
            level: 'Beginner',
            challenges: ['py-basics-easy-01', 'py-basics-easy-02', 'py-basics-medium-01'] 
        },
        { 
            id: 'py-loops', 
            title: 'Loops & Logic', 
            description: 'Perulangan dan pengambilan keputusan.', 
            level: 'Beginner',
            challenges: ['py-loops-easy-01', 'py-loops-easy-02', 'py-loops-hard-01'] 
        },
        { 
            id: 'py-funcs', 
            title: 'Functions & Modules', 
            description: 'Membuat fungsi dan import module math.', 
            level: 'Intermediate',
            challenges: ['py-func-easy-01', 'py-modules-easy-01', 'py-modules-hard-01'] 
        },
        { 
            id: 'py-struct', 
            title: 'Data Structures', 
            description: 'List, Tuple, dan Dictionary.', 
            level: 'Advanced',
            challenges: ['py-struct-easy-01', 'py-struct-easy-02', 'py-struct-hard-01'] 
        }
    ]
  },
  {
    id: 'web-path',
    title: 'Web Foundation',
    description: 'Pondasi internet. HTML5 Semantic dan CSS3 Box Model.',
    icon: 'web',
    totalChapters: 2,
    chapters: [
        {
            id: 'web-html',
            title: 'HTML Structure',
            description: 'Membuat kerangka website.',
            level: 'Beginner',
            challenges: ['web-html-easy-01', 'web-html-med-01', 'web-html-hard-01']
        },
        {
            id: 'web-css',
            title: 'CSS Styling',
            description: 'Menghias tampilan website.',
            level: 'Intermediate',
            challenges: ['web-css-easy-01', 'web-css-med-01', 'web-css-hard-01']
        }
    ]
  }
];