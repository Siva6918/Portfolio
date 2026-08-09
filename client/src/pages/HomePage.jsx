import React, { useEffect, useState } from 'react';
import HeroSection from '../components/sections/HeroSection';
import DigitalCampusSection from '../components/sections/DigitalCampusSection';
import CareerRoadSection from '../components/sections/CareerRoadSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import CertificationsSection from '../components/sections/CertificationsSection';
import AchievementsSection from '../components/sections/AchievementsSection';
import CodingPlatformsSection from '../components/sections/CodingPlatformsSection';
import ContactSection from '../components/sections/ContactSection';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { 
  getProfile, getProjects, getSkills, getEducation, 
  getExperience, getCertifications, getAchievements, 
  getCodingProfiles, getCareerNodes, getResume 
} from '../services/api';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    setLoading(true);
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

      if (profRes.status === 'fulfilled' && profRes.value.data.data) setProfile(profRes.value.data.data);
      if (projRes.status === 'fulfilled' && projRes.value.data.data) setProjects(projRes.value.data.data);
      if (skillRes.status === 'fulfilled' && skillRes.value.data.data) setSkills(skillRes.value.data.data);
      if (eduRes.status === 'fulfilled' && eduRes.value.data.data) setEducation(eduRes.value.data.data);
      if (expRes.status === 'fulfilled' && expRes.value.data.data) setExperience(expRes.value.data.data);
      if (certRes.status === 'fulfilled' && certRes.value.data.data) setCertifications(certRes.value.data.data);
      if (achRes.status === 'fulfilled' && achRes.value.data.data) setAchievements(achRes.value.data.data);
      if (codRes.status === 'fulfilled' && codRes.value.data.data) setCodingProfiles(codRes.value.data.data);
      if (carRes.status === 'fulfilled' && carRes.value.data.data) setCareerNodes(carRes.value.data.data);
      if (resRes.status === 'fulfilled' && resRes.value.data.data) setResumeUrl(resRes.value.data.data.url);
    } catch (err) {
      console.error('Error fetching home portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <SkeletonLoader count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. HERO / DIGITAL SKY */}
      <HeroSection profile={profile} resumeUrl={resumeUrl} />

      {/* 2. 🏫 DIGITAL CAMPUS METAPHOR */}
      <DigitalCampusSection
        profile={profile}
        skills={skills}
        education={education}
        experience={experience}
        projects={projects}
        certifications={certifications}
        achievements={achievements}
      />

      {/* 3. 🛣️ 3D PERSPECTIVE CAREER ROAD */}
      <CareerRoadSection careerNodes={careerNodes} />

      {/* 4. DETAILED SPECIFIC SECTIONS */}
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <ExperienceSection education={education} experience={experience} />
      <CertificationsSection certifications={certifications} />
      <AchievementsSection achievements={achievements} />
      <CodingPlatformsSection profiles={codingProfiles} />
      <ContactSection email={profile.email || 'vasanreddy1331@gmail.com'} />
    </div>
  );
};

export default HomePage;
