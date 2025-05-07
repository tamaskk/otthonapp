import React, { useEffect, useState } from 'react';

interface ViewModeSwitchProps {
  onViewChange: (mode: 'grid' | 'table') => void;
  storageKey: string;
  defaultView?: 'grid' | 'table';
}

const ViewModeSwitch: React.FC<ViewModeSwitchProps> = ({ 
  onViewChange, 
  storageKey,
  defaultView = 'grid'
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(defaultView);

  useEffect(() => {
    const savedViewMode = localStorage.getItem(storageKey);
    if ((savedViewMode === 'grid' || savedViewMode === 'table') && savedViewMode !== viewMode) {
      setViewMode(savedViewMode);
      onViewChange(savedViewMode);
    }
  }, [storageKey]);

  const handleSwitch = () => {
    const newMode = viewMode === 'grid' ? 'table' : 'grid';
    setViewMode(newMode);
    onViewChange(newMode);
    localStorage.setItem(storageKey, newMode);
  };

  return (
    <button
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
      onClick={handleSwitch}
    >
      <span
        className={`${
          viewMode === 'grid' ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
      <span className={`absolute left-1 ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400'}`}>
        {/* Grid icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </span>
      <span className={`absolute right-1 ${viewMode === 'table' ? 'text-blue-600' : 'text-gray-400'}`}>
        {/* Table icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
        </svg>
      </span>
    </button>
  );
};

export default ViewModeSwitch;
