import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import useScrollObserver from '../hooks/useScrollObserver';
import ProjectsSection from '../components/sections/ProjectsSection';
import { getProjects } from '../services/api';

const ProjectsPage = () => {
  useScrollObserver();
  const { registerSectionRef } = useAnalytics();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    document.title = "Projects | Venkata Siva Reddy";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getProjects();
      if (res.data?.data) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300 min-h-screen pt-16";

  return (
    <div className="w-full space-y-0">
      <section ref={(el) => registerSectionRef(el, 'All Projects')} className={bgEven}>
        <ProjectsSection projects={projects} />
      </section>
    </div>
  );
};

export default ProjectsPage;
