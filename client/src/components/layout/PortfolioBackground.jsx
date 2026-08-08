import React from 'react';
import AmbientBackground from '../background/AmbientBackground';
import PerspectiveGrid from '../background/PerspectiveGrid';
import CampusArchitecture from '../background/CampusArchitecture';
import CareerRoad from '../background/CareerRoad';
import FloatingCode from '../background/FloatingCode';

const PortfolioBackground = () => {
  return (
    <>
      <AmbientBackground />
      <PerspectiveGrid />
      <CampusArchitecture />
      <CareerRoad />
      <FloatingCode />
    </>
  );
};

export default PortfolioBackground;
