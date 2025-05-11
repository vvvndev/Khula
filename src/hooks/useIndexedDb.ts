import { useState, useEffect } from 'react';

interface IndexedDbOptions {
  dbName: string;
  version?: number;
  stores: {
    name: string;
    keyPath: string;
    indexes?: { name: string; keyPath: string; options?: IDBIndexParameters }[];
  }[];
}

export const useIndexedDb = (options: IndexedDbOptions) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const openDb = () => {
      setIsLoading(true);
      const request = indexedDB.open(options.dbName, options.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        options.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });
            
            // Create indexes if specified
            store.indexes?.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, index.options);
            });
          }
        });
      };

      request.onsuccess = (event) => {
        if (!isMounted) return;
        const db = (event.target as IDBOpenDBRequest).result;
        setDb(db);
        setIsLoading(false);
      };

      request.onerror = (event) => {
        if (!isMounted) return;
        setError(new Error(`Failed to open database: ${(event.target as IDBOpenDBRequest).error}`));
        setIsLoading(false);
      };
    };

    openDb();

    return () => {
      isMounted = false;
      if (db) {
        db.close();
      }
    };
  }, [options.dbName, options.version]);

  const addItem = async <T>(storeName: string, item: T): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => resolve(item);
        request.onerror = () => reject(new Error(`Failed to add item: ${request.error}`));
      } catch (err) {
        reject(err);
      }
    });
  };

  const getItem = async <T>(storeName: string, key: IDBValidKey): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error(`Failed to get item: ${request.error}`));
      } catch (err) {
        reject(err);
      }
    });
  };

  const updateItem = async <T>(storeName: string, item: T): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve(item);
        request.onerror = () => reject(new Error(`Failed to update item: ${request.error}`));
      } catch (err) {
        reject(err);
      }
    });
  };

  const deleteItem = async (storeName: string, key: IDBValidKey): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Failed to delete item: ${request.error}`));
      } catch (err) {
        reject(err);
      }
    });
  };

  const getAllItems = async <T>(storeName: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error(`Failed to get all items: ${request.error}`));
      } catch (err) {
        reject(err);
      }
    });
  };

  return {
    db,
    error,
    isLoading,
    addItem,
    getItem,
    updateItem,
    deleteItem,
    getAllItems
  };
};