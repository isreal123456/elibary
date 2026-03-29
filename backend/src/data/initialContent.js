export const initialCourses = [
  {
    title: 'React Fundamentals',
    description:
      'Build modern interfaces using components, hooks, and clean state management patterns.',
    category: 'Frontend',
    thumbnail:
      'https://placehold.co/800x500/e2e8f0/334155?text=React+Fundamentals',
    featured: true,
    instructorName: 'Aisha Bello',
    modules: [
      {
        title: 'Week 1: Components and JSX',
        description:
          'Understand JSX syntax, component composition, and reusable UI blocks.',
        lessons: ['JSX syntax', 'Component props', 'Reusable UI patterns'],
        videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
        pdfUrl:
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        title: 'Week 2: State and Events',
        description:
          'Learn local state updates, event handling, and data flow between parent and child components.',
        lessons: ['useState basics', 'Event handling', 'State lifting'],
        videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0',
        pdfUrl:
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
  {
    title: 'JavaScript Core',
    description:
      'Master the language essentials needed for modern frontend development.',
    category: 'Programming',
    thumbnail:
      'https://placehold.co/800x500/e2e8f0/334155?text=JavaScript+Core',
    featured: true,
    instructorName: 'Ibrahim Yusuf',
    modules: [
      {
        title: 'Week 1: Variables, Types, and Functions',
        description:
          'Build confidence with JavaScript syntax, scope, and function basics.',
        lessons: ['Primitive types', 'Function expressions', 'Scope rules'],
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        pdfUrl:
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
];

export const initialResources = [
  {
    title: 'React Hooks Quick Notes',
    category: 'Frontend',
    type: 'PDF',
    fileUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdByName: 'Platform Admin',
  },
  {
    title: 'REST API Cheat Sheet',
    category: 'Backend',
    type: 'PDF',
    fileUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdByName: 'Platform Admin',
  },
];

export const initialAssessments = [
  {
    title: 'React Basics Quiz',
    description: 'Check understanding of JSX and component patterns.',
    courseTitle: 'React Fundamentals',
    moduleTitle: 'Week 1: Components and JSX',
    type: 'quiz',
    fileUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'react-basics-quiz.pdf',
    createdByName: 'Aisha Bello',
    questions: [
      {
        type: 'mcq',
        question: 'Which hook is used for local state?',
        options: ['useMemo', 'useState', 'useEffect', 'useContext'],
        correctAnswer: 'useState',
      },
      {
        type: 'text',
        question: 'JSX stands for?',
        correctAnswer: 'JavaScript XML',
      },
    ],
  },
];
