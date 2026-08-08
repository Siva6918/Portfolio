import React, { useState } from 'react';
import { 
  Building2, GraduationCap, Cpu, BookOpen, FlaskConical, 
  Trophy, Sparkles, ExternalLink, Github 
} from 'lucide-react';

const DigitalCampusSection = ({ profile, skills = [], education = [], experience = [], projects = [], certifications = [], achievements = [] }) => {
  const [activeBuilding, setActiveBuilding] = useState('main');
  const [activeProject, setActiveProject] = useState(projects[0] || null);

  const collegeName = profile?.educationSummary?.college || 'RAJEEV GANDHI MEMORIAL COLLEGE OF ENGINEERING AND TECHNOLOGY';
  const cgpa = profile?.educationSummary?.cgpa || '8.1';
  const batch = '2023 — 2027';

  // Library Shelves Topics
  const libraryShelves = [
    { title: 'Data Structures & Algorithms', count: '300+ Solved', desc: 'Arrays, Trees, Graphs, Dynamic Programming & Complexity Optimization' },
    { title: 'Full Stack MERN Architecture', count: '5+ Apps', desc: 'React 18, Node.js, Express, MongoDB, Redux Toolkit & RESTful APIs' },
    { title: 'AI & Machine Learning Integration', count: 'ML Models', desc: 'FastAPI, OpenAI API, PyTorch, Predictive Analytics & RAG Pipelines' },
    { title: 'Cloud Infrastructure & AWS', count: 'Cloud Native', desc: 'EC2, S3, Docker, Serverless, Nginx Reverse Proxy & CI/CD Pipelines' }
  ];

  return (
    <section id="digital-campus" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Campus Header */}
        <div className="flex items-center justify-between border-b border-[#2d2d3a] pb-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#121217] border border-[#2d2d3a] flex items-center justify-center text-[#06b6d4]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-[#06b6d4]">
                VIRTUAL CAMPUS
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#fafafa]">
                DIGITAL CAMPUS
              </h3>
            </div>
          </div>
        </div>

        {/* Campus Map Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveBuilding('main')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold font-mono transition-all ${
              activeBuilding === 'main'
                ? 'bg-[#6366f1]/20 text-[#fafafa] border border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'glass-card text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#6366f1]" />
            <span>Main Campus Building</span>
          </button>

          <button
            onClick={() => setActiveBuilding('cse-lab')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold font-mono transition-all ${
              activeBuilding === 'cse-lab'
                ? 'bg-[#6366f1]/20 text-[#fafafa] border border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'glass-card text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#c084fc]" />
            <span>CSE Laboratory</span>
          </button>

          <button
            onClick={() => setActiveBuilding('library')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold font-mono transition-all ${
              activeBuilding === 'library'
                ? 'bg-[#6366f1]/20 text-[#fafafa] border border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'glass-card text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#06b6d4]" />
            <span>Digital Library</span>
          </button>

          <button
            onClick={() => setActiveBuilding('project-lab')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold font-mono transition-all ${
              activeBuilding === 'project-lab'
                ? 'bg-[#6366f1]/20 text-[#fafafa] border border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'glass-card text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-[#10b981]" />
            <span>Project Laboratory</span>
          </button>

          <button
            onClick={() => setActiveBuilding('plaza')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold font-mono transition-all ${
              activeBuilding === 'plaza'
                ? 'bg-[#6366f1]/20 text-[#fafafa] border border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'glass-card text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#c084fc]" />
            <span>Achievement Plaza</span>
          </button>
        </div>

        {/* Dynamic Campus Content Display */}
        <div className="transition-all duration-300">
          
          {/* 1. 🎓 MAIN CAMPUS BUILDING */}
          {activeBuilding === 'main' && (
            <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[#2d2d3a] relative overflow-hidden group max-w-4xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#2d2d3a] pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1]">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#fafafa]">
                      {collegeName}
                    </h3>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-[#121217] border border-[#2d2d3a] text-right">
                  <span className="text-xs font-mono font-bold text-[#10b981]">{batch}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-[#2d2d3a]">
                  <span className="block text-xs font-mono text-[#a1a1aa] uppercase font-bold">Degree & Major</span>
                  <span className="text-base font-bold text-[#fafafa] mt-1 block">B.Tech Computer Science</span>
                </div>
                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-[#2d2d3a]">
                  <span className="block text-xs font-mono text-[#a1a1aa] uppercase font-bold">Academic Performance</span>
                  <span className="text-2xl font-extrabold text-[#06b6d4] font-mono mt-1 block">{cgpa} CGPA</span>
                </div>
                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-[#2d2d3a]">
                  <span className="block text-xs font-mono text-[#a1a1aa] uppercase font-bold">Graduation Year</span>
                  <span className="text-2xl font-extrabold text-[#6366f1] font-mono mt-1 block">2027</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. 💻 CSE LABORATORY */}
          {activeBuilding === 'cse-lab' && (
            <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[#2d2d3a] max-w-5xl mx-auto space-y-8">
              
              <div className="rounded-2xl bg-[#09090b] border border-[#2d2d3a] p-5 font-mono text-xs text-[#a1a1aa] space-y-2">
                <div className="flex items-center gap-2 border-b border-[#2d2d3a] pb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="text-[10px] text-[#a1a1aa] ml-2">cse-lab-terminal ~ bash</span>
                </div>
                <p className="text-[#10b981]">$ java -version ➔ Java OpenJDK 21 (Data Structures & Algorithm Engine)</p>
                <p className="text-[#06b6d4]">$ npm run dev ➔ Vite + React 18 + Node.js Express Server Active</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-mono font-bold text-[#c084fc] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Technical Core</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {skills.slice(0, 15).map((skill) => (
                    <div
                      key={skill._id || skill.name}
                      className="glass-card p-3 rounded-2xl border border-[#2d2d3a] hover:border-[#6366f1] transition-all flex items-center gap-2.5 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#121217] p-1 flex items-center justify-center shrink-0 border border-[#2d2d3a]">
                        <img src={skill.logo || '/Avatar.png'} alt={skill.name} className="w-5 h-5 object-contain" />
                      </div>
                      <span className="text-xs font-bold text-[#fafafa] group-hover:text-[#6366f1] transition-colors truncate">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 3. 📚 DIGITAL LIBRARY */}
          {activeBuilding === 'library' && (
            <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[#2d2d3a] max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#2d2d3a] pb-4">
                <h4 className="text-lg font-bold text-[#fafafa] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#06b6d4]" />
                  <span>Digital Library & Learning Paths</span>
                </h4>
                <span className="text-xs font-mono font-bold text-[#06b6d4]">300+ DSA Solved</span>
              </div>

              <div className="space-y-4">
                {libraryShelves.map((shelf) => (
                  <div
                    key={shelf.title}
                    className="p-5 rounded-2xl bg-[#121217]/70 border border-[#2d2d3a] hover:border-[#06b6d4]/40 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-base font-bold text-[#fafafa] group-hover:text-[#06b6d4] transition-colors">
                        {shelf.title}
                      </h5>
                      <span className="px-3 py-1 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] text-[10px] font-mono font-bold border border-[#06b6d4]/20">
                        {shelf.count}
                      </span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      {shelf.desc}
                    </p>

                    <div className="w-full h-1 rounded-full bg-[#2d2d3a] overflow-hidden pt-1">
                      <div className="h-full bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#10b981] rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 🧪 PROJECT LABORATORY */}
          {activeBuilding === 'project-lab' && (
            <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[#2d2d3a] max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between border-b border-[#2d2d3a] pb-4">
                <h4 className="text-lg font-bold text-[#fafafa] flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#10b981]" />
                  <span>Project Stations</span>
                </h4>
              </div>

              <div className="flex flex-wrap gap-3">
                {projects.map((proj) => (
                  <button
                    key={proj._id || proj.slug}
                    onClick={() => setActiveProject(proj)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                      activeProject?._id === proj._id
                        ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]'
                        : 'bg-[#121217] text-[#a1a1aa] border border-[#2d2d3a] hover:text-[#fafafa]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                    <span>{proj.title}</span>
                  </button>
                ))}
              </div>

              {activeProject && (
                <div className="p-6 rounded-2xl bg-[#121217] border border-[#2d2d3a] space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#10b981] uppercase font-bold">{activeProject.category}</span>
                      <h5 className="text-xl font-bold text-[#fafafa] mt-0.5">{activeProject.title}</h5>
                    </div>
                    <div className="flex items-center gap-3">
                      {activeProject.repositoryUrl && (
                        <a
                          href={activeProject.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2d2d3a] text-xs font-mono text-[#fafafa] hover:text-[#06b6d4]"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {activeProject.liveUrl && (
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10b981]/20 text-[#10b981] text-xs font-mono font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    {activeProject.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {activeProject.technologies?.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-md bg-[#09090b] text-[10px] font-mono text-[#06b6d4] border border-[#2d2d3a]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. 🏆 ACHIEVEMENT PLAZA */}
          {activeBuilding === 'plaza' && (
            <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[#2d2d3a] max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between border-b border-[#2d2d3a] pb-4">
                <h4 className="text-lg font-bold text-[#fafafa] flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#c084fc]" />
                  <span>Achievement Plaza</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.concat(certifications).slice(0, 6).map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="p-5 rounded-2xl bg-[#121217]/80 border border-[#2d2d3a] hover:border-[#c084fc]/50 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#c084fc] px-2.5 py-0.5 rounded-full bg-[#c084fc]/10 border border-[#c084fc]/20">
                        {item.rank || item.organization || 'Verified Credential'}
                      </span>
                      <span className="text-[10px] font-mono text-[#a1a1aa]">{item.year || item.issueDate}</span>
                    </div>
                    <h5 className="text-base font-bold text-[#fafafa] group-hover:text-[#c084fc] transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      {item.description || item.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default DigitalCampusSection;
