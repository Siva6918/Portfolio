import React, { useEffect, useState } from 'react';
import { getCertifications, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { Award, ExternalLink, Search } from 'lucide-react';

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "Certifications | Venkata Siva Reddy";
    window.scrollTo(0, 0);

    const cached = localStorage.getItem('siva_certifications');
    if (cached) {
      setCertifications(JSON.parse(cached));
      setLoading(false);
    }
    
    getCertifications().then(res => {
      if (res.data && res.data.data) {
        setCertifications(res.data.data);
        localStorage.setItem('siva_certifications', JSON.stringify(res.data.data));
      }
      setLoading(false);
    });
  }, []);

  if (loading && certifications.length === 0) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  const filteredCertifications = certifications.filter(cert => {
    const searchString = `${cert.title || cert.name} ${cert.organization || cert.issuer}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  const palette = [
    { border: 'border-marigold/30 hover:border-marigold', text: 'text-marigold', bg: 'bg-marigold/10', glow: 'rgba(245,158,11,0.15)' },
    { border: 'border-neonRose/30 hover:border-neonRose', text: 'text-neonRose', bg: 'bg-neonRose/10', glow: 'rgba(244,63,94,0.15)' },
    { border: 'border-iceSilver/30 hover:border-iceSilver', text: 'text-iceSilver', bg: 'bg-iceSilver/10', glow: 'rgba(226,232,240,0.15)' },
    { border: 'border-solarAmber/30 hover:border-solarAmber', text: 'text-solarAmber', bg: 'bg-solarAmber/10', glow: 'rgba(251,191,36,0.15)' },
    { border: 'border-cyberRose/30 hover:border-cyberRose', text: 'text-cyberRose', bg: 'bg-cyberRose/10', glow: 'rgba(251,113,133,0.15)' }
  ];

  return (
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        {/* Tactical Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold/10 border border-marigold/30 text-marigold text-xs font-mono mb-4">
          <Award className="w-3.5 h-3.5 text-marigold" />
          <span className="tracking-widest uppercase font-bold">CREDENTIALS DOSSIER // VERIFIED ACCREDITATIONS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-grotesk text-white">
          Certifications &{' '}
          <span className="bg-gradient-to-r from-marigold via-neonRose to-iceSilver bg-clip-text text-transparent">
            Accreditations
          </span>
        </h1>
        <p className="text-iceSilver-dark text-base sm:text-lg mb-8 max-w-2xl font-mono">
          Industry-validated credentials in Cloud, Full Stack Engineering, AI, and Software Architecture.
        </p>
        
        <div className="relative max-w-md mb-16">
          <input
            type="text"
            placeholder="Search certifications or issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101016] border border-[#242834] text-iceSilver p-4 pl-12 font-mono text-sm rounded-xl focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold/30 transition-all placeholder:text-zinc-600"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        </div>
      </RevealOnScroll>
      
      <div className="flex flex-col">
        {filteredCertifications.map((cert, index) => {
          const colorMeta = palette[index % palette.length];
          return (
            <RevealOnScroll key={cert._id || index} delay={100} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 py-10 border-b border-[#242834] group">
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest pt-1 flex flex-col gap-2">
                <div className="text-zinc-400">{cert.issueDate || cert.date}</div>
                <div className={`font-bold ${colorMeta.text}`}>{cert.organization || cert.issuer}</div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3 font-grotesk group-hover:text-marigold transition-colors">
                    {cert.title || cert.name}
                  </h3>
                  {cert.description && (
                    <p className="text-iceSilver-dark text-base mb-6 max-w-2xl leading-relaxed">{cert.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider items-center">
                    {cert.credentialId && (
                      <span className="text-zinc-400 border border-[#242834] px-3 py-1.5 bg-[#101016] rounded-md">ID: {cert.credentialId}</span>
                    )}
                    {(cert.credentialUrl || cert.url) && (
                      <a 
                        href={cert.credentialUrl || cert.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={`text-black font-bold px-3.5 py-1.5 transition-all rounded-md flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95`}
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}
                      >
                        <Award className="w-3 h-3 text-black" /> Verify Credential <ExternalLink className="w-3 h-3 text-black" />
                      </a>
                    )}
                  </div>
                </div>

                {cert.image && (
                  <div className="w-full md:w-64 shrink-0">
                    <a href={resolveMediaUrl(cert.image)} target="_blank" rel="noreferrer" className="block overflow-hidden bg-[#101016] p-2 rounded-xl border border-[#242834] hover:border-marigold transition-all interactive-lift">
                      <img 
                        src={resolveMediaUrl(cert.image)} 
                        alt={cert.title || cert.name} 
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </a>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          );
        })}

        {certifications.length === 0 && (
          <div className="text-zinc-500 font-mono text-sm uppercase tracking-widest py-8">
            No certifications data currently available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsPage;
