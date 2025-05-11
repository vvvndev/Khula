import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import Banking from './pages/Banking';
import Microfinance from './pages/Microfinance';
import Investments from './pages/Investments';
import { OfflineProvider } from './contexts/OfflineContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  
  // Close sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render the active page
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'banking':
        return <Banking />;
      case 'microfinance':
        return <Microfinance />;
      case 'investments':
        return <Investments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <OfflineProvider>
      <div className="min-h-screen bg-gray-50">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex pt-16">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            activePage={activePage}
            setActivePage={setActivePage}
          />
          
          <main className="flex-1 p-4 lg:p-6 lg:ml-64">
            {renderPage()}
          </main>
        </div>
      </div>
    </OfflineProvider>
  );
}

export default App;