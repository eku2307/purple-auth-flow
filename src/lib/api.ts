const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined at build time");
}

class ApiClient {
  private getBaseOptions(): RequestInit {
    const token = localStorage.getItem("jwt_token");

    return {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "GET");
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, "POST", data);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, "PUT", data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "DELETE");
  }

  private async request<T>(
    endpoint: string,
    method: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...this.getBaseOptions(),
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw await this.extractError(response);
    }

    return response.json();
  }

  private async extractError(res: Response): Promise<Error> {
    try {
      const err = await res.json();
      return new Error(err.message || `HTTP ${res.status}`);
    } catch {
      return new Error(`HTTP ${res.status}`);
    }
  }
}

export const apiClient = new ApiClient();
