import React, { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [isPlayMode, setIsPlayMode] = useState(false);

  const togglePlayMode = () => {
    setIsPlayMode((prev) => !prev);
  };

  return (
    <ModeContext.Provider value={{ isPlayMode, togglePlayMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    return { isPlayMode: false, togglePlayMode: () => {} };
  }
  return context;
};

export default ModeContext;
