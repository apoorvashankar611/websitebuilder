import React, { createContext, useContext, useState, ReactNode } from 'react';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DeviceContextType {
  activeDevice: DeviceType;
  setActiveDevice: (device: DeviceType) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');

  return (
    <DeviceContext.Provider value={{ activeDevice, setActiveDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
};