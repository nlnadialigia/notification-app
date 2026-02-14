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
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
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
};
