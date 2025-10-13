// =====================================
// frontend/src/contexts/PrivacyContext.tsx
// =====================================

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PrivacySettings {
  level: 'maximum' | 'high' | 'selective' | 'minimal';
  anonymization: boolean;
  dataRetention: number; // days
  sharing: boolean;
}

interface PrivacyContextType {
  settings: PrivacySettings;
  updateSettings: (settings: Partial<PrivacySettings>) => void;
  isPrivacyEnabled: boolean;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

interface PrivacyProviderProps {
  children: ReactNode;
}

export const PrivacyProvider: React.FC<PrivacyProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<PrivacySettings>({
    level: 'selective',
    anonymization: true,
    dataRetention: 30,
    sharing: false
  });

  const updateSettings = (newSettings: Partial<PrivacySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const isPrivacyEnabled = settings.level !== 'minimal';

  const value: PrivacyContextType = {
    settings,
    updateSettings,
    isPrivacyEnabled
  };

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  );
};
