import React from 'react';
import AmbientBackground from './AmbientBackground';
import PerspectiveGrid from './PerspectiveGrid';
import CareerRoad from './CareerRoad';
import CampusArchitecture from './CampusArchitecture';
import FloatingCode from './FloatingCode';

const DigitalCampusBackground = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#09090b]">
      {/* 4 Background Layers (Fixed, pointer-events-none, aria-hidden="true") */}
      <AmbientBackground />
      <PerspectiveGrid />
      <CampusArchitecture />
      <CareerRoad />
      <FloatingCode />

      {/* Main Content Layer (Z-10, fully interactive) */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default DigitalCampusBackground;
