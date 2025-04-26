import React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useDeviceContext } from '../context/DeviceContext';

const DevicePreview = () => {
  const { activeDevice, setActiveDevice } = useDeviceContext();

  return (
    <div className="flex items-center bg-slate-100 rounded-md overflow-hidden">
      <button
        className={`p-2 ${
          activeDevice === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
        }`}
        onClick={() => setActiveDevice('desktop')}
        title="Desktop View"
      >
        <Monitor size={18} />
      </button>
      <button
        className={`p-2 ${
          activeDevice === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
        }`}
        onClick={() => setActiveDevice('tablet')}
        title="Tablet View"
      >
        <Tablet size={18} />
      </button>
      <button
        className={`p-2 ${
          activeDevice === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
        }`}
        onClick={() => setActiveDevice('mobile')}
        title="Mobile View"
      >
        <Smartphone size={18} />
      </button>
    </div>
  );
};

export default DevicePreview;