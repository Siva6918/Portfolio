import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSkillCategories } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const SkillsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Skills | Venkata Siva Reddy";
    window.scrollTo(0, 0);

    const cached = localStorage.getItem('siva_skill_categories');
    if (cached) {
      setCategories(JSON.parse(cached));
      setLoading(false);
    }
    
    getSkillCategories().then(res => {
      if (res.data && res.data.data) {
        setCategories(res.data.data);
        localStorage.setItem('siva_skill_categories', JSON.stringify(res.data.data));
      }
      setLoading(false);
    });
  }, []);

  if (loading && categories.length === 0) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  return (
    <div className="section-container animate-fade-in pt-32">
      <h1 className="text-4xl sm:text-5xl font-bold mb-16 font-grotesk text-white">Skills & Arsenal</h1>
      
      <div className="space-y-16">
        {categories.map((cat) => {
          // Assuming backend populates `skills` array inside categories
          const skills = cat.skills || [];
          if (skills.length === 0) return null;
          
          return (
            <section key={cat._id} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              <h2 className="font-mono text-sm text-editorial-accent uppercase tracking-widest pt-2">
                {cat.name}
              </h2>
              
              <div className="flex flex-wrap gap-4">
                {skills.map(skill => (
                  <div key={skill._id} className="group flex items-center border border-editorial-border bg-editorial-surface px-4 py-2 hover:border-editorial-accent transition-colors">
                    <span className="font-grotesk text-white text-lg">{skill.name}</span>
                    {/* Assuming we can link to work filtered by skill in the future, for now just show text */}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {categories.length === 0 && (
          <div className="text-editorial-textMuted font-mono text-sm uppercase tracking-widest py-8">
            No skills data currently available.
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;
