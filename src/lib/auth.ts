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
  /** EMAIL / PASSWORD LOGIN */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/api/auth/login',
      credentials
    );

    localStorage.setItem('jwt_token', response.token);
    localStorage.setItem('user_info', JSON.stringify(response));

    return response;
  },

  /** REGISTER */
  async register(userData: RegisterRequest): Promise<void> {
    await apiClient.post('/api/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      upiId: userData.upiId,
    });
  },

  /** GOOGLE OAUTH INIT */
  initiateGoogleLogin(): void {
    window.location.href =
      `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  },

  /** HANDLE OAUTH REDIRECT */
  handleOAuthCallback(token: string, userInfo?: AuthResponse): void {
    localStorage.setItem('jwt_token', token);
    if (userInfo) {
      localStorage.setItem('user_info', JSON.stringify(userInfo));
    }
  },

  /** CURRENT USER PROFILE */
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/api/users/me');
  },

  /** WALLET */
  async getWallet(): Promise<Wallet> {
    return apiClient.get<Wallet>('/api/users/wallet');
  },

  /** LOGOUT */
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  },

  /** AUTH STATE */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  },

  getCurrentUser(): AuthResponse | null {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  },
};
