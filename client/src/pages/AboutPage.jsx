import React, { useEffect, useState } from 'react';
import { getProfile, getEducation } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const AboutPage = () => {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "About | Venkata Siva Reddy";
    window.scrollTo(0, 0);
    
    const cachedProfile = localStorage.getItem('siva_profile');
    if (cachedProfile) setProfile(JSON.parse(cachedProfile));

    Promise.allSettled([getProfile(), getEducation()]).then(([profRes, eduRes]) => {
      if (profRes.status === 'fulfilled' && profRes.value.data?.data) {
        setProfile(profRes.value.data.data);
        localStorage.setItem('siva_profile', JSON.stringify(profRes.value.data.data));
      }
      if (eduRes.status === 'fulfilled' && eduRes.value.data?.data) {
        setEducation(eduRes.value.data.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading && !profile) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  return (
    <div className="section-container animate-fade-in pt-32">
      <h1 className="text-4xl sm:text-5xl font-bold mb-16 font-grotesk text-white">About</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12 text-editorial-textMain text-lg leading-relaxed">
          <section>
            <p className="mb-6">{profile?.longBio}</p>
            <p className="mb-6">My core focus lies in {profile?.currentFocus}. {profile?.careerGoal}</p>
          </section>

          <section>
            <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-6 border-b border-editorial-border pb-2">Education</h2>
            <div className="space-y-8">
              {education.map((edu, idx) => (
                <div key={edu._id || idx} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
                  <div className="font-mono text-xs text-editorial-textMuted uppercase pt-1">
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{edu.degree} in {edu.field}</h3>
                    <p className="text-editorial-textMuted mb-2">{edu.institution}</p>
                    <p className="text-sm">{edu.description}</p>
                  </div>
                </div>
              ))}
              {education.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
                  <div className="font-mono text-xs text-editorial-textMuted uppercase pt-1">2023 — 2027</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{profile?.degree} in {profile?.branch}</h3>
                    <p className="text-editorial-textMuted">{profile?.college}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="border border-editorial-border p-6 bg-editorial-surface grayscale hover:grayscale-0 transition-all duration-500">
            <img 
              src={profile?.profileImage || '/Avatar.png'} 
              alt="Venkata Siva Reddy" 
              className="w-full h-auto mb-6 object-cover"
            />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
