import React, { useEffect, useState } from 'react';
import { getProfile, getEducation, getCodingProfiles, getAchievements, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { ExternalLink, Trophy, Code2 } from 'lucide-react';

const AboutPage = () => {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "About | Venkata Siva Reddy";
    window.scrollTo(0, 0);
    
    const cachedProfile = localStorage.getItem('siva_profile');
    if (cachedProfile) setProfile(JSON.parse(cachedProfile));

    Promise.allSettled([
      getProfile(), getEducation(), getCodingProfiles(), getAchievements()
    ]).then(([profRes, eduRes, codRes, achRes]) => {
      if (profRes.status === 'fulfilled' && profRes.value.data?.data) {
        setProfile(profRes.value.data.data);
        localStorage.setItem('siva_profile', JSON.stringify(profRes.value.data.data));
      }
      if (eduRes.status === 'fulfilled' && eduRes.value.data?.data) setEducation(eduRes.value.data.data);
      if (codRes.status === 'fulfilled' && codRes.value.data?.data) setCodingProfiles(codRes.value.data.data);
      if (achRes.status === 'fulfilled' && achRes.value.data?.data) setAchievements(achRes.value.data.data);
      setLoading(false);
    });
  }, []);

  if (loading && !profile) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  return (
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-16 font-grotesk text-white">About</h1>
      </RevealOnScroll>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-24 text-editorial-textMain text-lg leading-relaxed">
          
          <RevealOnScroll delay={100}>
            <section>
              <p className="mb-6 whitespace-pre-wrap">{profile?.longBio}</p>
              <p className="mb-6">My core focus lies in {profile?.currentFocus}. {profile?.careerGoal}</p>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section>
              <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-8 border-b border-editorial-border pb-2">Education</h2>
              <div className="space-y-12">
                {education.map((edu, idx) => (
                  <div key={edu._id || idx} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4">
                    <div className="font-mono text-xs text-editorial-textMuted uppercase pt-1">
                      {edu.startYear || edu.startDate} — {edu.endYear || edu.endDate || 'Present'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{edu.degree} in {edu.branch || edu.field}</h3>
                      <p className="text-editorial-textMuted mb-2">{edu.college || edu.institution}</p>
                      {edu.cgpa && <p className="text-sm font-mono text-editorial-accent mb-2">CGPA: {edu.cgpa}</p>}
                      <p className="text-sm">{edu.description}</p>
                    </div>
                  </div>
                ))}
                {education.length === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4">
                    <div className="font-mono text-xs text-editorial-textMuted uppercase pt-1">2023 — 2027</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{profile?.degree} in {profile?.branch}</h3>
                      <p className="text-editorial-textMuted">{profile?.college}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </RevealOnScroll>

          {codingProfiles.length > 0 && (
            <RevealOnScroll>
              <section>
                <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-8 border-b border-editorial-border pb-2 flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Developer Profiles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {codingProfiles.map((cp, idx) => (
                    <a key={cp._id} href={cp.profileUrl} target="_blank" rel="noreferrer" className={`block p-6 border border-editorial-border rounded-xl bg-[#121212] hover:border-editorial-textMuted transition-all interactive-lift animate-fade-up delay-${(idx+1)*100}`}>
                      <div className="flex items-center gap-4 mb-4">
                        {cp.logo ? (
                          <img src={resolveMediaUrl(cp.logo)} alt={cp.platform} className="w-8 h-8 object-contain" />
                        ) : <Code2 className="w-8 h-8 text-editorial-textMuted" />}
                        <h3 className="text-lg font-bold text-white">{cp.platform}</h3>
                      </div>
                      <div className="space-y-2 font-mono text-xs text-editorial-textMuted">
                        <div className="flex justify-between">
                          <span>Username</span>
                          <span className="text-white">{cp.username}</span>
                        </div>
                        {cp.problemsSolved && (
                          <div className="flex justify-between">
                            <span>Solved</span>
                            <span className="text-white">{cp.problemsSolved}</span>
                          </div>
                        )}
                        {cp.rating && (
                          <div className="flex justify-between">
                            <span>Rating</span>
                            <span className="text-editorial-accent">{cp.rating}</span>
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          )}

          {achievements.length > 0 && (
            <RevealOnScroll>
              <section>
                <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-8 border-b border-editorial-border pb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> Selected Achievements
                </h2>
                <div className="space-y-6">
                  {achievements.map((ach, idx) => (
                    <div key={ach._id} className={`grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-4 animate-fade-up delay-${(idx+1)*100}`}>
                      <div className="font-mono text-xs text-editorial-textMuted pt-1">{ach.year}</div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                          {ach.title}
                          {ach.rank && <span className="px-2 py-0.5 rounded-sm bg-editorial-accent/10 text-editorial-accent font-mono text-[10px] border border-editorial-accent/20">{ach.rank}</span>}
                        </h4>
                        <div className="text-sm font-mono text-editorial-textMuted mb-2">{ach.organization} {ach.event ? `• ${ach.event}` : ''}</div>
                        <p className="text-sm text-editorial-textMain">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          )}

        </div>

        <div className="lg:col-span-4">
          <RevealOnScroll delay={200} className="sticky top-32">
            <div className="border border-editorial-border p-6 bg-editorial-surface rounded-xl overflow-hidden interactive-lift">
              <div className="flex justify-center mb-6">
                <img 
                  src={resolveMediaUrl(profile?.profileImage) || '/Avatar.png'} 
                  alt="Venkata Siva Reddy" 
                  className="w-40 h-40 sm:w-56 sm:h-56 object-cover rounded-full img-editorial border-none transition-all duration-700"
                />
              </div>
              <div className="space-y-4 font-mono text-xs text-editorial-textMuted uppercase tracking-wider">
                <div className="flex justify-between border-b border-editorial-border pb-2">
                  <span>Location</span>
                  <span className="text-white text-right">{profile?.location}</span>
                </div>
                <div className="flex justify-between border-b border-editorial-border pb-2">
                  <span>Email</span>
                  <span className="text-white text-right">{profile?.email}</span>
                </div>
                <div className="flex justify-between border-b border-editorial-border pb-2">
                  <span>Status</span>
                  <span className="text-editorial-accent text-right">{profile?.availability}</span>
                </div>
                {profile?.github && (
                  <div className="flex justify-between border-b border-editorial-border pb-2 pt-2">
                    <span>GitHub</span>
                    <a href={profile.github} target="_blank" rel="noreferrer" className="text-white text-right hover:text-editorial-accent flex items-center gap-1">
                      vasanreddy <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {profile?.linkedin && (
                  <div className="flex justify-between border-b border-editorial-border pb-2 pt-2">
                    <span>LinkedIn</span>
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-white text-right hover:text-editorial-accent flex items-center gap-1">
                      venkatasiva-reddy <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
