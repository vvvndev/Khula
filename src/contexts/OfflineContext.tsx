import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { dbConfig } from '../services/offline/indexedDb';
import { useIndexedDb } from '../hooks/useIndexedDb';
import { initializeSyncService } from '../services/offline/syncService';

interface OfflineContextType {
  isOffline: boolean;
  isDbReady: boolean;
  pendingSyncCount: number;
  syncNow: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
  isDbReady: false,
  pendingSyncCount: 0,
  syncNow: async () => {}
});

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const isOffline = useOfflineStatus();
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  
  // Initialize IndexedDB
  const { db, isLoading } = useIndexedDb({
    dbName: dbConfig.name,
    version: dbConfig.version,
    stores: dbConfig.stores
  });

  // Initialize sync service when DB is ready
  useEffect(() => {
    if (db && !isLoading) {
      initializeSyncService(db);
    }
  }, [db, isLoading]);

  // Count pending sync items
  useEffect(() => {
    if (db && !isLoading) {
      const checkPendingCount = () => {
        const transaction = db.transaction(['syncQueue'], 'readonly');
        const store = transaction.objectStore('syncQueue');
        const countRequest = store.count();
        
        countRequest.onsuccess = () => {
          setPendingSyncCount(countRequest.result);
        };
      };
      
      // Check initially
      checkPendingCount();
      
      // Set up a timer to check periodically
      const intervalId = setInterval(checkPendingCount, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [db, isLoading]);

  // Trigger a sync
  const syncNow = async (): Promise<void> => {
    if (isOffline) {
      throw new Error('Cannot sync while offline');
    }
    
    // This would call the sync service's syncNow method
    // For now, let's just simulate it
    return new Promise(resolve => {
      setTimeout(() => {
        setPendingSyncCount(prev => Math.max(0, prev - Math.floor(Math.random() * prev)));
        resolve();
      }, 1000);
    });
  };

  const value = {
    isOffline,
    isDbReady: !isLoading && !!db,
    pendingSyncCount,
    syncNow
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOfflineContext = () => useContext(OfflineContext);