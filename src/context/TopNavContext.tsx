'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface GlobalContextProps {
  isTopNavVisible: boolean;
  setTopNavVisible: (visible: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isMobile: boolean;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isTopNavVisible, setTopNavVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      handleResize(); // Check on initial render
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isTopNavVisible,
        setTopNavVisible,
        isLoading,
        setIsLoading,
        isMobile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
