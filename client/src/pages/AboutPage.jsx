import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import useScrollObserver from '../hooks/useScrollObserver';
import AboutSection from '../components/sections/AboutSection';
import DigitalCampusSection from '../components/sections/DigitalCampusSection';
import LearningJournalSection from '../components/sections/LearningJournalSection';
import { getProfile, getEducation } from '../services/api';

const AboutPage = () => {
  useScrollObserver();
  const { registerSectionRef } = useAnalytics();
  const [profile, setProfile] = useState({});
  const [education, setEducation] = useState([]);

  useEffect(() => {
    document.title = "About | Venkata Siva Reddy";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, eduRes] = await Promise.allSettled([
        getProfile(),
        getEducation()
      ]);
      if (profRes.status === 'fulfilled' && profRes.value.data?.data) setProfile(profRes.value.data.data);
      if (eduRes.status === 'fulfilled' && eduRes.value.data?.data) setEducation(eduRes.value.data.data);
    } catch (err) {
      console.error('Error fetching about data:', err);
    }
  };

  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300";
  const bgOdd  = "w-full bg-[#e8ebf0] dark:bg-[#13131e] transition-colors duration-300";

  return (
    <div className="w-full space-y-0 pt-16">
      <section ref={(el) => registerSectionRef(el, 'About Overview')} className={bgEven}>
        <AboutSection profile={profile} />
      </section>
      
      <section ref={(el) => registerSectionRef(el, 'Digital Campus')} className={bgOdd}>
        <DigitalCampusSection profile={profile} education={education} />
      </section>

      <section ref={(el) => registerSectionRef(el, 'Learning Journal')} className={bgEven}>
        <LearningJournalSection />
      </section>
    </div>
  );
};

export default AboutPage;
