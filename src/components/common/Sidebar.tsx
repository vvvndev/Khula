import React from 'react';
import { Home, CreditCard, PiggyBank, BarChart4, Settings, Users, HelpCircle } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activePage, setActivePage }) => {
  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'banking', label: 'Banking', icon: <CreditCard size={20} /> },
    { id: 'microfinance', label: 'Microfinance', icon: <PiggyBank size={20} /> },
    { id: 'investments', label: 'Investments', icon: <BarChart4 size={20} /> },
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} /> },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    // On mobile, close the sidebar when navigating
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:sticky lg:top-0 lg:z-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="px-6 py-6 flex items-center border-b border-gray-200">
            <span className="text-2xl font-bold text-green-600">Khula</span>
            <span className="text-sm text-gray-500 ml-2">Financial</span>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 py-4 px-3">
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Main
              </p>
              <ul>
                {mainNavItems.map((item) => (
                  <li key={item.id} className="mb-1">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full px-3 py-2 rounded-lg flex items-center transition-colors ${
                        activePage === item.id
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`${activePage === item.id ? 'text-green-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span className="ml-3 font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Account
              </p>
              <ul>
                {secondaryNavItems.map((item) => (
                  <li key={item.id} className="mb-1">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full px-3 py-2 rounded-lg flex items-center transition-colors ${
                        activePage === item.id
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`${activePage === item.id ? 'text-green-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span className="ml-3 font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Version info */}
          <div className="mt-auto px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">© 2025 Khula Financial</p>
            <p className="text-xs text-gray-400">v0.1.0 (Beta)</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;