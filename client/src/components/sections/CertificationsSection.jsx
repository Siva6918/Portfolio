import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import SwipeableCarousel from '../common/SwipeableCarousel';
import CertificationsDetailModal from '../common/CertificationsDetailModal';

const easeCurve = [0.16, 1, 0.3, 1];

const defaultCertsFallback = [
  {
    _id: '1',
    title: 'AWS Certified Cloud Practitioner',
    organization: 'Amazon Web Services',
    issueDate: '2024',
    credentialId: 'AWS-CCP-100293',
    credentialUrl: 'https://aws.amazon.com/verification',
    description: 'Validated foundational knowledge of AWS Cloud architecture, IAM security, compute (EC2), and database services (S3/RDS).'
  },
  {
    _id: '2',
    title: 'Full Stack Web Development with Node.js & React',
    organization: 'Udemy / Coursera',
    issueDate: '2024',
    credentialId: 'FSWD-98214',
    credentialUrl: '',
    description: 'Mastered full-stack MERN architecture, RESTful API design, database schemas, and client-side state management.'
  }
];

const CertificationsSection = ({ certifications = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeCerts = certifications.length > 0 ? certifications : defaultCertsFallback;

  return (
    <section id="certifications" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
      <div className="section-container">
        
        {/* Header Stagger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.0, ease: easeCurve }}
              className="text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold block"
            >
              06 // CREDENTIALS & CERTIFICATIONS
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Verified Certifications
            </motion.h2>
          </div>

          <div className="flex items-center gap-3">
            {/* See More Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>SEE MORE CERTIFICATIONS ({activeCerts.length})</span>
            </button>
          </div>
        </div>

        {/* Mobile View Swipe Carousel (md:hidden) */}
        <div className="block md:hidden">
          <SwipeableCarousel showDots={true}>
            {activeCerts.map((cert) => (
              <div key={cert._id || cert.title} className="editorial-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                    {cert.organization}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {cert.title}
                </h3>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {cert.description}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Issued: {cert.issueDate}</span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-indigo-500 font-bold hover:underline"
                  >
                    See More
                  </button>
                </div>
              </div>
            ))}
          </SwipeableCarousel>
        </div>

        {/* Desktop Certifications Grid (hidden on mobile md:grid) */}
        <div className="hidden md:grid grid-cols-2 gap-6">
          {activeCerts.map((cert, idx) => (
            <motion.div
              key={cert._id || cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: easeCurve }}
              className="editorial-card p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                    {cert.organization}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {cert.title}
                </h3>

                <p className="text-xs text-slate-700 dark:text-white/70 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-white/50">
                <span>Issued: {cert.issueDate}</span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  <span>See Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications Modal */}
        <CertificationsDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          certifications={activeCerts}
        />

      </div>
    </section>
  );
};

export default CertificationsSection;
