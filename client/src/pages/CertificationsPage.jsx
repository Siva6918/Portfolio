import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import useScrollObserver from '../hooks/useScrollObserver';
import CertificationsSection from '../components/sections/CertificationsSection';
import { getCertifications } from '../services/api';

const CertificationsPage = () => {
  useScrollObserver();
  const { registerSectionRef } = useAnalytics();
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    document.title = "Certifications | Venkata Siva Reddy";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCertifications();
      if (res.data?.data) {
        setCertifications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching certifications:', err);
    }
  };

  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300 min-h-screen pt-16";

  return (
    <div className="w-full space-y-0">
      <section ref={(el) => registerSectionRef(el, 'Certifications')} className={bgEven}>
        <CertificationsSection certifications={certifications} />
      </section>
    </div>
  );
};

export default CertificationsPage;
