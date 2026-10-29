/**
 * Instant Fallback Mock Data
 * Ensures the website renders instantaneously even if the remote Render instance is waking up from cold sleep.
 */

export const fallbackProfile = {
  name: 'Venkata Siva Reddy',
  role: 'Full Stack Engineer & AI Developer',
  headline: 'Full Stack Developer & Free Fire Clutch Tactician',
  bio: 'Computer Science undergraduate at RGMCET (2023-2027) with CGPA 8.1. Full-stack engineer building production MERN web applications, AI integrations, and real-time systems. Competitive Free Fire player operating with high-APM execution, tactical shot-calling, and clean architectural design.',
  college: 'RGMCET',
  graduationYear: '2027',
  cgpa: '8.1',
  location: 'Andhra Pradesh, India',
  gamingTier: 'Heroic / Clutch Tactician',
  nowCurrentlyBuilding: 'Interactive high-APM developer portfolio with tactical telemetry and game suite',
  nowLearning: 'Go microservices, real-time WebSockets, and low-latency cloud deployments',
  nowExploring: 'Autonomous multi-agent architectures, LLM orchestration, and high-APM gaming telemetry',
  nowNext: 'High-impact software engineering roles and Grandmaster Free Fire esports tournaments',
  stats: {
    githubCommits: '500+',
    hackathonsWon: '3',
    freeFireApm: '280+',
    projectsShipped: '12+'
  }
};

export const fallbackProjects = [
  {
    _id: '1',
    title: 'NutriCloud Monitor',
    slug: 'nutricloud-monitor',
    shortDescription: 'Production IoT-cloud monitoring system for real-time nutritional tracking and environment telemetry.',
    problem: 'Nutrition labs needed a zero-latency telemetry dashboard for real-time monitoring across distributed nodes.',
    solution: 'Designed a full-stack MERN platform with Redis caching, WebSockets for sub-100ms updates, and dynamic charts.',
    features: ['Real-time WebSocket Data Pipeline', 'Redis Caching for Analytics Query Acceleration', 'Role-Based Access Control (RBAC)', 'Interactive Telemetry Visualizations'],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'WebSockets', 'Tailwind CSS'],
    category: 'IoT / Full-Stack',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy/NutriCloud',
    liveUrl: ''
  },
  {
    _id: '2',
    title: 'DocSpot Healthcare Portal',
    slug: 'docspot-healthcare-portal',
    shortDescription: 'Comprehensive doctor appointment booking and patient record management system.',
    problem: 'Patients face complex booking workflows and lack unified medical history access.',
    solution: 'Engineered an intuitive healthcare portal with real-time slot scheduling and encrypted document storage.',
    features: ['Real-time Slot Booking Engine', 'JWT Auth & Session Management', 'Patient History Timeline', 'Doctor Availability Management'],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Cloudinary'],
    category: 'Healthcare / Web App',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy/DocSpot',
    liveUrl: ''
  },
  {
    _id: '3',
    title: 'Candidate Rank System',
    slug: 'candidate-rank-system',
    shortDescription: 'AI-driven candidate evaluation system using natural language processing to extract and rank applicant profiles.',
    problem: 'HR teams spend excessive manual hours reviewing resume PDFs without structured metric comparison.',
    solution: 'Created an intelligent parsing pipeline with spaCy NLP that calculates weighted keyword relevance and presents ranked leaderboards.',
    features: ['Resume Parsing via spaCy NLP', 'Job Requirement Keyword Matching', 'Applicant Leaderboard', 'Detailed Skill Gap Analysis'],
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Python', 'spaCy'],
    category: 'Recruitment / AI / NLP',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy/CandidateRankSystem',
    liveUrl: ''
  }
];

export const fallbackSkills = [
  { _id: '1', name: 'React.js', category: 'Frontend', level: 90 },
  { _id: '2', name: 'JavaScript / ES6+', category: 'Languages', level: 92 },
  { _id: '3', name: 'Node.js & Express', category: 'Backend', level: 88 },
  { _id: '4', name: 'Python', category: 'Languages', level: 85 },
  { _id: '5', name: 'MongoDB', category: 'Databases', level: 86 },
  { _id: '6', name: 'Tailwind CSS', category: 'Frontend', level: 95 },
  { _id: '7', name: 'REST APIs & WebSockets', category: 'Backend', level: 88 },
  { _id: '8', name: 'Git & GitHub', category: 'Tools', level: 92 },
  { _id: '9', name: 'Docker Basics', category: 'DevOps', level: 78 },
  { _id: '10', name: 'Tactical Shot-Calling & APM', category: 'Competitive', level: 96 }
];

export const fallbackExperience = [
  {
    _id: '1',
    role: 'Full Stack Web Developer Intern',
    company: 'Tech Solutions & Labs',
    duration: '2024 — Present',
    description: 'Developed scalable client-facing web dashboards using React, Node.js, and MongoDB. Optimized database query latencies by 35% with Redis caching and index tuning.',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Tailwind CSS']
  },
  {
    _id: '2',
    role: 'Technical Lead & Web Coordinator',
    company: 'College Tech Club (RGMCET)',
    duration: '2023 — Present',
    description: 'Led technical workshops on modern web architecture and algorithmic problem solving. Mentored 80+ junior developers across competitive programming and project development.',
    skills: ['Mentorship', 'JavaScript', 'System Architecture', 'Git']
  }
];

export const fallbackCertifications = [
  {
    _id: '1',
    title: 'Full Stack Web Development Professional',
    organization: 'Coursera / Meta',
    issueDate: '2024',
    credentialId: 'META-FS-84920',
    description: 'Mastery of modern web engineering: advanced React patterns, Node.js server architectures, relational & document databases, and secure deployment pipelines.'
  },
  {
    _id: '2',
    title: 'Python for Data Science & AI Engineering',
    organization: 'IBM Skills Network',
    issueDate: '2024',
    credentialId: 'IBM-PY-59301',
    description: 'Hands-on experience with Python data structures, pandas, NumPy, REST APIs, and training foundational machine learning models.'
  },
  {
    _id: '3',
    title: 'Database Management & Cloud Architecture',
    organization: 'MongoDB University',
    issueDate: '2024',
    credentialId: 'MDB-DBA-10294',
    description: 'Document database schema design, aggregation pipelines, performance index tuning, and distributed cloud clustering with MongoDB Atlas.'
  }
];

export const fallbackAchievements = [
  {
    _id: '1',
    title: 'Heroic Tier — Free Fire Battle Royale',
    rank: 'Top 1% Clutch Tactician',
    event: 'Competitive Battle Royale Ranked Seasons',
    organization: 'Garena Free Fire Esports',
    year: '2024 - 2026',
    description: 'Attained Heroic rank through precision shot-calling, high-APM mechanical reflex speed (280+ actions/minute), and strategic squad leadership in clutch final-circle encounters.'
  },
  {
    _id: '2',
    title: '2nd Rank — College Web Development Event',
    rank: '2nd Rank',
    event: 'WebTech Hackathon & UI Engineering Challenge',
    organization: 'RGMCET',
    year: '2025',
    description: 'Built an interactive high-performance web platform under strict time constraints, praised for responsive UI architecture and fluid animations.'
  },
  {
    _id: '3',
    title: 'Smart India Hackathon Finalist',
    rank: 'Finalist',
    event: 'National Innovation & Problem Solving Contest',
    organization: 'Ministry of Education, Govt of India',
    year: '2024',
    description: 'Designed an automated decentralized agriculture commodity verification prototype using cloud microservices and predictive analytics.'
  }
];

export const fallbackNotes = [
  {
    _id: '1',
    title: 'Bridging Esports APM and Full Stack Engineering Reflexes',
    slug: 'bridging-esports-apm-and-full-stack-engineering',
    category: 'Engineering & Gaming',
    date: '2025-01-15',
    readTime: '4 min read',
    summary: 'How high-intensity battle royale shot-calling and split-second decisions sharpen software debugging, production incident response, and clean code workflows.'
  },
  {
    _id: '2',
    title: 'Optimizing MERN Applications for Zero-Lag Interaction',
    slug: 'optimizing-mern-applications-for-zero-lag',
    category: 'Architecture',
    date: '2024-11-20',
    readTime: '6 min read',
    summary: 'A deep dive into query memoization, optimistic UI updates, Redis caching, and WebSocket streams to eliminate UI latency.'
  }
];
