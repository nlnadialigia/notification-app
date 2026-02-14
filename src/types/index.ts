export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  googleId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
}
