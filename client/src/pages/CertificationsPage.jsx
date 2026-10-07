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

  return (
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 font-grotesk text-white">Certifications</h1>
        
        <div className="relative max-w-md mb-16">
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-editorial-border text-editorial-textMain p-4 pl-12 font-mono text-sm rounded-xl focus:outline-none focus:border-editorial-accent transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-editorial-textMuted" />
        </div>
      </RevealOnScroll>
      
      <div className="flex flex-col">
        {filteredCertifications.map((cert, index) => (
          <RevealOnScroll key={cert._id || index} delay={100} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 py-10 border-b border-editorial-border group">
            <div className="font-mono text-xs text-editorial-textMuted uppercase tracking-widest pt-1 flex flex-col gap-2">
              <div>{cert.issueDate || cert.date}</div>
              <div className="text-editorial-accent">{cert.organization || cert.issuer}</div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 font-grotesk">{cert.title || cert.name}</h3>
                {cert.description && (
                  <p className="text-editorial-textMain text-base mb-6 max-w-2xl">{cert.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-wider items-center">
                  {cert.credentialId && (
                    <span className="text-editorial-textMuted border border-editorial-border px-3 py-1.5 bg-[#121212] rounded-md">ID: {cert.credentialId}</span>
                  )}
                  {(cert.credentialUrl || cert.url) && (
                    <a href={cert.credentialUrl || cert.url} target="_blank" rel="noreferrer" className="text-editorial-accent hover:text-white border border-editorial-accent/30 bg-editorial-accent/10 hover:bg-editorial-accent hover:border-editorial-accent px-3 py-1.5 transition-all rounded-md flex items-center gap-1.5">
                      <Award className="w-3 h-3" /> Verify Credential <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {cert.image && (
                <div className="w-full md:w-64 shrink-0">
                  <a href={resolveMediaUrl(cert.image)} target="_blank" rel="noreferrer" className="block img-editorial overflow-hidden bg-[#121212] p-2 interactive-lift">
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
        ))}

        {certifications.length === 0 && (
          <div className="text-editorial-textMuted font-mono text-sm uppercase tracking-widest py-8">
            No certifications data currently available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsPage;
