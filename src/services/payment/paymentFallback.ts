import { Currency, PaymentMethod, PaymentProvider, PaymentRequest, PaymentResponse, PaymentStatus } from './paymentGateway';

// Interface for payment data to store offline
interface OfflinePaymentData extends PaymentRequest {
  id: string;
  timestamp: number;
  status: PaymentStatus;
}

// Payment fallback service for handling payments when offline
export class PaymentFallbackService {
  private dbName = 'KhulaDB';
  private storeName = 'offlinePayments';
  private db: IDBDatabase | null = null;

  // Initialize the database
  public async initialize(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to open offline payments database'));
      };
    });
  }

  // Store a payment for offline processing
  public async storeOfflinePayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const offlineId = `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const paymentData: OfflinePaymentData = {
        ...request,
        id: offlineId,
        timestamp: Date.now(),
        status: PaymentStatus.PENDING
      };

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const addRequest = store.add(paymentData);

      addRequest.onsuccess = () => {
        // Create a response to return to the caller
        const response: PaymentResponse = {
          id: offlineId,
          status: PaymentStatus.PENDING,
          amount: request.amount,
          currency: request.currency,
          provider: request.provider || PaymentProvider.BHADALA,
          reference: request.reference || `ref_${Date.now()}`,
          timestamp: paymentData.timestamp,
          metadata: { 
            isOffline: true,
            ...request.metadata
          }
        };

        resolve(response);
      };

      addRequest.onerror = () => {
        reject(new Error('Failed to store offline payment'));
      };
    });
  }

  // Get all pending offline payments
  public async getPendingPayments(): Promise<OfflinePaymentData[]> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('status');
      const request = index.getAll(PaymentStatus.PENDING);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve pending payments'));
      };
    });
  }

  // Update a payment status
  public async updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(paymentId);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          const payment = getRequest.result;
          payment.status = status;
          
          const updateRequest = store.put(payment);
          
          updateRequest.onsuccess = () => {
            resolve();
          };
          
          updateRequest.onerror = () => {
            reject(new Error('Failed to update payment status'));
          };
        } else {
          reject(new Error('Payment not found'));
        }
      };

      getRequest.onerror = () => {
        reject(new Error('Failed to retrieve payment'));
      };
    });
  }

  // Process pending payments when online
  public async processPendingPayments(
    processPaymentFn: (request: PaymentRequest) => Promise<PaymentResponse>
  ): Promise<[PaymentResponse[], Error[]]> {
    const pendingPayments = await this.getPendingPayments();
    const results: PaymentResponse[] = [];
    const errors: Error[] = [];

    for (const payment of pendingPayments) {
      try {
        // Remove the ID from the stored payment to create a fresh request
        const { id, timestamp, status, ...request } = payment;
        
        // Process the payment
        const response = await processPaymentFn(request);
        
        // Update the offline payment
        await this.updatePaymentStatus(id, PaymentStatus.COMPLETED);
        
        results.push(response);
      } catch (error) {
        errors.push(error as Error);
      }
    }

    return [results, errors];
  }
}

// Create a singleton instance
export const paymentFallbackService = new PaymentFallbackService();