const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Venkata Siva Reddy' },
  role: { type: String, required: true, default: 'Full Stack Developer & Software Engineer' },
  shortBio: { type: String, default: 'B.Tech CSE Student (2023-2027) passionate about MERN, Cloud, and AI Integration.' },
  longBio: { type: String, default: 'Computer Science student capable of building scalable full-stack applications, designing robust backend architectures, and integrating AI/ML solutions into modern web platforms.' },
  profileImage: { type: String, default: '/Avatar.png' },
  careerGoal: { type: String, default: 'Become a strong software engineer capable of building scalable applications and integrating AI-driven solutions into modern web platforms.' },
  currentFocus: { type: String, default: 'MERN Stack, Data Structures & Algorithms, Cloud Infrastructure, AI Integration' },
  location: { type: String, default: 'Andhra Pradesh, India' },
  availability: { type: String, default: 'Open for Internships & Software Engineering Roles' },
  email: { type: String, default: 'vasanreddy1331@gmail.com' },
  phone: { type: String, default: '' },
  github: { type: String, default: 'https://github.com/' },
  linkedin: { type: String, default: 'https://www.linkedin.com/in/venkatasiva-reddy/' },
  degree: { type: String, default: 'B.Tech' },
  branch: { type: String, default: 'Computer Science and Engineering' },
  college: { type: String, default: 'Rajeev Gandhi Memorial College of Engineering and Technology' },
  graduationYear: { type: Number, default: 2027 },
  cgpa: { type: Number, default: 8.1 }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
