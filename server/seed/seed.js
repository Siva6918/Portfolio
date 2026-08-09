require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const Profile = require('../models/Profile');
const Education = require('../models/Education');
const SkillCategory = require('../models/SkillCategory');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const SocialLink = require('../models/SocialLink');
const CodingProfile = require('../models/CodingProfile');
const Contact = require('../models/Contact');
const Resume = require('../models/Resume');
const Goal = require('../models/Goal');
const FocusArea = require('../models/FocusArea');

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
    console.log(`[Seed] Connecting to MongoDB at ${connStr}...`);
    await mongoose.connect(connStr);
    console.log('[Seed] Connected successfully.');

    // Clear existing collections
    await Profile.deleteMany({});
    await Education.deleteMany({});
    await SkillCategory.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Project.deleteMany({});
    await Certification.deleteMany({});
    await Achievement.deleteMany({});
    await SocialLink.deleteMany({});
    await CodingProfile.deleteMany({});
    await Contact.deleteMany({});
    await Resume.deleteMany({});
    await Goal.deleteMany({});
    await FocusArea.deleteMany({});

    console.log('[Seed] Cleared old portfolio data.');

    // 1. Profile
    await Profile.create({
      name: 'Venkata Siva Reddy',
      role: 'Full Stack Developer / Software Engineer',
      shortBio: 'B.Tech Computer Science and Engineering student graduating in 2027 with expertise in MERN, Cloud, and AI integration.',
      longBio: 'I am a passionate software engineering student focused on building scalable, production-oriented web applications, robust backend architectures, and seamlessly incorporating AI/ML capabilities into modern web platforms.',
      profileImage: '/Avatar.png',
      careerGoal: 'Become a strong software engineer capable of building scalable applications and integrating AI-driven solutions into modern web platforms.',
      currentFocus: 'MERN Stack, Data Structures & Algorithms, Cloud Infrastructure, System Design, AI Integration',
      location: 'Andhra Pradesh, India',
      availability: 'Open for Software Engineering Internships & Freelance Opportunities',
      email: 'vasanreddy1331@gmail.com',
      github: 'https://github.com/vasanreddy',
      linkedin: 'https://www.linkedin.com/in/venkatasiva-reddy/',
      degree: 'B.Tech',
      branch: 'Computer Science and Engineering',
      college: 'Rajeev Gandhi Memorial College of Engineering and Technology',
      graduationYear: 2027,
      cgpa: 8.1
    });

    // 2. Education
    await Education.create([
      {
        degree: 'B.Tech',
        branch: 'Computer Science and Engineering',
        college: 'Rajeev Gandhi Memorial College of Engineering and Technology',
        university: 'JNTUA',
        startYear: '2023',
        endYear: '2027',
        expectedGraduation: '2027',
        cgpa: '8.1',
        description: 'Focusing on Core Computer Science, Software Engineering, Data Structures & Algorithms, Operating Systems, DBMS, and Web Architecture.',
        location: 'Nandyal, Andhra Pradesh',
        displayOrder: 1
      },
      {
        degree: 'Intermediate (12th Grade)',
        branch: 'MPC (Mathematics, Physics, Chemistry)',
        college: 'Narayana Junior College',
        startYear: '2021',
        endYear: '2023',
        percentage: '96.8%',
        description: 'Completed higher secondary education with top honors in Mathematics and Physical Sciences.',
        location: 'Andhra Pradesh',
        displayOrder: 2
      }
    ]);

    // 3. Skill Categories & Skills
    const categories = await SkillCategory.create([
      { name: 'Programming Languages', displayOrder: 1 },
      { name: 'Frontend', displayOrder: 2 },
      { name: 'Backend', displayOrder: 3 },
      { name: 'Databases', displayOrder: 4 },
      { name: 'Cloud & DevOps', displayOrder: 5 },
      { name: 'AI / ML', displayOrder: 6 },
      { name: 'Tools', displayOrder: 7 },
      { name: 'Core CS', displayOrder: 8 }
    ]);

    const createdSkills = await Skill.create([
      // Languages
      { name: 'Java', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 1 },
      { name: 'JavaScript', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 2 },
      { name: 'Python', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', proficiency: 'Intermediate', yearsOfExperience: '2+ yrs', displayOrder: 3 },
      { name: 'C++', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs', displayOrder: 4 },
      
      // Frontend
      { name: 'React', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 1 },
      { name: 'Next.js', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs', displayOrder: 2 },
      { name: 'Tailwind CSS', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 3 },
      { name: 'HTML5/CSS3', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', proficiency: 'Expert', yearsOfExperience: '3+ yrs', displayOrder: 4 },

      // Backend
      { name: 'Node.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 1 },
      { name: 'Express.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 2 },
      { name: 'FastAPI', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs', displayOrder: 3 },
      { name: 'REST APIs', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', proficiency: 'Expert', yearsOfExperience: '2+ yrs', displayOrder: 4 },

      // Databases
      { name: 'MongoDB', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 1 },
      { name: 'MySQL', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', proficiency: 'Intermediate', yearsOfExperience: '2+ yrs', displayOrder: 2 },
      { name: 'Redis', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs', displayOrder: 3 },

      // Cloud & DevOps
      { name: 'AWS', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs', displayOrder: 1 },
      { name: 'Docker', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs', displayOrder: 2 },
      { name: 'Git & GitHub', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 3 },

      // Tools & Core CS
      { name: 'Data Structures & Algorithms', category: 'Core CS', logo: '', proficiency: 'Advanced', yearsOfExperience: '2+ yrs', displayOrder: 1 },
      { name: 'System Design', category: 'Core CS', logo: '', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs', displayOrder: 2 }
    ]);

    // Map skill IDs for reference
    const awsSkill = createdSkills.find(s => s.name === 'AWS');
    const nodeSkill = createdSkills.find(s => s.name === 'Node.js');
    const reactSkill = createdSkills.find(s => s.name === 'React');
    const mongoSkill = createdSkills.find(s => s.name === 'MongoDB');

    // 4. Projects
    await Project.create([
      {
        title: 'NutriCloud Monitor',
        slug: 'nutricloud-monitor',
        shortDescription: 'Real-time behavioral intelligence platform for abnormal activity detection and security threat scoring.',
        description: 'A cloud-based behavioral monitoring platform built with Next.js, Node.js, Express, MongoDB, and Python FastAPI. Transforms user interactions into clickstream timelines, session logs, and live risk scores.',
        problem: 'Traditional security relies on rigid static rules that fail to catch anomalous browsing patterns, credential stuffing, and stealthy session takeover.',
        solution: 'Built a real-time behavioral intelligence engine that tracks login frequency, navigation speed, and interaction patterns to compute dynamic risk scores.',
        features: [
          'JWT Session Authentication & IP Tracking',
          'Background Risk Analysis & Anomaly Detection',
          'E-Commerce Interface with Live Monitoring',
          'Admin Security Dashboard with Real-Time Risk Graphs',
          'Suspicious Session Blocking & Timeline Alerts'
        ],
        technologies: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Python', 'FastAPI', 'AWS', 'Tailwind CSS', 'Recharts'],
        skills: [nodeSkill?._id, mongoSkill?._id, awsSkill?._id].filter(Boolean),
        category: 'Full Stack / Security / ML',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
        repositoryUrl: 'https://github.com/vasanreddy/NutriCloudMonitor',
        liveUrl: '',
        status: 'Completed',
        featured: true,
        displayOrder: 1
      },
      {
        title: 'DocSpot Appointment Booking',
        slug: 'docspot-appointment-booking',
        shortDescription: 'Full-stack healthcare platform for doctor search, schedule management, and instant booking.',
        description: 'DocSpot provides a seamless healthcare experience connecting patients with qualified doctors. Built using the MERN stack with real-time slot availability, Socket.io notifications, and medical record management.',
        problem: 'Patients face complex processes when finding specialist doctors and scheduling appointments without real-time feedback.',
        solution: 'Developed an interactive booking ecosystem with specialized doctor search, instant appointment confirmation, and automated status updates.',
        features: [
          'Specialist Doctor Directory with Category Filters',
          'Interactive Date & Slot Selector',
          'Patient & Doctor Dashboard Portals',
          'Real-time Appointment Notifications via Socket.io',
          'Secure Medical History Tracking'
        ],
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Socket.io', 'Tailwind CSS'],
        skills: [reactSkill?._id, nodeSkill?._id, mongoSkill?._id].filter(Boolean),
        category: 'Healthcare / Full Stack',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
        repositoryUrl: 'https://github.com/vasanreddy/DocSpot',
        liveUrl: '',
        status: 'Completed',
        featured: true,
        displayOrder: 2
      },
      {
        title: 'Candidate Rank System',
        slug: 'candidate-rank-system',
        shortDescription: 'AI-driven candidate evaluation system using natural language processing to extract and rank applicant profiles.',
        description: 'An automated candidate matching tool built with Next.js, Express, MongoDB, and Python spaCy. Evaluates resumes against job descriptions, computes weighted skill match scores, and ranks applicants objectively.',
        problem: 'HR teams spend excessive manual hours reviewing resume PDFs without structured metric comparison.',
        solution: 'Created an intelligent parsing pipeline that extracts technical keywords, calculates weighted relevance scores, and presents ranked applicant leaderboards.',
        features: [
          'Resume Text & Skill Keyword Parsing via spaCy NLP',
          'Job Description Requirement Extraction',
          'Weighted Scoring & Match Percentage Algorithm',
          'Interactive Applicant Leaderboard Dashboard',
          'Detailed Skill Gap Analysis per Candidate'
        ],
        technologies: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Python', 'spaCy', 'Tailwind CSS'],
        skills: [nodeSkill?._id, mongoSkill?._id].filter(Boolean),
        category: 'Recruitment / AI / NLP',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
        repositoryUrl: 'https://github.com/vasanreddy/CandidateRankSystem',
        liveUrl: '',
        status: 'Completed',
        featured: true,
        displayOrder: 3
      },
      {
        title: 'Weather Application',
        slug: 'weather-application',
        shortDescription: 'Dynamic weather dashboard featuring real-time forecasts, atmospheric metrics, and geolocation search.',
        description: 'Responsive frontend weather application built with React and OpenWeather API. Displays live temperature, humidity, wind speed, pressure, and multi-day forecasts with custom animated weather graphics.',
        problem: 'Static weather apps lack clean visual aesthetics and fast search autocomplete across worldwide cities.',
        solution: 'Designed an elegant, low-latency UI that fetches live REST API data and dynamically transforms background themes based on weather conditions.',
        features: [
          'Live Temperature & Hourly Forecast Cards',
          'City Search with Autocomplete & Geolocation Support',
          'Atmospheric Metrics (UV Index, Visibility, Humidity, Pressure)',
          'Adaptive Weather Condition Animations'
        ],
        technologies: ['React', 'JavaScript', 'CSS3', 'OpenWeather API', 'Axios'],
        skills: [reactSkill?._id].filter(Boolean),
        category: 'Frontend / API',
        thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=800&auto=format&fit=crop',
        repositoryUrl: 'https://github.com/vasanreddy/WeatherApp',
        liveUrl: '',
        status: 'Completed',
        featured: false,
        displayOrder: 4
      },
      {
        title: 'Service Booking Platform',
        slug: 'service-booking-platform',
        shortDescription: 'Modern UI engineering showcase for local service discovery and online service booking.',
        description: 'A modular frontend web application built using React and Tailwind CSS demonstrating reusable components, state management, interactive calendar pickers, and responsive checkout flows.',
        problem: 'Booking platforms often suffer from cluttered user interfaces and complex navigation.',
        solution: 'Built a clean, mobile-first design system with atomic reusable components and instant form validation.',
        features: [
          'Service Catalog with Categorized Filtering',
          'Interactive Date & Time Slot Selector Component',
          'Customer Summary & Checkout Stepper',
          'Fully Mobile Responsive UI Design'
        ],
        technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Lucide Icons'],
        skills: [reactSkill?._id].filter(Boolean),
        category: 'Frontend / UI Engineering',
        thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
        repositoryUrl: 'https://github.com/vasanreddy/ServiceBookingApp',
        liveUrl: '',
        status: 'Completed',
        featured: false,
        displayOrder: 5
      }
    ]);

    // 5. Certifications (linking skill IDs)
    await Certification.create([
      {
        title: 'AWS Certified Cloud Practitioner',
        organization: 'Amazon Web Services',
        issueDate: '2024',
        expiryDate: '2027',
        credentialId: 'AWS-CCP-100293',
        credentialUrl: 'https://aws.amazon.com/verification',
        skills: [awsSkill?._id].filter(Boolean),
        description: 'Validated foundational knowledge of AWS Cloud architecture, IAM security, compute (EC2), and database services (S3/RDS).',
        displayOrder: 1
      },
      {
        title: 'Full Stack Web Development with Node.js & React',
        organization: 'Udemy / Coursera',
        issueDate: '2024',
        expiryDate: 'No Expiration',
        credentialId: 'FSWD-98214',
        credentialUrl: '',
        skills: [nodeSkill?._id, reactSkill?._id, mongoSkill?._id].filter(Boolean),
        description: 'Mastered full-stack MERN architecture, RESTful API design, database schemas, and client-side state management.',
        displayOrder: 2
      }
    ]);

    // 6. Achievements
    await Achievement.create([
      {
        title: '1st Rank - College Kaggle Competition',
        rank: '1st Rank',
        event: 'Annual Kaggle Data Science & Machine Learning Hackathon',
        organization: 'Rajeev Gandhi Memorial College of Engineering and Technology',
        year: '2026',
        description: 'Secured top place by engineering high-accuracy predictive models and data preprocessing pipelines.',
        displayOrder: 1
      },
      {
        title: '2nd Rank - College Web Development Event',
        rank: '2nd Rank',
        event: 'WebTech Hackathon & UI Engineering Challenge',
        organization: 'Rajeev Gandhi Memorial College of Engineering and Technology',
        year: '2025',
        description: 'Developed an interactive, high-performance web platform under strict time constraints.',
        displayOrder: 2
      },
      {
        title: '2nd Rank - College Coding Event',
        rank: '2nd Rank',
        event: 'Algorithmic Coding & Problem Solving Contest',
        organization: 'Rajeev Gandhi Memorial College of Engineering and Technology',
        year: '2024',
        description: 'Solved complex Data Structures and Algorithm challenges within competitive speed benchmarks.',
        displayOrder: 3
      }
    ]);

    // 7. Social Links
    await SocialLink.create([
      { platform: 'GitHub', username: 'vasanreddy', url: 'https://github.com/vasanreddy', logo: 'Github', active: true, displayOrder: 1 },
      { platform: 'LinkedIn', username: 'venkata-siva-reddy', url: 'https://linkedin.com/in/venkata-siva-reddy', logo: 'Linkedin', active: true, displayOrder: 2 },
      { platform: 'Email', username: 'vasanreddy1331@gmail.com', url: 'mailto:vasanreddy1331@gmail.com', logo: 'Mail', active: true, displayOrder: 3 }
    ]);

    // 8. Coding Profiles
    await CodingProfile.create([
      { platform: 'LeetCode', username: 'vasanreddy', profileUrl: 'https://leetcode.com/vasanreddy', problemsSolved: '300+', rating: '1650', rank: 'Top 25%', description: 'Active DSA problem solver in Arrays, Dynamic Programming, Trees, Graphs.', displayOrder: 1 },
      { platform: 'HackerRank', username: 'vasanreddy', profileUrl: 'https://hackerrank.com/vasanreddy', problemsSolved: '100+', rating: '5 Star Problem Solving', rank: '', description: '5 Stars in Problem Solving and Java domain badges.', displayOrder: 2 },
      { platform: 'GeeksforGeeks', username: 'vasanreddy', profileUrl: 'https://geeksforgeeks.org/user/vasanreddy', problemsSolved: '80+', rating: '', rank: '', description: 'Consistent practice in core CS concepts and algorithmic coding.', displayOrder: 3 }
    ]);

    // 9. Contacts
    await Contact.create([
      { name: 'Email', value: 'vasanreddy1331@gmail.com', icon: 'Mail', active: true, displayOrder: 1 },
      { name: 'Location', value: 'Andhra Pradesh, India', icon: 'MapPin', active: true, displayOrder: 2 },
      { name: 'Education', value: 'B.Tech CSE (2023-2027), RGMCET', icon: 'GraduationCap', active: true, displayOrder: 3 }
    ]);

    // 10. Goals & Focus Areas
    await Goal.create([
      { title: 'Full Stack Engineering', description: 'Build resilient, modern full-stack web applications.', displayOrder: 1 },
      { title: 'Master DSA & System Design', description: 'Solve advanced algorithmic challenges and architect scalable systems.', displayOrder: 2 },
      { title: 'Cloud & DevOps Automation', description: 'Deploy applications with Docker, AWS, and CI/CD pipelines.', displayOrder: 3 },
      { title: 'AI & ML Integration', description: 'Embed intelligent NLP and machine learning services into web platforms.', displayOrder: 4 }
    ]);

    await FocusArea.create([
      { title: 'MERN Stack Development', description: 'React, Node.js, Express, MongoDB Cloud Atlas', displayOrder: 1 },
      { title: 'Data Structures & Algorithms', description: 'Java, Problem Solving, Algorithmic Efficiency', displayOrder: 2 },
      { title: 'Backend Engineering & Security', description: 'REST APIs, JWT Auth, Suspicious Activity Analytics', displayOrder: 3 },
      { title: 'Cloud & AI Integration', description: 'AWS Services, Python FastAPI, NLP Models', displayOrder: 4 }
    ]);

    console.log('[Seed] Database successfully populated with initial portfolio data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
