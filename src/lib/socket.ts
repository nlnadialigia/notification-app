import { io, Socket } from 'socket.io-client';
import type { Notification } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private connectionStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
  private statusListeners: Set<(status: 'connected' | 'disconnected' | 'error') => void> = new Set();

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.setConnectionStatus('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.setConnectionStatus('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.setConnectionStatus('error');
    });

    this.socket.on('notification', (notification: Notification) => {
      console.log('📬 New notification received:', notification);
      const listeners = this.listeners.get('notification');
      if (listeners) {
        listeners.forEach((callback) => callback(notification));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.setConnectionStatus('disconnected');
      console.log('Socket disconnected');
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  onStatusChange(callback: (status: 'connected' | 'disconnected' | 'error') => void) {
    this.statusListeners.add(callback);
    callback(this.connectionStatus);

    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private setConnectionStatus(status: 'connected' | 'disconnected' | 'error') {
    this.connectionStatus = status;
    this.statusListeners.forEach((callback) => callback(status));
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getConnectionStatus(): 'connected' | 'disconnected' | 'error' {
    return this.connectionStatus;
  }
}

export const socketService = new SocketService();
