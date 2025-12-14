const API_BASE_URL = 'https://d1sj9f5n6y3ndx.cloudfront.net';

class ApiClient {
  private getBaseOptions(): RequestInit {
    const token = localStorage.getItem('jwt_token');

    return {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...this.getBaseOptions(),
      method: 'GET',
    });
    if (!response.ok) throw await this.extractError(response);
    return response.json();
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...this.getBaseOptions(),
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw await this.extractError(response);
    return response.json();
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...this.getBaseOptions(),
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw await this.extractError(response);
    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...this.getBaseOptions(),
      method: 'DELETE',
    });
    if (!response.ok) throw await this.extractError(response);
    return response.json();
  }

  private async extractError(res: Response) {
    const err = await res.json().catch(() => ({}));
    return new Error(err.message || `HTTP ${res.status}`);
  }
}

export const apiClient = new ApiClient();
