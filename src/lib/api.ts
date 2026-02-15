import type {AuthResponse, CreateNotificationDto, Notification} from '@/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    const {data} = await apiClient.post<AuthResponse>('/auth/google', {idToken});
    return data;
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const {data} = await apiClient.get<Notification[]>('/notifications');
    return data;
  },

  create: async (notification: CreateNotificationDto): Promise<Notification> => {
    const {data} = await apiClient.post<Notification>('/notifications', notification);
    return data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const {data} = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return data;
  },
};
