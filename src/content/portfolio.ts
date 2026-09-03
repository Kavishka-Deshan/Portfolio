export const site = {
  name: "Kavishka Deshan",
  title: "Software Engineering Undergraduate",
  location: "Sri Lanka",
  tagline:
    "I build mobile and web applications end to end, from database design and API integration through to the user interface.",
  email: "deshank962@gmail.com",
  phone: "+94 701218929",
  github: "https://github.com/Kavishka-Deshan",
  linkedin: "https://linkedin.com/in/kavishka-deshan2001",
  instagram: "https://www.instagram.com/kavishka._.deshan",
  telegram: "https://t.me/Kaviska_Deshan",
  // wa.me wants the number in international form, digits only
  whatsapp: "https://wa.me/94701218929",
  photo: "/profile.jpg",
} as const;

export const about = {
  paragraphs: [
    "Software Engineering undergraduate at NIBM, Sri Lanka, looking for a software engineering internship. I build mobile and web applications end to end, from database design and API integration through to the user interface.",
    "I work with React, TypeScript, Flutter, Node.js, Firebase, and Supabase, with PostgreSQL and MySQL behind them, and I am comfortable in Git-based team workflows.",
  ],
  education:
    "Higher National Diploma in Software Engineering, National Institute of Business Management (NIBM), Sri Lanka.",
} as const;

export type SkillCategory = {
  category: string;
  skills: string[];
};

export const skills: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: ["Java", "Python", "C", "C++", "C#", "JavaScript", "Dart", "Kotlin", "SQL"],
  },
  {
    category: "Frontend & UI",
    skills: ["React", "Next.js", "Flutter", "Jetpack Compose", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
  },
  {
    category: "Backend & APIs",
    skills: ["REST APIs", "API Integration", "Node.js", "TypeScript", "Firebase Cloud Services"],
  },
  {
    category: "Cloud & Platforms",
    skills: ["Firebase", "Supabase", "Google Maps", "Google Places", "GitHub Pages", "GitHub Actions"],
  },
  {
    category: "Databases",
    skills: ["Cloud Firestore", "Firebase Realtime Database", "PostgreSQL", "MySQL", "SQLite"],
  },
  {
    category: "Mobile Development",
    skills: ["Flutter", "Android", "Kotlin", "Jetpack Compose", "Google Maps", "CameraX", "Room"],
  },
  {
    category: "IoT & Embedded",
    skills: ["Arduino", "ESP32", "Embedded C/C++", "RFID", "Sensor Integration", "I2C/SPI"],
  },
  {
    category: "Tools & Dev",
    skills: ["Git", "GitHub", "VS Code", "IntelliJ IDEA", "Visual Studio", "Arduino IDE", "Testing"],
  },
  {
    category: "Core Concepts",
    skills: ["OOP", "Data Structures & Algorithms", "RESTful API Design"],
  },
];

export type Project = {
  title: string;
  type: string;
  stack: string[];
  summary: string;
  features: string[];
  repo: string;
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    title: "Navora — Intelligent Travel Guide to Sri Lanka",
    type: "HND Final Project",
    stack: ["Flutter", "Dart", "Firebase", "Supabase", "Gemini"],
    summary:
      "A cross-platform travel application that plans trips across Sri Lanka using real routing and place data, so each itinerary follows an actual travel route instead of an unordered list of locations.",
    features: [
      "Route-based trip planning from live routing and place data",
      "Gemini narration through Firebase AI Logic",
      "Maps, saved trips, and offline caching",
      "AR-style navigation",
      "Trip sharing, encrypted chat, and blockchain-verified reviews",
    ],
    repo: "https://github.com/Kavishka-Deshan/Navora",
    flagship: true,
  },
  {
    title: "Fixora — Device Repair and Service Management App",
    type: "Group Project",
    stack: ["Kotlin", "Android", "Jetpack Compose", "Firebase", "Supabase", "Room"],
    summary:
      "A role-based Android application covering the full device repair lifecycle for customers, technicians, branch managers, and administrators.",
    features: [
      "Booking and repair tracking",
      "Technician assignment and workflows",
      "Parts inventory management",
      "Role-aware navigation",
      "Real-time Firestore updates with Room for offline-ready local data",
    ],
    repo: "https://github.com/Kavishka-Deshan/fixora-mobile-app",
  },
  {
    title: "Smart Mining Helmet — IoT Safety Monitoring",
    type: "Group Project",
    stack: ["ESP32", "Arduino C++", "React", "TypeScript", "Firebase"],
    summary:
      "An IoT worker-safety platform built on ESP32 firmware, reading environmental and motion sensors mounted on a helmet unit.",
    features: [
      "RFID zone tracking to record which section of the site a worker is in",
      "Telemetry streamed to Firebase Realtime Database",
      "Live React and TypeScript supervisor dashboard",
      "SOS alerting and incident logging",
    ],
    repo: "https://github.com/Kavishka-Deshan/IoT-Based-Mining-Worker-Safety-Helmet-with-RFID-Zone-Tracking-and-SOS-Alerts",
  },
  {
    title: "Aarya Tea — Brand and Product Website",
    type: "Personal Project",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP"],
    summary:
      "A bilingual product-marketing website for a tea brand, built on the Next.js App Router and deployed as a static site.",
    features: [
      "Responsive theme-aware layouts",
      "Scroll-linked animation with GSAP",
      "Structured bilingual product content",
      "Automated GitHub Pages deployment through GitHub Actions",
    ],
    // Repo is not public — the card hides its "View source" button when this
    // is empty. Put the URL back once the repository is published.
    repo: "",
  },
  {
    title: "SafeClean — Secure Windows Disk Cleaner",
    type: "Personal Project",
    stack: ["Python", "Tkinter", "unittest"],
    summary:
      "A Windows desktop utility that finds removable system, browser, and developer cache data while protecting credentials and personal files from deletion.",
    features: [
      "Layered allowlist and denylist protection",
      "Path validation",
      "Dry-run preview",
      "Administrator elevation",
      "Audit logging and automated safety tests",
    ],
    repo: "https://github.com/Kavishka-Deshan/SafeClean",
  },
  {
    title: "Library Management System",
    type: "Academic Project",
    stack: ["Java", "Swing", "JDBC", "MySQL", "JasperReports"],
    summary:
      "A desktop library-management application for cataloguing books, managing student records, and handling issues and returns.",
    features: [
      "Database-backed authentication",
      "Book search and stock tracking",
      "Due-date monitoring",
      "JDBC with the DAO pattern",
      "Printable PDF reports through JasperReports",
    ],
    repo: "https://github.com/Kavishka-Deshan/EAD-1-Library-Management-",
  },
];

export const education = {
  programme: "Higher National Diploma in Software Engineering (HND)",
  institution: "National Institute of Business Management (NIBM), Sri Lanka",
  coursework: [
    "Software Engineering",
    "Object-Oriented Programming",
    "Database Management Systems",
    "Computer Networks and Security",
    "Data Structures and Algorithms",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
  ],

} as const;

export const languages = ["Sinhala (native)", "English (working proficiency)"] as const;
