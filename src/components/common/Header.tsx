import React, { useState, useEffect } from 'react';
import { Menu, X, WifiOff, Wifi } from 'lucide-react';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const isOffline = useOfflineStatus();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 lg:hidden focus:outline-none"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">Khula</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Beta</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className={`flex items-center mr-4 px-3 py-1 rounded-full ${
            isOffline ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
          }`}>
            {isOffline ? (
              <><WifiOff size={16} className="mr-1" /> <span className="text-xs font-medium">Offline</span></>
            ) : (
              <><Wifi size={16} className="mr-1" /> <span className="text-xs font-medium">Online</span></>
            )}
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            KF
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;