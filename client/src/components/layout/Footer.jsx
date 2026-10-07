import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

const Footer = () => {
  const { trackInteraction } = useAnalytics();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const internalLinks = [
    { name: 'Experience', path: '/experience' },
    { name: 'Skills', path: '/skills' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Achievements', path: '/achievements' }
  ];

  return (
    <footer className="w-full border-t border-editorial-border py-16 mt-20">
      <div className="section-container !py-0 flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-grotesk font-bold text-white tracking-widest uppercase mb-2 text-xl">
            Venkata Siva Reddy
          </h3>
          <p className="text-xs font-mono text-editorial-textMuted uppercase tracking-widest mb-6">
            Software Engineer
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-editorial-textMuted uppercase">
            {internalLinks.map(link => (
              <Link key={link.path} to={link.path} className="hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex items-center gap-6 text-editorial-textMuted">
            <a
              href="https://github.com/vasanreddy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction('github_click', 'Footer GitHub', 'Footer')}
              className="hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/venkatasiva-reddy/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction('linkedin_click', 'Footer LinkedIn', 'Footer')}
              className="hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:vasanreddy1331@gmail.com"
              onClick={() => trackInteraction('email_click', 'Footer Email', 'Footer')}
              className="hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            <button 
              onClick={scrollToTop} 
              className="flex items-center gap-2 hover:text-white transition-colors ml-4 font-mono text-xs uppercase border border-editorial-border px-3 py-1.5 bg-[#121212]"
            >
              <ArrowUp className="w-4 h-4" /> Top
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-mono text-editorial-textMuted uppercase tracking-widest">
            <span>© {new Date().getFullYear()} Venkata Siva Reddy</span>
            <span className="w-1 h-1 rounded-full bg-editorial-border"></span>
            <span>Built with React & Node</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
