import React, { useEffect, useState } from 'react';
import HeroSection from '../components/sections/HeroSection';
import DigitalCampusSection from '../components/sections/DigitalCampusSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import PlaygroundSection from '../components/sections/PlaygroundSection';
import SkillsSection from '../components/sections/SkillsSection';
import CareerRoadSection from '../components/sections/CareerRoadSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import CertificationsSection from '../components/sections/CertificationsSection';
import AchievementsSection from '../components/sections/AchievementsSection';
import LearningJournalSection from '../components/sections/LearningJournalSection';
import ContactSection from '../components/sections/ContactSection';
import WorkspaceSection from '../components/sections/WorkspaceSection';
import { useAnalytics } from '../context/AnalyticsContext';

import { 
  getProfile, getProjects, getSkills, getEducation, 
  getExperience, getCertifications, getAchievements, 
  getCodingProfiles, getCareerNodes, getResume 
} from '../services/api';

const HomePage = () => {
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [careerNodes, setCareerNodes] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');

  const { registerSectionRef } = useAnalytics();

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const [
        profRes, projRes, skillRes, eduRes, 
        expRes, certRes, achRes, codRes, carRes, resRes
      ] = await Promise.allSettled([
        getProfile(),
        getProjects(),
        getSkills(),
        getEducation(),
        getExperience(),
        getCertifications(),
        getAchievements(),
        getCodingProfiles(),
        getCareerNodes(),
        getResume()
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.data?.data) setProfile(profRes.value.data.data);
      if (projRes.status === 'fulfilled' && projRes.value.data?.data) setProjects(projRes.value.data.data);
      if (skillRes.status === 'fulfilled' && skillRes.value.data?.data) setSkills(skillRes.value.data.data);
      if (eduRes.status === 'fulfilled' && eduRes.value.data?.data) setEducation(eduRes.value.data.data);
      if (expRes.status === 'fulfilled' && expRes.value.data?.data) setExperience(expRes.value.data.data);
      if (certRes.status === 'fulfilled' && certRes.value.data?.data) setCertifications(certRes.value.data.data);
      if (achRes.status === 'fulfilled' && achRes.value.data?.data) setAchievements(achRes.value.data.data);
      if (codRes.status === 'fulfilled' && codRes.value.data?.data) setCodingProfiles(codRes.value.data.data);
      if (carRes.status === 'fulfilled' && carRes.value.data?.data) setCareerNodes(carRes.value.data.data);
      if (resRes.status === 'fulfilled' && resRes.value.data?.data) setResumeUrl(resRes.value.data.data.url);
    } catch (err) {
      console.error('Error fetching home portfolio data:', err);
    }
  };

  // ─── Three-Tier Background System ───────────────────────────────────────
  // Tier 1 (Nav/Footer): #cfd5de light / #03030a dark  → handled in CSS
  // Tier 2 (Even 0,2,4,6,8,10): page base
  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300";
  // Tier 3 (Odd  1,3,5,7,9,11): subtle ~20% step from Tier 2
  const bgOdd  = "w-full bg-[#e8ebf0] dark:bg-[#13131e] transition-colors duration-300";
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-0">
      {/* 0. HERO (Even) */}
      <section ref={(el) => registerSectionRef(el, 'Hero')} id="hero" className={bgEven}>
        <HeroSection profile={profile} resumeUrl={resumeUrl} />
      </section>

      {/* 1. ABOUT & PHILOSOPHY (Odd) */}
      <section ref={(el) => registerSectionRef(el, 'Digital Campus')} id="campus" className={bgOdd}>
        <DigitalCampusSection profile={profile} education={education} />
      </section>

      {/* 2. CASE STUDIES & FEATURED PROJECTS (Even) */}
      <section ref={(el) => registerSectionRef(el, 'Projects')} id="projects" className={bgEven}>
        <ProjectsSection projects={projects} />
      </section>

      {/* 3. LAB & EXPERIMENTS (Odd) */}
      <section ref={(el) => registerSectionRef(el, 'Playground')} id="playground" className={bgOdd}>
        <PlaygroundSection />
      </section>

      {/* 4. SKILLS & COMPETENCIES (Even) */}
      <section ref={(el) => registerSectionRef(el, 'Skills')} id="skills" className={bgEven}>
        <SkillsSection skills={skills} />
      </section>

      {/* 5. CAREER ROAD TIMELINE (Odd) */}
      <section ref={(el) => registerSectionRef(el, 'Career Road')} id="career" className={bgOdd}>
        <CareerRoadSection careerNodes={careerNodes} />
      </section>

      {/* 6. EXPERIENCE & CODING PROFILES (Even) */}
      <section ref={(el) => registerSectionRef(el, 'Experience')} id="experience" className={bgEven}>
        <ExperienceSection 
          education={education} 
          experience={experience}
          codingProfiles={codingProfiles}
        />
      </section>

      {/* 7. CERTIFICATIONS (Odd) */}
      <section ref={(el) => registerSectionRef(el, 'Certifications')} id="certifications" className={bgOdd}>
        <CertificationsSection certifications={certifications} />
      </section>

      {/* 8. ACHIEVEMENTS & HONORS (Even) */}
      <section ref={(el) => registerSectionRef(el, 'Achievements')} id="achievements" className={bgEven}>
        <AchievementsSection achievements={achievements} />
      </section>

      {/* 9. CURRENTLY LEARNING JOURNAL (Odd) */}
      <section ref={(el) => registerSectionRef(el, 'Learning Journal')} id="journal" className={bgOdd}>
        <LearningJournalSection />
      </section>

      {/* 10. CONTACT / GET IN TOUCH (Even) */}
      <section ref={(el) => registerSectionRef(el, 'Contact')} id="contact" className={bgEven}>
        <ContactSection email={profile.email} profile={profile} />
      </section>

      {/* 11. WORKSPACE (Odd) */}
      <section ref={(el) => registerSectionRef(el, 'Workspace')} id="workspace" className={bgOdd}>
        <WorkspaceSection />
      </section>
    </div>
  );
};

export default HomePage;
