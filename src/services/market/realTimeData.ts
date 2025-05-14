import { io, Socket } from 'socket.io-client';

export class MarketDataService {
  private socket: Socket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    this.socket = io(import.meta.env.VITE_MARKET_DATA_WS_URL, {
      auth: {
        token: import.meta.env.VITE_MARKET_DATA_API_KEY
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to market data service');
    });

    this.socket.on('marketUpdate', (data) => {
      this.notifySubscribers('market', data);
    });

    this.socket.on('rateUpdate', (data) => {
      this.notifySubscribers('rates', data);
    });

    this.socket.on('error', (error) => {
      console.error('Market data service error:', error);
    });
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel)?.add(callback);

    if (this.socket) {
      this.socket.emit('subscribe', channel);
    }
  }

  unsubscribe(channel: string, callback: (data: any) => void) {
    this.subscribers.get(channel)?.delete(callback);
    if (this.subscribers.get(channel)?.size === 0) {
      this.socket?.emit('unsubscribe', channel);
    }
  }

  private notifySubscribers(channel: string, data: any) {
    this.subscribers.get(channel)?.forEach(callback => callback(data));
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.subscribers.clear();
  }
}

export const marketDataService = new MarketDataService();