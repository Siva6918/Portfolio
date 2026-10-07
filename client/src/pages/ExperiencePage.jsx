import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import useScrollObserver from '../hooks/useScrollObserver';
import ExperienceSection from '../components/sections/ExperienceSection';
import CareerRoadSection from '../components/sections/CareerRoadSection';
import { getExperience, getEducation, getCodingProfiles, getCareerNodes } from '../services/api';

const ExperiencePage = () => {
  useScrollObserver();
  const { registerSectionRef } = useAnalytics();
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [careerNodes, setCareerNodes] = useState([]);

  useEffect(() => {
    document.title = "Experience | Venkata Siva Reddy";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, eduRes, codRes, carRes] = await Promise.allSettled([
        getExperience(),
        getEducation(),
        getCodingProfiles(),
        getCareerNodes()
      ]);

      if (expRes.status === 'fulfilled' && expRes.value.data?.data) setExperience(expRes.value.data.data);
      if (eduRes.status === 'fulfilled' && eduRes.value.data?.data) setEducation(eduRes.value.data.data);
      if (codRes.status === 'fulfilled' && codRes.value.data?.data) setCodingProfiles(codRes.value.data.data);
      if (carRes.status === 'fulfilled' && carRes.value.data?.data) setCareerNodes(carRes.value.data.data);
    } catch (err) {
      console.error('Error fetching experience data:', err);
    }
  };

  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300 pt-16";
  const bgOdd  = "w-full bg-[#e8ebf0] dark:bg-[#13131e] transition-colors duration-300";

  return (
    <div className="w-full space-y-0">
      <section ref={(el) => registerSectionRef(el, 'Career Road')} className={bgEven}>
        <CareerRoadSection careerNodes={careerNodes} />
      </section>

      <section ref={(el) => registerSectionRef(el, 'Experience Details')} className={bgOdd}>
        <ExperienceSection 
          education={education} 
          experience={experience}
          codingProfiles={codingProfiles}
        />
      </section>
    </div>
  );
};

export default ExperiencePage;
