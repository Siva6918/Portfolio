import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import useScrollObserver from '../hooks/useScrollObserver';
import AchievementsSection from '../components/sections/AchievementsSection';
import { getAchievements } from '../services/api';

const AchievementsPage = () => {
  useScrollObserver();
  const { registerSectionRef } = useAnalytics();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    document.title = "Achievements | Venkata Siva Reddy";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAchievements();
      if (res.data?.data) {
        setAchievements(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
    }
  };

  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300 min-h-screen pt-16";

  return (
    <div className="w-full space-y-0">
      <section ref={(el) => registerSectionRef(el, 'Achievements')} className={bgEven}>
        <AchievementsSection achievements={achievements} />
      </section>
    </div>
  );
};

export default AchievementsPage;
