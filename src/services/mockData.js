// Mock Data for the Blearn platform

export const mockUsers = {
  student: {
    id: "std-101",
    name: "Alex Johnson",
    email: "alex@blearn.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    bio: "Passionate computer science student specializing in frontend technologies. Loving clean designs, soft gradients, and interactive interfaces.",
    enrolledCourses: ["course-1", "course-2"],
    quizScores: {
      "quiz-1": 100,
      "quiz-2": 66
    }
  },
  teacher: {
    id: "tch-202",
    name: "Sarah Jenkins",
    email: "sarah@blearn.com",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    bio: "Senior Frontend Engineer and Instructor. 8+ years of experience building modern web architectures and educating next-generation devs.",
    portalLabel: "Teacher Portal",
    coursesCreated: ["course-1", "course-2", "course-3", "course-4"],
    stats: {
      totalStudents: 1240,
      averageRating: 4.8,
      activeHours: 320
    }
  },
  student2: {
    id: "std-102",
    name: "Emma Davis",
    email: "emma@blearn.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256",
    bio: "Design student eager to learn UI/UX principles and digital art.",
    enrolledCourses: ["course-1", "course-3", "course-4"],
    quizScores: {
      "quiz-1": 90,
      "quiz-3": 85
    }
  },
  teacher2: {
    id: "tch-203",
    name: "Michael Chen",
    email: "michael@blearn.com",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    bio: "Expert in Data Science and Backend Systems. Bringing logic to the web.",
    portalLabel: "Teacher Portal",
    coursesCreated: [],
    stats: {
      totalStudents: 450,
      averageRating: 4.9,
      activeHours: 120
    }
  }
};

export const mockCourses = [
  {
    id: "course-1",
    title: "Introduction to Modern Web Design",
    description: "Learn the core concepts of HTML, CSS, typography, and clean UI/UX layout design. Perfect for building clean, premium web projects with soft gradients and balanced visual hierarchy inspired by design systems like Google Stitch.",
    instructor: "Sarah Jenkins",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=640",
    category: "Design",
    duration: "6 weeks",
    rating: 4.9,
    enrolledCount: 450,
    materials: [
      { id: "mat-1", title: "Syllabus & Introduction PDF", size: "1.2 MB", type: "PDF" },
      { id: "mat-2", title: "Visual Hierarchy Guidelines", size: "2.4 MB", type: "Slides" },
      { id: "mat-3", title: "Stitch-Inspired Color Palette Cheat Sheet", size: "850 KB", type: "Asset Pack" }
    ],
    videos: [
      { id: "vid-1-1", title: "1.1 Introduction to Web Design and Blearn Layout", duration: "12:45", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: "vid-1-2", title: "1.2 Visual Balance: Typography and Spacing", duration: "18:20", url: "https://www.w3schools.com/html/movie.mp4" },
      { id: "vid-1-3", title: "1.3 Understanding Modern Shadows and Soft Gradients", duration: "15:10", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ],
    quizzes: ["quiz-1"]
  },
  {
    id: "course-2",
    title: "Advanced React & Component Architectures",
    description: "Deep dive into React 19 features, custom hooks, context management, performance optimization, and clean reusable directory architectures. Create complex dashboards and layouts.",
    instructor: "Sarah Jenkins",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=640",
    category: "Development",
    duration: "8 weeks",
    rating: 4.8,
    enrolledCount: 380,
    materials: [
      { id: "mat-4", title: "React State Flowchart", size: "1.8 MB", type: "PDF" },
      { id: "mat-5", title: "Custom Hooks Boilerplate", size: "45 KB", type: "Code" }
    ],
    videos: [
      { id: "vid-2-1", title: "2.1 React 19 Highlights: Server Components & Hooks", duration: "22:15", url: "https://www.w3schools.com/html/movie.mp4" },
      { id: "vid-2-2", title: "2.2 The Context API: Building Global Stores", duration: "19:40", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: "vid-2-3", title: "2.3 Component Composition vs. Inheritance", duration: "14:30", url: "https://www.w3schools.com/html/movie.mp4" }
    ],
    quizzes: ["quiz-2"]
  },
  {
    id: "course-3",
    title: "Styling Premium Apps with Tailwind CSS v4",
    description: "Learn Tailwind CSS v4's native Vite compilation, new CSS variables configurations, hover effects, transition animations, and dark mode configuration to design gorgeous, responsive web interfaces.",
    instructor: "Sarah Jenkins",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    thumbnail: "https://images.unsplash.com/photo-1541462608141-2f58c6e68e67?auto=format&fit=crop&q=80&w=640",
    category: "Design",
    duration: "4 weeks",
    rating: 4.7,
    enrolledCount: 290,
    materials: [
      { id: "mat-6", title: "Tailwind v4 Config Reference Sheet", size: "900 KB", type: "PDF" },
      { id: "mat-7", title: "Flexbox and Grid Cheat Sheet", size: "1.1 MB", type: "PDF" }
    ],
    videos: [
      { id: "vid-3-1", title: "3.1 Installing Tailwind CSS v4 in React + Vite", duration: "10:20", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: "vid-3-2", title: "3.2 Responsive Grids & Flexible Flex Layouts", duration: "25:40", url: "https://www.w3schools.com/html/movie.mp4" }
    ],
    quizzes: ["quiz-3"]
  },
  {
    id: "course-4",
    title: "Micro-interactions and Web Animations",
    description: "Build delightful micro-animations that respond to mouse hovers, scroll triggers, and active states. Elevate simple sites to premium, state-of-the-art experiences.",
    instructor: "Sarah Jenkins",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=640",
    category: "Development",
    duration: "5 weeks",
    rating: 4.9,
    enrolledCount: 120,
    materials: [
      { id: "mat-8", title: "Animation Curves Guide", size: "1.4 MB", type: "PDF" }
    ],
    videos: [
      { id: "vid-4-1", title: "4.1 CSS Transitions vs Keyframes", duration: "16:15", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: "vid-4-2", title: "4.2 Implementing Hover Triggers & Page Transitions", duration: "20:50", url: "https://www.w3schools.com/html/movie.mp4" }
    ],
    quizzes: []
  }
];

export const mockQuizzes = {
  "quiz-1": {
    id: "quiz-1",
    courseId: "course-1",
    title: "Web Design Fundamentals Quiz",
    description: "Test your knowledge of typography rules, visual hierarchy, and basic layout structure.",
    questions: [
      {
        id: "q1-1",
        question: "Which of the following creates the strongest visual hierarchy on a webpage?",
        options: [
          "Making all text the same size and weight",
          "Using size, weight, color contrast, and spacing strategically",
          "Using as many different fonts as possible",
          "Centering every element on the screen"
        ],
        correctAnswer: 1
      },
      {
        id: "q1-2",
        question: "What does the 'line-height' property in CSS control?",
        options: [
          "The vertical space between lines of text",
          "The height of an inline element's border box",
          "The maximum width of a text column",
          "The size of the font itself"
        ],
        correctAnswer: 0
      },
      {
        id: "q1-3",
        question: "In standard UI design, soft shadows are preferred over harsh borders because they:",
        options: [
          "Reduce page load time",
          "Make elements feel like they float on layers, creating depth and a premium feel",
          "Are required by HTML5 validation rules",
          "Disable responsive scaling"
        ],
        correctAnswer: 1
      }
    ]
  },
  "quiz-2": {
    id: "quiz-2",
    courseId: "course-2",
    title: "React Core Concepts Quiz",
    description: "Test your familiarity with state hooks, the Virtual DOM, and contexts.",
    questions: [
      {
        id: "q2-1",
        question: "What is the primary benefit of React Context over passing props?",
        options: [
          "It improves rendering speed on mobile",
          "It allows sharing state deeply without manually passing props down through multiple component levels",
          "It automatically encrypts state variables",
          "It replaces the need for React Router"
        ],
        correctAnswer: 1
      },
      {
        id: "q2-2",
        question: "In React 19, what happens when you call a state setter function with the exact same value as current state?",
        options: [
          "The component crashes",
          "React skips rendering the component children and updates silently (bails out)",
          "An infinite loop is triggered",
          "The component forces a complete page reload"
        ],
        correctAnswer: 1
      },
      {
        id: "q2-3",
        question: "Which hook should be used to memoize the result of a computationally expensive operation?",
        options: [
          "useEffect",
          "useState",
          "useMemo",
          "useCallback"
        ],
        correctAnswer: 2
      }
    ]
  },
  "quiz-3": {
    id: "quiz-3",
    courseId: "course-3",
    title: "Tailwind CSS v4 Layouts Quiz",
    description: "Assess your styling logic using Tailwind utility grids.",
    questions: [
      {
        id: "q3-1",
        question: "In Tailwind CSS v4, which utility sets up a grid with three equal columns on large screens and a single column on mobile?",
        options: [
          "grid grid-cols-1 lg:grid-cols-3",
          "flex flex-col lg:flex-row",
          "cols-1 lg:cols-3",
          "grid-3 mobile-1"
        ],
        correctAnswer: 0
      },
      {
        id: "q3-2",
        question: "How do you apply a styles modification on hover in Tailwind?",
        options: [
          "hover(bg-blue-500)",
          "hover:bg-blue-500",
          "bg-blue-500-hover",
          "on-hover:bg-blue-500"
        ],
        correctAnswer: 1
      },
      {
        id: "q3-3",
        question: "What is the new method for configuring Tailwind CSS v4 custom theme styles?",
        options: [
          "Using a tailwind.config.js file in root",
          "Defining standard CSS variables with the --theme-* prefix directly inside App.css or index.css",
          "Configuring options in vite.config.js plugins parameter only",
          "Tailwind v4 doesn't support theme customization"
        ],
        correctAnswer: 1
      }
    ]
  }
};

export const mockLiveClasses = [
  {
    id: "live-1",
    title: "React 19 Hooks and Refactoring Workshop",
    description: "Live interactive session going through refactoring a legacy App into React 19 hooks and contexts. Ask questions live and code along.",
    instructor: "Sarah Jenkins",
    status: "live", // live, scheduled, ended
    scheduledTime: "Happening Now",
    participants: ["Alex Johnson", "Marcus Aurelius", "Jane Doe", "Devin Miller", "Emily Rose"],
    chatHistory: [
      { id: "c1", sender: "Sarah Jenkins", message: "Welcome class! Today we are looking at React 19.", time: "21:00" },
      { id: "c2", sender: "Alex Johnson", message: "Hi Sarah! Excited for this. Will we cover useActionState?", time: "21:01" },
      { id: "c3", sender: "Sarah Jenkins", message: "Yes Alex, we will cover useActionState and new form actions extensively!", time: "21:02" },
      { id: "c4", sender: "Marcus Aurelius", message: "Greetings from Rome! Glad I could catch this stream.", time: "21:03" }
    ]
  },
  {
    id: "live-2",
    title: "Interactive UI & Micro-interactions with CSS/Tailwind",
    description: "Designing a high-fidelity landing page with subtle shadows, transitions, and hover-triggered scale animations. Code walkthrough.",
    instructor: "Sarah Jenkins",
    status: "scheduled",
    scheduledTime: "Tomorrow at 4:00 PM (IST)",
    participants: [],
    chatHistory: []
  }
];
