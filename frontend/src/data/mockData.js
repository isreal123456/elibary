export const courses = [
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    instructor: "Aisha Bello",
    description:
      "Build modern interfaces using components, hooks, and clean state management patterns.",
    category: "Frontend",
    thumbnail:
      "https://placehold.co/800x500/e2e8f0/334155?text=React+Fundamentals",
    featured: true,
    modules: [
      {
        id: "rf-week-1",
        title: "Week 1: Components and JSX",
        description:
          "Understand JSX syntax, component composition, and reusable UI blocks.",
        lessons: ["JSX syntax", "Component props", "Reusable UI patterns"],
        videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: "rf-week-2",
        title: "Week 2: State and Events",
        description:
          "Learn local state updates, event handling, and data flow between parent and child components.",
        lessons: ["useState basics", "Event handling", "State lifting"],
        videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: "rf-week-3",
        title: "Week 3: Hooks and Effects",
        description:
          "Use hooks to manage lifecycle and side effects while keeping components simple.",
        lessons: ["Effect lifecycle", "Dependencies", "Cleanup patterns"],
        videoUrl: "https://www.youtube.com/embed/TNhaISOUy6Q",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    id: "javascript-core",
    title: "JavaScript Core",
    instructor: "Ibrahim Yusuf",
    description:
      "Master the language essentials needed for modern frontend development.",
    category: "Programming",
    thumbnail:
      "https://placehold.co/800x500/e2e8f0/334155?text=JavaScript+Core",
    featured: true,
    modules: [
      {
        id: "js-week-1",
        title: "Week 1: Variables, Types, and Functions",
        description:
          "Build confidence with JavaScript syntax, scope, and function basics.",
        lessons: ["Primitive types", "Function expressions", "Scope rules"],
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: "js-week-2",
        title: "Week 2: Arrays and Objects",
        description:
          "Work with structured data and iterate effectively using built-in methods.",
        lessons: ["Array methods", "Object access", "Data transformations"],
        videoUrl: "https://www.youtube.com/embed/R8rmfD9Y5-c",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    id: "ui-ux-principles",
    title: "UI/UX Principles",
    instructor: "Aisha Bello",
    description:
      "Design readable, user-focused interfaces using hierarchy, spacing, and consistency.",
    category: "Design",
    thumbnail: "https://placehold.co/800x500/e2e8f0/334155?text=UI%2FUX+Principles",
    featured: true,
    modules: [
      {
        id: "ux-week-1",
        title: "Week 1: Visual Hierarchy",
        description:
          "Apply typography scale, spacing systems, and content structure to guide users.",
        lessons: ["Typography scale", "Spacing rhythm", "Content hierarchy"],
        videoUrl: "https://www.youtube.com/embed/_Hp_dI0DzY4",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: "ux-week-2",
        title: "Week 2: Accessibility Basics",
        description:
          "Design for contrast, keyboard navigation, and inclusive interaction patterns.",
        lessons: ["Color contrast", "Keyboard flow", "Semantic HTML"],
        videoUrl: "https://www.youtube.com/embed/20SHvU2PKsM",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    id: "api-integration",
    title: "API Integration for Frontend",
    instructor: "Ibrahim Yusuf",
    description:
      "Fetch and display remote data cleanly with loading, error, and empty states.",
    category: "Frontend",
    thumbnail:
      "https://placehold.co/800x500/e2e8f0/334155?text=API+Integration",
    featured: false,
    modules: [
      {
        id: "api-week-1",
        title: "Week 1: HTTP Basics",
        description:
          "Understand request/response flow, JSON payloads, and status handling.",
        lessons: ["REST fundamentals", "Request methods", "Status codes"],
        videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
]

export const resources = [
  {
    id: "res-1",
    title: "React Hooks Quick Notes",
    category: "Frontend",
    type: "PDF",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "res-2",
    title: "JavaScript Arrays Practice",
    category: "Programming",
    type: "Exercises",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "res-3",
    title: "UX Case Study Template",
    category: "Design",
    type: "Slides",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "res-4",
    title: "REST API Cheat Sheet",
    category: "Frontend",
    type: "PDF",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: "res-5",
    title: "Layout Spacing Guide",
    category: "Design",
    type: "Slides",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
]

export const users = [
  { id: "u1", name: "Admin User", email: "admin@elibary.app", role: "admin" },
  {
    id: "u2",
    name: "Aisha Bello",
    email: "aisha@elibary.app",
    role: "instructor",
  },
  {
    id: "u3",
    name: "Ibrahim Yusuf",
    email: "ibrahim@elibary.app",
    role: "instructor",
  },
  {
    id: "u4",
    name: "Sarah Okeke",
    email: "sarah@elibary.app",
    role: "student",
  },
  {
    id: "u5",
    name: "David Mensah",
    email: "david@elibary.app",
    role: "student",
  },
]
