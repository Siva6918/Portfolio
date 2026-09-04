import React, { useEffect } from 'react';
import { X, Download, ExternalLink, Sparkles } from 'lucide-react';
import { useProfileModal } from '../../context/ProfileModalContext';

const ProfileModal = () => {
  const { isOpen, profileImage, closeProfile } = useProfileModal();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeProfile();
      }
    };

    // Lock body scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeProfile]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full Profile View"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in"
      onClick={closeProfile}
    >
      {/* 1. Deep backdrop blur blurring the entire homepage portion */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl transition-all duration-300"
      />

      {/* 2. Centered Modal Dialog Card with Timeline Card Aesthetics */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-w-xl w-full rounded-3xl border overflow-hidden flex flex-col items-center transition-all duration-300 animate-scale-in"
        style={{
          background: 'rgba(12, 12, 18, 0.96)',
          borderColor: 'rgba(74, 222, 128, 0.45)',
          boxShadow: '0 0 50px -10px rgba(74, 222, 128, 0.35), 0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* Top vibrant accent gradient line */}
        <div
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, #4ade80, #38bdf8, #c084fc, #4ade80)',
          }}
        />

        {/* Modal Header */}
        <div className="w-full px-5 py-4 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ background: '#4ade80' }}
            />
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>VENKATA SIVA REDDY</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                  PROFILE
                </span>
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Software Engineer • RGMCET CSE (2027)
              </p>
            </div>
          </div>

          <button
            onClick={closeProfile}
            className="group p-2 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Modal Body: Uncropped Full Image */}
        <div className="relative p-4 sm:p-6 w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-black/40">
          <div
            className="relative rounded-2xl overflow-hidden border p-1"
            style={{
              borderColor: 'rgba(56, 189, 248, 0.35)',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.15)',
              background: 'rgba(9, 9, 11, 0.9)',
            }}
          >
            <img
              src={profileImage}
              alt="Venkata Siva Reddy - Full Profile"
              className="max-h-[62vh] sm:max-h-[70vh] w-auto max-w-full object-contain rounded-xl select-none"
              onError={(e) => {
                e.target.src = '/Avatar.png';
              }}
            />
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="w-full px-5 py-3.5 border-t border-zinc-800/80 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open for Software Engineering Internships</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profileImage}
              download="Siva_Profile.png"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save</span>
            </a>

            <button
              onClick={closeProfile}
              className="px-4 py-1.5 rounded-xl text-xs font-mono font-semibold text-white transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #4ade80, #38bdf8)',
                boxShadow: '0 0 16px rgba(74, 222, 128, 0.3)',
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
