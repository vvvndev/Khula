// Payment providers
export enum PaymentProvider {
  BHADALA = 'bhadala',
  ECOCASH = 'ecocash',
  FLUTTERWAVE = 'flutterwave',
  PAYNOW = 'paynow'
}

// Payment methods
export enum PaymentMethod {
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  CARD = 'card',
  WALLET = 'wallet'
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Payment currency
export enum Currency {
  USD = 'USD',
  ZWL = 'ZWL',
  ZAR = 'ZAR'
}

// Payment request interface
export interface PaymentRequest {
  amount: number;
  currency: Currency;
  description: string;
  reference?: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
  provider?: PaymentProvider;
  methods?: PaymentMethod[];
  redirectUrl?: string;
}

// Payment response interface
export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  paymentUrl?: string; // URL to redirect the user to complete payment
  provider: PaymentProvider;
  reference: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Mock implementation of the Bhadala payment provider
class BhadalaProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.bhadala.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Create a payment
  public async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // In a real implementation, this would make an API call to Bhadala
    // For now, we'll simulate a successful response
    return {
      id: `bhd_${Date.now()}`,
      status: PaymentStatus.PENDING,
      amount: request.amount,
      currency: request.currency,
      paymentUrl: `https://checkout.bhadala.com/pay/${Date.now()}`,
      provider: PaymentProvider.BHADALA,
      reference: request.reference || `ref_${Date.now()}`,
      timestamp: Date.now(),
      metadata: request.metadata
    };
  }

  // Check payment status
  public async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    // Simulate API call to check status
    return PaymentStatus.PENDING;
  }
}

// Fallback provider interface
interface FallbackProvider {
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  checkPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}

// Mock implementation of EcoCash provider
class EcoCashProvider implements FallbackProvider {
  public async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      id: `eco_${Date.now()}`,
      status: PaymentStatus.PENDING,
      amount: request.amount,
      currency: request.currency,
      paymentUrl: `https://ecocash.co.zw/pay/${Date.now()}`,
      provider: PaymentProvider.ECOCASH,
      reference: request.reference || `ref_${Date.now()}`,
      timestamp: Date.now(),
      metadata: request.metadata
    };
  }

  public async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return PaymentStatus.PENDING;
  }
}

// Mock implementation of Flutterwave provider
class FlutterwaveProvider implements FallbackProvider {
  public async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      id: `flw_${Date.now()}`,
      status: PaymentStatus.PENDING,
      amount: request.amount,
      currency: request.currency,
      paymentUrl: `https://checkout.flutterwave.com/pay/${Date.now()}`,
      provider: PaymentProvider.FLUTTERWAVE,
      reference: request.reference || `ref_${Date.now()}`,
      timestamp: Date.now(),
      metadata: request.metadata
    };
  }

  public async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return PaymentStatus.PENDING;
  }
}

// Main payment gateway with redundancy
export class PaymentGateway {
  private primaryProvider: BhadalaProvider;
  private fallbackProviders: Record<PaymentProvider, FallbackProvider>;
  private offlineQueue: PaymentRequest[] = [];

  constructor(bhadalaApiKey: string) {
    this.primaryProvider = new BhadalaProvider(bhadalaApiKey);
    
    // Initialize fallback providers
    this.fallbackProviders = {
      [PaymentProvider.ECOCASH]: new EcoCashProvider(),
      [PaymentProvider.FLUTTERWAVE]: new FlutterwaveProvider(),
      [PaymentProvider.PAYNOW]: new FlutterwaveProvider(), // Placeholder
      [PaymentProvider.BHADALA]: this.primaryProvider as unknown as FallbackProvider
    };
  }

  // Process a payment with fallback options
  public async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // If offline, queue the payment for processing when online
    if (!navigator.onLine) {
      this.offlineQueue.push(request);
      throw new Error('Device is offline. Payment will be processed when online.');
    }

    // Try with primary provider first
    try {
      return await this.primaryProvider.createPayment(request);
    } catch (error) {
      console.error('Primary payment provider failed:', error);
      
      // Try fallback based on currency or specified provider
      const fallbackProvider = this.selectFallbackProvider(request);
      
      try {
        return await fallbackProvider.createPayment(request);
      } catch (fallbackError) {
        console.error('Fallback payment provider failed:', fallbackError);
        throw new Error('All payment providers failed. Please try again later.');
      }
    }
  }

  // Select appropriate fallback provider based on request
  private selectFallbackProvider(request: PaymentRequest): FallbackProvider {
    // If specific provider is requested, use it
    if (request.provider && request.provider !== PaymentProvider.BHADALA) {
      return this.fallbackProviders[request.provider];
    }
    
    // Otherwise select based on currency
    switch (request.currency) {
      case Currency.ZWL:
        return this.fallbackProviders[PaymentProvider.ECOCASH];
      case Currency.ZAR:
      case Currency.USD:
      default:
        return this.fallbackProviders[PaymentProvider.FLUTTERWAVE];
    }
  }

  // Process offline payment queue when back online
  public processOfflineQueue(): Promise<PaymentResponse[]> {
    const promises = this.offlineQueue.map(request => this.processPayment(request));
    this.offlineQueue = [];
    return Promise.all(promises);
  }

  // Check payment status across providers
  public async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    // Determine provider from payment ID prefix
    if (paymentId.startsWith('bhd_')) {
      return this.primaryProvider.checkPaymentStatus(paymentId);
    } else if (paymentId.startsWith('eco_')) {
      return this.fallbackProviders[PaymentProvider.ECOCASH].checkPaymentStatus(paymentId);
    } else if (paymentId.startsWith('flw_')) {
      return this.fallbackProviders[PaymentProvider.FLUTTERWAVE].checkPaymentStatus(paymentId);
    }
    
    // Try all providers if prefix doesn't match
    for (const provider of Object.values(this.fallbackProviders)) {
      try {
        return await provider.checkPaymentStatus(paymentId);
      } catch (error) {
        console.error('Provider failed to check status:', error);
      }
    }
    
    throw new Error('Unable to determine payment status');
  }
}

// Create singleton instance with a placeholder API key
// In a real app, this would come from environment config
export const paymentGateway = new PaymentGateway('BHADALA_API_KEY_PLACEHOLDER');