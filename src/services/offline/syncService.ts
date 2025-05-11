import { SyncQueueItem } from './indexedDb';

// Options for the sync service
interface SyncServiceOptions {
  apiBaseUrl: string;
  syncInterval?: number; // milliseconds
  maxRetries?: number;
  requireOnline?: boolean;
}

// Default options
const defaultOptions: SyncServiceOptions = {
  apiBaseUrl: '/api',
  syncInterval: 60000, // 1 minute
  maxRetries: 5,
  requireOnline: true
};

export class SyncService {
  private db: IDBDatabase | null = null;
  private options: SyncServiceOptions;
  private syncIntervalId: number | null = null;
  private isSyncing = false;

  constructor(options: Partial<SyncServiceOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  // Initialize the sync service with a database connection
  public initialize(db: IDBDatabase): void {
    this.db = db;
    
    // Setup listeners for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    // Start periodic sync if online
    if (navigator.onLine) {
      this.startPeriodicSync();
    }
  }

  // Clean up listeners when service is no longer needed
  public destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    if (this.syncIntervalId !== null) {
      window.clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  // Handle coming online
  private handleOnline = (): void => {
    console.log('Device is online, starting sync...');
    this.startPeriodicSync();
    this.syncNow();
  };

  // Handle going offline
  private handleOffline = (): void => {
    console.log('Device is offline, pausing sync...');
    if (this.syncIntervalId !== null) {
      window.clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  };

  // Start periodic sync
  private startPeriodicSync(): void {
    if (this.syncIntervalId !== null) {
      window.clearInterval(this.syncIntervalId);
    }
    
    this.syncIntervalId = window.setInterval(() => {
      this.syncNow();
    }, this.options.syncInterval);
  }

  // Trigger sync now
  public syncNow(): Promise<void> {
    if (!this.db) {
      return Promise.reject(new Error('Database not initialized'));
    }
    
    if (this.isSyncing) {
      return Promise.resolve();
    }
    
    if (this.options.requireOnline && !navigator.onLine) {
      return Promise.reject(new Error('Device is offline'));
    }
    
    this.isSyncing = true;
    
    return this.processQueue()
      .finally(() => {
        this.isSyncing = false;
      });
  }

  // Process the sync queue
  private async processQueue(): Promise<void> {
    if (!this.db) {
      return Promise.reject(new Error('Database not initialized'));
    }
    
    try {
      const items = await this.getQueueItems();
      
      for (const item of items) {
        try {
          await this.syncItem(item);
          await this.removeFromQueue(item.id);
        } catch (error) {
          await this.updateItemAfterFailure(item, error as Error);
        }
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
      throw error;
    }
  }

  // Get items from the sync queue
  private getQueueItems(): Promise<SyncQueueItem[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.index('timestamp').getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Sync a single item
  private async syncItem(item: SyncQueueItem): Promise<void> {
    const { entityType, operation, data, entityId } = item;
    
    let url = `${this.options.apiBaseUrl}/${entityType}`;
    if (operation !== 'create') {
      url += `/${entityId}`;
    }
    
    const method = {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE'
    }[operation];
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: operation !== 'delete' ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    // If it's a successful sync, update the local data
    if (operation !== 'delete') {
      const responseData = await response.json();
      await this.updateLocalData(entityType, responseData);
    }
  }

  // Update local data after successful sync
  private updateLocalData(entityType: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction([entityType], 'readwrite');
      const store = transaction.objectStore(entityType);
      const request = store.put(data);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Remove an item from the sync queue
  private removeFromQueue(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Update an item after a sync failure
  private updateItemAfterFailure(item: SyncQueueItem, error: Error): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const updatedItem = {
        ...item,
        attempts: item.attempts + 1,
        lastAttempt: Date.now(),
        error: error.message
      };
      
      // If max retries exceeded, we might want to handle differently
      if (updatedItem.attempts > (this.options.maxRetries || 5)) {
        console.error(`Max retries exceeded for item ${item.id}`, item);
        // Here we could implement some fallback logic or notification
      }
      
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.put(updatedItem);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Add an item to the sync queue (to be called when making offline changes)
  public addToQueue(
    entityType: string,
    operation: 'create' | 'update' | 'delete',
    data: any,
    entityId?: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const id = entityId || data.id || crypto.randomUUID();
      
      const queueItem: SyncQueueItem = {
        id: crypto.randomUUID(),
        entityId: id,
        entityType,
        operation,
        data,
        timestamp: Date.now(),
        attempts: 0
      };
      
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.add(queueItem);
      
      request.onsuccess = () => {
        // Try to sync immediately if online
        if (navigator.onLine) {
          this.syncNow()
            .then(() => resolve())
            .catch(() => resolve()); // We resolve anyway since the item is in the queue
        } else {
          resolve();
        }
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Check if there are pending sync items
  public hasPendingSync(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = this.db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        resolve(countRequest.result > 0);
      };
      
      countRequest.onerror = () => {
        reject(countRequest.error);
      };
    });
  }
}

// Create a singleton instance
export const syncService = new SyncService();

// Helper function to initialize the sync service with a DB connection
export const initializeSyncService = (db: IDBDatabase): void => {
  syncService.initialize(db);
};