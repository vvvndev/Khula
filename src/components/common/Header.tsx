import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Bell, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={toggleSidebar}
              className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="flex items-center">
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className="mr-4 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="en">English</option>
              <option value="nd">Ndebele</option>
              <option value="sn">Shona</option>
            </select>

            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell size={20} />
            </button>

            <div className="ml-3 relative">
              <div className="flex items-center">
                <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <span className="sr-only">{t('openUserMenu')}</span>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User size={20} className="text-green-600" />
                  </div>
                </button>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('investor')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;