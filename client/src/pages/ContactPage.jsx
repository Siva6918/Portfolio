import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import useScrollObserver from '../hooks/useScrollObserver';
import ContactSection from '../components/sections/ContactSection';
import { getProfile } from '../services/api';

const ContactPage = () => {
  useScrollObserver();
  const { registerSectionRef } = useAnalytics();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    document.title = "Contact | Venkata Siva Reddy";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getProfile();
      if (res.data?.data) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching profile for contact:', err);
    }
  };

  const bgEven = "w-full bg-[#f4f6f9] dark:bg-[#0b0b14] transition-colors duration-300 min-h-screen pt-16";

  return (
    <div className="w-full space-y-0">
      <section ref={(el) => registerSectionRef(el, 'Contact')} className={bgEven}>
        <ContactSection email={profile?.email} profile={profile} />
      </section>
    </div>
  );
};

export default ContactPage;
