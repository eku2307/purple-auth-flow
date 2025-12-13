import { apiClient } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  upiId: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  upiId: string;
  walletId: string;
  roles: string[];
}

export interface Wallet {
  walletId: string;
  balance: number;
  currency: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('jwt_token', response.token);
    localStorage.setItem('user_info', JSON.stringify(response));
    return response;
  },

  async register(userData: RegisterRequest): Promise<any> {
    return apiClient.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      upiId: userData.upiId
    });
  },

  /** GOOGLE LOGIN (SPRING BOOT) */
  async initiateGoogleLogin(): Promise<void> {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  },

  /** Store token from OAuthSuccess */
 handleOAuthCallback(token: string): void {
  localStorage.setItem('jwt_token', token);
}

  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/users/me');
  },

  async getWallet(): Promise<Wallet> {
    return apiClient.get<Wallet>('/users/wallet');
  },

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  },

  getCurrentUser(): AuthResponse | null {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }
};
