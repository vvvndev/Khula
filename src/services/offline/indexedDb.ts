// Configuration for the IndexedDB database
export const dbConfig = {
  name: 'KhulaDB',
  version: 1,
  stores: [
    {
      name: 'transactions',
      keyPath: 'id',
      indexes: [
        { name: 'date', keyPath: 'date' },
        { name: 'type', keyPath: 'type' },
        { name: 'status', keyPath: 'status' }
      ]
    },
    {
      name: 'accounts',
      keyPath: 'id',
      indexes: [
        { name: 'currency', keyPath: 'currency' }
      ]
    },
    {
      name: 'loans',
      keyPath: 'id',
      indexes: [
        { name: 'status', keyPath: 'status' },
        { name: 'dueDate', keyPath: 'nextPayment.dueDate' }
      ]
    },
    {
      name: 'investments',
      keyPath: 'id',
      indexes: [
        { name: 'type', keyPath: 'type' },
        { name: 'status', keyPath: 'status' }
      ]
    },
    {
      name: 'userProfile',
      keyPath: 'id'
    },
    {
      name: 'syncQueue',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'type', keyPath: 'entityType' }
      ]
    }
  ]
};

// Interface for transaction objects
export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  currency: string;
  description: string;
  category?: string;
  date: string;
  accountId: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  metadata?: Record<string, any>;
}

// Interface for account objects
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
  cardType?: string;
  lastFour?: string;
  isActive: boolean;
}

// Interface for loan objects
export interface Loan {
  id: string;
  amount: number;
  currency: string;
  interestRate: number;
  term: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'rejected';
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
  paymentSchedule: Array<{
    date: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
  }>;
  progress?: number;
}

// Interface for investment objects
export interface Investment {
  id: string;
  name: string;
  type: 'business' | 'property' | 'fund';
  amount: number;
  currency: string;
  investedAmount: number;
  returnRate: number;
  term: number;
  startDate?: string;
  endDate?: string;
  status: 'open' | 'funded' | 'active' | 'completed';
  description: string;
  category?: string;
  payouts?: Array<{
    date: string;
    amount: number;
    status: 'pending' | 'paid';
  }>;
}

// Interface for user profile
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  preferences: {
    currency: string;
    notifications: boolean;
    language: string;
  };
}

// Interface for sync queue items
export interface SyncQueueItem {
  id: string;
  entityId: string;
  entityType: 'transaction' | 'account' | 'loan' | 'investment' | 'userProfile';
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  attempts: number;
  lastAttempt?: number;
  error?: string;
}

// Function to initialize the database
export const initializeDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbConfig.name, dbConfig.version);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores and indexes
      dbConfig.stores.forEach(store => {
        if (!db.objectStoreNames.contains(store.name)) {
          const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });
          
          // Create indexes
          store.indexes?.forEach(index => {
            objectStore.createIndex(index.name, index.keyPath);
          });
        }
      });
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};