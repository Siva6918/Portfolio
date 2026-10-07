import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import useScrollObserver from '../hooks/useScrollObserver';
import SkillsSection from '../components/sections/SkillsSection';
import PlaygroundSection from '../components/sections/PlaygroundSection';
import { getSkills } from '../services/api';

const SkillsPage = () => {
  useScrollObserver();
  const { registerSectionRef } = useAnalytics();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    document.title = "Skills | Venkata Siva Reddy";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getSkills();
      if (res.data?.data) {
        setSkills(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300 pt-16";
  const bgOdd  = "w-full bg-[#e8ebf0] dark:bg-[#13131e] transition-colors duration-300";

  return (
    <div className="w-full space-y-0">
      <section ref={(el) => registerSectionRef(el, 'All Skills')} className={bgEven}>
        <SkillsSection skills={skills} />
      </section>

      <section ref={(el) => registerSectionRef(el, 'Playground')} className={bgOdd}>
        <PlaygroundSection />
      </section>
    </div>
  );
};

export default SkillsPage;
