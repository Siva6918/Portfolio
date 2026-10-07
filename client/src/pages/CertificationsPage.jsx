import React, { useEffect, useState } from 'react';
import { getCertifications } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="section-container animate-fade-in pt-32">
      <h1 className="text-4xl sm:text-5xl font-bold mb-16 font-grotesk text-white">Certifications</h1>
      
      <div className="flex flex-col">
        {certifications.map(cert => (
          <div key={cert._id} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-8 border-b border-editorial-border">
            <div className="font-mono text-xs text-editorial-textMuted uppercase tracking-widest pt-1">
              <div>{cert.date}</div>
              <div className="mt-2 text-editorial-accent">{cert.issuer}</div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 font-grotesk">{cert.name}</h3>
              {cert.description && (
                <p className="text-editorial-textMain text-base mb-4 max-w-2xl">{cert.description}</p>
              )}
              
              <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wider">
                {cert.credentialId && (
                  <span className="text-editorial-textMuted border border-editorial-border px-2 py-1 bg-editorial-surface">ID: {cert.credentialId}</span>
                )}
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noreferrer" className="text-editorial-accent hover:text-editorial-accentHover border border-editorial-accent px-2 py-1 transition-colors">
                    Verify Credential ↗
                  </a>
                )}
              </div>
            </div>
          </div>
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
