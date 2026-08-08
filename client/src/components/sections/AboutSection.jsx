import React from 'react';
import { User, Target, Cpu, MapPin, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

const AboutSection = ({ profile }) => {
  const longBio = profile?.longBio || 'Computer Science student capable of building scalable full-stack applications, designing robust backend architectures, and integrating AI/ML solutions into modern web platforms.';
  const careerGoal = profile?.careerGoal || 'Become a strong software engineer capable of building scalable applications and integrating AI-driven solutions into modern web platforms.';
  const currentFocus = profile?.currentFocus || 'MERN Stack, Data Structures & Algorithms, Cloud Infrastructure, AI Integration';

  return (
    <section id="about" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] flex items-center justify-center text-slate-900 dark:text-[#fafafa]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-800 dark:text-[#a1a1aa]">
              Background
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#fafafa]">
              About Me & Development Vision
            </h3>
          </div>
        </div>

        {/* Text + Statistics Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Bio Card */}
          <div className="lg:col-span-7 glass-card p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-[#27272a]">
            <h4 className="text-xl font-bold text-slate-900 dark:text-[#fafafa] flex items-center gap-2">
              <span>Who I Am</span>
            </h4>
            <p className="text-slate-800 dark:text-[#a1a1aa] leading-relaxed text-base font-medium">
              {longBio}
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-[#27272a] space-y-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-sky-600 dark:text-[#38bdf8] mt-1 shrink-0" />
                <div>
                  <span className="block text-xs font-mono font-bold uppercase text-slate-800 dark:text-[#a1a1aa]">Career Goal</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-[#fafafa] mt-0.5">{careerGoal}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Cpu className="w-5 h-5 text-orange-600 dark:text-[#f97316] mt-1 shrink-0" />
                <div>
                  <span className="block text-xs font-mono font-bold uppercase text-slate-800 dark:text-[#a1a1aa]">Current Focus</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-[#fafafa] mt-0.5">{currentFocus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-[#27272a] space-y-5">
              <h4 className="text-lg font-bold text-slate-900 dark:text-[#fafafa] border-b border-slate-200 dark:border-[#27272a] pb-3">
                Quick Metrics
              </h4>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-800 dark:text-[#a1a1aa] font-medium flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-sky-600 dark:text-[#38bdf8]" /> College
                  </span>
                  <span className="font-bold text-right text-slate-900 dark:text-[#fafafa] max-w-[200px] truncate">
                    RGMCET
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-800 dark:text-[#a1a1aa] font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600 dark:text-[#f97316]" /> Expected Graduation
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-[#f97316]">2027</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-800 dark:text-[#a1a1aa] font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#4ade80]" /> B.Tech CGPA
                  </span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-[#4ade80]">8.1</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-800 dark:text-[#a1a1aa] font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-700 dark:text-[#38bdf8]" /> Location
                  </span>
                  <span className="font-bold text-slate-900 dark:text-[#fafafa]">Andhra Pradesh, India</span>
                </div>
              </div>
            </div>

            {/* Core Values box */}
            <div className="p-6 rounded-3xl bg-slate-100 dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] text-xs space-y-2">
              <span className="font-mono font-bold text-slate-900 dark:text-[#38bdf8] uppercase">Engineering Philosophy</span>
              <p className="text-slate-800 dark:text-[#a1a1aa] font-medium">
                Write clean, testable code; build secure APIs; measure real-world performance; treat security as a first-class feature.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
