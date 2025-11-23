import { apiClient } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
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
    return apiClient.post('/auth/register', userData);
  },

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
