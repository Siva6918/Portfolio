import React from 'react';
import { motion } from 'framer-motion';

const easeCurve = [0.16, 1, 0.3, 1];

const learningTopics = [
  {
    topic: 'Data Structures & Algorithms (Java)',
    status: 'In Progress',
    note: 'Active practice in Dynamic Programming, Graphs, and Tree Traversal routines on LeetCode.',
    tag: 'CORE CS'
  },
  {
    topic: 'System Design & Scalable Architecture',
    status: 'In Progress',
    note: 'Studying distributed caching with Redis, Database Indexing, and Load Balancing strategies.',
    tag: 'BACKEND'
  },
  {
    topic: 'Full Stack MERN & Next.js 14',
    status: 'Advanced',
    note: 'Building responsive apps with Server-Side Rendering (SSR), App Router, and JWT Auth.',
    tag: 'FULL STACK'
  },
  {
    topic: 'AI / ML & RAG Pipeline Integration',
    status: 'Exploring',
    note: 'Integrating Python FastAPI microservices, spaCy NLP parsing, and vector search embeddings.',
    tag: 'AI ENGINE'
  }
];

const LearningJournalSection = () => {
  return (
    <section id="journal" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
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
              08 // CONTINUOUS LEARNING
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Currently Learning Journal
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="text-xs font-mono text-slate-600 dark:text-white/50 max-w-xs"
          >
            Authentic technical focus areas and ongoing growth topics for 2026.
          </motion.p>
        </div>

        {/* Learning Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningTopics.map((item, idx) => (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: easeCurve }}
              className="editorial-card p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50">
                    [{item.tag}]
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    ● {item.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.topic}
                </h3>

                <p className="text-xs text-slate-700 dark:text-white/70 leading-relaxed">
                  {item.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LearningJournalSection;
