import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, resolveMediaUrl } from '../services/api';

const ProfileModalContext = createContext();

export const ProfileModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('/Avatar.png');

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await getProfile();
        if (res.data?.data?.profileImage) {
          setProfileImage(resolveMediaUrl(res.data.data.profileImage));
        }
      } catch (err) {
        // Fallback to /Avatar.png
      }
    };
    fetchAvatar();
  }, []);

  const openProfile = (customSrc) => {
    if (customSrc && typeof customSrc === 'string') {
      setProfileImage(customSrc);
    }
    setIsOpen(true);
  };

  const closeProfile = () => {
    setIsOpen(false);
  };

  return (
    <ProfileModalContext.Provider
      value={{
        isOpen,
        profileImage,
        setProfileImage,
        openProfile,
        closeProfile,
      }}
    >
      {children}
    </ProfileModalContext.Provider>
  );
};

export const useProfileModal = () => {
  const context = useContext(ProfileModalContext);
  if (!context) {
    throw new Error('useProfileModal must be used within a ProfileModalProvider');
  }
  return context;
};
