import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp, Flame } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { getProfile } from '../../services/api';

const Footer = () => {
  const { trackInteraction } = useAnalytics();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(res => {
      if (res?.data?.data) {
        setProfile(res.data.data);
      }
    }).catch(console.error);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const internalLinks = [
    { name: 'About', path: '/#about' },
    { name: 'Work', path: '/work' },
    { name: 'Experience', path: '/experience' },
    { name: 'Skills', path: '/skills' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Playground', path: '/playground' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="w-full border-t border-[#242834] py-16 mt-20 bg-[#08080a]">
      <div className="section-container !py-0 flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-marigold fill-marigold" />
            <h3 className="font-grotesk font-bold text-iceSilver tracking-widest uppercase text-xl">
              {profile?.name || 'Venkata Siva Reddy'}
            </h3>
          </div>
          <p className="text-xs font-mono text-iceSilver-dark uppercase tracking-widest mb-6">
            Software Engineer · Free Fire Clutch Tactician · RGMCET 2027
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-iceSilver-dark uppercase">
            {internalLinks.map(link => (
              <Link key={link.path} to={link.path} className="hover:text-marigold transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex items-center gap-6 text-iceSilver-dark">
            <a
              href={profile?.socials?.github || "https://github.com/vasanreddy"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction('github_click', 'Footer GitHub', 'Footer')}
              className="hover:text-marigold transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={profile?.socials?.linkedin || "https://www.linkedin.com/in/venkatasiva-reddy/"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction('linkedin_click', 'Footer LinkedIn', 'Footer')}
              className="hover:text-marigold transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${profile?.email || "vasanreddy1331@gmail.com"}`}
              onClick={() => trackInteraction('email_click', 'Footer Email', 'Footer')}
              className="hover:text-marigold transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            <button 
              onClick={scrollToTop} 
              className="flex items-center gap-2 hover:text-white hover:border-marigold transition-colors ml-4 font-mono text-xs uppercase border border-[#242834] px-3 py-1.5 bg-[#101016] text-iceSilver rounded-md"
            >
              <ArrowUp className="w-4 h-4 text-neonRose" /> Top
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-mono text-iceSilver-dark uppercase tracking-widest">
            <span>© {new Date().getFullYear()} {profile?.name || 'Venkata Siva Reddy'}</span>
            <span className="w-1 h-1 rounded-full bg-marigold"></span>
            <span>MERN Stack & AI Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
