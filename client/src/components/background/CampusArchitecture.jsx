import React from 'react';
import DigitalBuilding from './DigitalBuilding';

const CampusArchitecture = () => {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 🎓 EDUCATION HUB (Top Left) */}
      <DigitalBuilding title="EDUCATION HUB" type="arch" xPercent={5} yPercent={18} width={140} height={170} opacity={0.18} />

      {/* 💻 CSE LAB (Top Right) */}
      <DigitalBuilding title="CSE LAB" type="tower" xPercent={85} yPercent={24} width={135} height={165} opacity={0.18} />

      {/* 📚 DIGITAL LIBRARY (Mid Left) */}
      <DigitalBuilding title="DIGITAL LIBRARY" type="platform" xPercent={8} yPercent={52} width={145} height={155} opacity={0.17} />

      {/* 🧪 PROJECT LAB (Mid Right) */}
      <DigitalBuilding title="PROJECT LAB" type="tower" xPercent={84} yPercent={62} width={140} height={170} opacity={0.19} />

      {/* 🏢 CAREER CENTER (Bottom Left) */}
      <DigitalBuilding title="CAREER CENTER" type="arch" xPercent={4} yPercent={78} width={150} height={175} opacity={0.18} />

      {/* 🏆 ACHIEVEMENT PLAZA (Bottom Right) */}
      <DigitalBuilding title="ACHIEVEMENT PLAZA" type="platform" xPercent={82} yPercent={85} width={135} height={150} opacity={0.17} />
    </div>
  );
};

export default CampusArchitecture;
