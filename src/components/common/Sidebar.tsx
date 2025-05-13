import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, TrendingUp, PiggyBank, BarChart2, Settings, HelpCircle, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const mainNavItems: NavItem[] = [
    { id: 'pools', label: t('capitalPools'), icon: <Users size={20} />, path: '/pools' },
    { id: 'ventures', label: t('p2pFunding'), icon: <TrendingUp size={20} />, path: '/ventures' },
    { id: 'portfolio', label: t('myContributionsWallet'), icon: <PiggyBank size={20} />, path: '/portfolio' },
    { id: 'performance', label: t('investmentReturns'), icon: <BarChart2 size={20} />, path: '/performance' },
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'settings', label: t('settings'), icon: <Settings size={20} />, path: '/settings' },
    { id: 'support', label: t('support'), icon: <HelpCircle size={20} />, path: '/support' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:sticky lg:top-0 lg:z-0
      `}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 flex items-center border-b border-gray-200">
            <span className="text-2xl font-bold text-green-600">{t('appName')}</span>
          </div>

          <nav className="flex-1 py-4 px-3">
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {t('investments')}
              </p>
              <ul>
                {mainNavItems.map((item) => (
                  <li key={item.id} className="mb-1">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        w-full px-3 py-2 rounded-lg flex items-center transition-colors
                        ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      <span className="text-gray-500">{item.icon}</span>
                      <span className="ml-3 font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {t('account')}
              </p>
              <ul>
                {secondaryNavItems.map((item) => (
                  <li key={item.id} className="mb-1">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        w-full px-3 py-2 rounded-lg flex items-center transition-colors
                        ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      <span className="text-gray-500">{item.icon}</span>
                      <span className="ml-3 font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="mt-auto px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut size={20} className="text-gray-500" />
              <span className="ml-3 font-medium">{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;