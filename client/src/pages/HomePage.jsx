import React, { useEffect, useState } from 'react';
import HeroSection from '../components/sections/HeroSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import SkillsSection from '../components/sections/SkillsSection';
import ContactSection from '../components/sections/ContactSection';
import AdUnit from '../components/common/AdUnit';
import { useAnalytics } from '../context/AnalyticsContext';
import useScrollObserver from '../hooks/useScrollObserver';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { 
  getProfile, getProjects, getSkills, getResume 
} from '../services/api';

const HomePage = () => {
  useScrollObserver();
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');

  const { registerSectionRef } = useAnalytics();

  useEffect(() => {
    document.title = "Venkata Siva Reddy | Full Stack Engineer";
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const [
        profRes, projRes, skillRes, resRes
      ] = await Promise.allSettled([
        getProfile(),
        getProjects(),
        getSkills(),
        getResume()
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.data?.data) setProfile(profRes.value.data.data);
      if (projRes.status === 'fulfilled' && projRes.value.data?.data) setProjects(projRes.value.data.data.slice(0, 3)); // Only 3 featured
      if (skillRes.status === 'fulfilled' && skillRes.value.data?.data) setSkills(skillRes.value.data.data.slice(0, 4)); // Only top categories
      if (resRes.status === 'fulfilled' && resRes.value.data?.data) setResumeUrl(resRes.value.data.data.url);
    } catch (err) {
      console.error('Error fetching home portfolio data:', err);
    }
  };

  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300";
  const bgOdd  = "w-full bg-[#e8ebf0] dark:bg-[#13131e] transition-colors duration-300";

  return (
    <div className="w-full space-y-0">
      <section ref={(el) => registerSectionRef(el, 'Hero')} id="hero" className={bgEven}>
        <HeroSection profile={profile} resumeUrl={resumeUrl} />
      </section>

      <section ref={(el) => registerSectionRef(el, 'Projects')} id="projects" className={bgOdd}>
        <ProjectsSection projects={projects} />
        <div className="flex justify-center pb-24">
          <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-500/20">
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section ref={(el) => registerSectionRef(el, 'Skills')} id="skills" className={bgEven}>
        <SkillsSection skills={skills} />
        <div className="flex justify-center pb-24">
          <Link to="/skills" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
            Explore All Skills <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <div className="w-full bg-[#edf0f5] dark:bg-[#0f0f1a] border-y border-slate-200/50 dark:border-zinc-800/50 py-3 flex items-center justify-center">
        <AdUnit
          slot="7325490812"
          format="auto"
          fullWidth={true}
          className="max-w-4xl mx-auto px-4"
        />
      </div>

      <section ref={(el) => registerSectionRef(el, 'Contact')} id="contact" className={bgOdd}>
        <ContactSection email={profile.email} profile={profile} />
      </section>
    </div>
  );
};

export default HomePage;
